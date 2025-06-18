import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700",
          footerActionLink: "text-indigo-600 hover:text-indigo-500",
        },
      }}
    />
  );
}
