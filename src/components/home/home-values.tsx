import { Leaf, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const values = [
  {
    icon: Truck,
    title: "Free delivery over £300",
    description:
      "Carbon-neutral courier, doorstep to room of your choice. Quick, careful and always on time.",
  },
  {
    icon: ShieldCheck,
    title: "10-year guarantee",
    description:
      "Every frame, seam and spring is guaranteed for a decade. Built to be lived on, not looked at.",
  },
  {
    icon: RotateCcw,
    title: "60-day home trial",
    description:
      "Live with it first. If it isn't right, we collect it free and refund you in full. No fuss.",
  },
  {
    icon: Leaf,
    title: "Responsibly made",
    description:
      "FSC-certified wood, OEKO-TEX fabrics and plastic-free packaging from recycled sources.",
  },
];

export function HomeValues() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(({ icon: Icon, title, description }, i) => (
          <li
            key={title}
            className="flex flex-col gap-3 rounded-[1.75rem] border border-border bg-card p-6 animate-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="font-display text-lg leading-snug">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}