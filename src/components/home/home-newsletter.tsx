"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function HomeNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("You're on the Haven list!", {
      description: "One calm email a month — no noise, only good things.",
    });
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-secondary/50 p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Stay inspired
        </p>
        <h2 className="max-w-2xl text-balance font-display text-3xl leading-tight sm:text-4xl">
          Room ideas, new pieces and quiet offers
        </h2>
        <p className="max-w-lg text-pretty text-muted-foreground">
          Join the Haven list for styling tips, early access to new collections
          and 10% off your first order.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="home-newsletter" className="sr-only">
            Email address
          </label>
          <input
            id="home-newsletter"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button type="submit" size="lg">
            Sign up
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}