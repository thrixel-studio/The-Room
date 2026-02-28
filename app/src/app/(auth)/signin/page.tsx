import { SignInForm } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | The Room",
  description: "Sign in to The Room",
};

export default function SignIn() {
  return <SignInForm />;
}
