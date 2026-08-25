"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { customer } from "@/lib/account";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const PREF_ITEMS = [
  {
    key: "orderUpdates",
    label: "Order updates",
    description: "Tracking, dispatch and delivery emails.",
  },
  {
    key: "marketing",
    label: "Offers & inspiration",
    description: "New pieces, styling ideas and member offers.",
  },
  {
    key: "careTips",
    label: "Care tips",
    description: "Quarterly guides to keep your pieces beautiful.",
  },
] as const;

type PrefKey = (typeof PREF_ITEMS)[number]["key"];

const MEMBER_PERKS = [
  "Free delivery over £300",
  "10-year structural guarantee",
  "Early access to new arrivals",
];

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    },
  });

  const [prefs, setPrefs] = useState<Record<PrefKey, boolean>>({
    orderUpdates: true,
    marketing: false,
    careTips: true,
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated");
  };

  const handleSavePrefs = () => {
    toast.success("Communication preferences saved");
  };

  const togglePref = (key: PrefKey) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-6">
        <section className="rounded-3xl border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Personal details
          </p>
          <h2 className="mt-1 text-xl font-semibold">Your profile</h2>
          <form
            onSubmit={handleSubmit(handleSaveProfile)}
            className="mt-5 flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  className="h-11 rounded-full"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  className="h-11 rounded-full"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                className="h-11 rounded-full"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                className="h-11 rounded-full"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <Button type="submit" className="mt-1 self-start">
              Save changes
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Communication
          </p>
          <h2 className="mt-1 text-xl font-semibold">Preferences</h2>
          <div className="mt-5 flex flex-col divide-y divide-border">
            {PREF_ITEMS.map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={prefs[item.key]}
                  onCheckedChange={() => togglePref(item.key)}
                  aria-label={item.label}
                />
              </label>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={handleSavePrefs}>
            Save preferences
          </Button>
        </section>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
            Membership
          </p>
          <p className="mt-2 font-display text-2xl font-semibold">
            {customer.tier}
          </p>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Member since {customer.memberSince}
          </p>
          <p className="mt-4 rounded-2xl bg-primary-foreground/10 px-3 py-2 text-xs">
            Member number{" "}
            <span className="font-semibold">HAV-201834</span>
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {MEMBER_PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm">
                <BadgeCheck className="size-4 shrink-0 text-accent" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-card p-5 text-sm">
          <p className="font-semibold">Security</p>
          <p className="mt-1 text-muted-foreground">
            You use a password to sign in. We never store it in plain text.
          </p>
          <Button variant="ghost" className="mt-3 h-9 px-4 text-xs" onClick={() => toast.info("Password reset link sent to your inbox")}>
            Reset password
          </Button>
        </div>
      </aside>
    </div>
  );
}
