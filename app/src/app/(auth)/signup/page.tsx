import { SignUpForm } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | The Room",
  description: "Create your The Room account",
};

export default function SignUp() {
  return <SignUpForm />;
}
