"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password, "admin");
    if (!ok) {
      setError("Invalid staff credentials. Try the demo details below.");
      return;
    }
    toast.success("Welcome back, Haven Admin");
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="mx-auto grid w-full max-w-md gap-6 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">Haven Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage orders, products and customers.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-email">Staff email</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@haven.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-1 w-full" size="lg">
          Sign in to admin
        </Button>

        <p className="rounded-xl bg-secondary/60 px-3 py-2.5 text-center text-xs text-muted-foreground">
          Demo credentials — email{" "}
          <span className="font-semibold text-foreground">admin@haven.com</span>,
          password <span className="font-semibold text-foreground">admin</span>
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to the store
        </Link>
      </p>
    </div>
  );
}
