import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "FREE",
  "STARTER",
  "GROWTH",
  "ENTERPRISE",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
]);
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "published",
]);
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plan: subscriptionPlanEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  priceId: text("price_id"),
  quantity: text("quantity"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  cancelAt: timestamp("cancel_at", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  trialStart: timestamp("trial_start", { withTimezone: true }),
  trialEnd: timestamp("trial_end", { withTimezone: true }),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});
export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  writtenTone: text("written_tone"),
  associatedAccount: text("associated_account"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  status: postStatusEnum("status").default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});
export const scheduledPosts = pgTable("scheduled_posts", {
  id: text("id").primaryKey(),
  postId: text("post_id").references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  scheduleTime: timestamp("schedule_time", { withTimezone: true }).notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  preferredPostingTime: text("preferred_posting_time").default("9am"),
  contentTone: text("content_tone").default("professional"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});
