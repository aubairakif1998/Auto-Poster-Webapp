import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  console.log("Webhook received");

  // Get the headers
  const headersList = headers();
  const svix_id = (await headersList).get("svix-id");
  const svix_timestamp = (await headersList).get("svix-timestamp");
  const svix_signature = (await headersList).get("svix-signature");

  const webhookHeaders = {
    "svix-id": svix_id || "",
    "svix-timestamp": svix_timestamp || "",
    "svix-signature": svix_signature || "",
  };

  console.log("Headers received:", webhookHeaders);

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  console.log("Webhook body:", body);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, webhookHeaders) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log("Event type:", eventType);

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    console.log("User data:", {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    });

    const existingUser = await db.select().from(users).where(eq(users.id, id));
    if (existingUser.length > 0) {
      console.log("User already exists:", id);
      return new Response("User already exists", { status: 200 });
    }

    try {
      await db.insert(users).values({
        id: id,
        email: email_addresses[0]?.email_address,
        name: first_name
          ? `${first_name} ${last_name || ""}`.trim()
          : undefined,
        image: image_url || undefined,
        emailVerified: true,
        stripeCustomerId: "",
        stripeSubscriptionId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("User created successfully:", id);
      return new Response("User created successfully", { status: 201 });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
