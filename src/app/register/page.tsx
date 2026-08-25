import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Haven account for faster checkout and order tracking.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
