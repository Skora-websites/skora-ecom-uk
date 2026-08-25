"use client";

import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Reset link sent — check your inbox");
  };

  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        {sent ? (
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-700">
            <MailCheck className="size-6" />
          </span>
        ) : (
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <MailCheck className="size-6" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-semibold">
            {sent ? "Check your email" : "Reset your password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sent
              ? `We've sent a reset link to ${email || "your email"}. It expires in 30 minutes.`
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
        </div>
      </div>

      {!sent && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-1 w-full" size="lg">
            Send reset link
          </Button>
        </form>
      )}

      <Link
        href="/login"
        className="mx-auto flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to sign in
      </Link>
    </div>
  );
}
