export type CategorySlug =
  | "sofas"
  | "armchairs"
  | "dining"
  | "bedroom"
  | "lighting"
  | "storage";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
}

export type ProductTag = "new" | "bestseller";

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  material: string;
  finishOptions: string[];
  tag?: ProductTag;
  description: string;
  details: string[];
}

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const categories: Category[] = [
  {
    slug: "sofas",
    name: "Sofas",
    tagline: "Sink into calm",
    image: u("photo-1555041469-a586c61ea9bc"),
  },
  {
    slug: "armchairs",
    name: "Armchairs",
    tagline: "Claim your corner",
    image: u("photo-1616486338812-3dadae4b4ace"),
  },
  {
    slug: "dining",
    name: "Dining",
    tagline: "Gather around",
    image: u("photo-1556912173-3bb406ef7e77"),
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    tagline: "Rest well",
    image: u("photo-1540518614846-7eded433c457"),
  },
  {
    slug: "lighting",
    name: "Lighting",
    tagline: "Set the mood",
    image: u("photo-1507473885765-e6ed057f782c"),
  },
  {
    slug: "storage",
    name: "Storage",
    tagline: "Make room to breathe",
    image: u("photo-1524758631624-e2822e304c36"),
  },
];

export const products: Product[] = [
  {
    slug: "sloane-sofa",
    name: "Sloane 3-Seater Sofa",
    category: "sofas",
    price: 899,
    rating: 4.8,
    reviews: 214,
    image: u("photo-1555041469-a586c61ea9bc"),
    material: "Woven velvet",
    finishOptions: ["Emerald Velvet", "Dusty Blue Velvet", "Blush Velvet"],
    tag: "bestseller",
    description:
      "Our signature three-seater, made to be lived on. Deep feather-wrapped cushions, a low Scandinavian profile and kiln-dried solid oak legs.",
    details: [
      "Seat depth 58 cm — deep enough to curl up, firm enough to work from",
      "Removable, machine-washable cushion covers in woven velvet",
      "Kiln-dried solid oak legs with a natural oiled finish",
      "Assembled in 10 minutes — no tools required",
    ],
  },
  {
    slug: "alma-boucle-sofa",
    name: "Alma Bouclé Sofa",
    category: "sofas",
    price: 749,
    rating: 4.7,
    reviews: 168,
    image: u("photo-1586023492125-27b2c045efd7"),
    material: "Bouclé",
    finishOptions: ["Cream Bouclé", "Stone Bouclé"],
    tag: "new",
    description:
      "Cloud-soft bouclé wrapped around a compact two-seater frame. The Alma brings quiet texture and a gentle, rounded silhouette to any room.",
    details: [
      "Two-seater footprint — fits snuggly into flats and studios",
      "High-resilience foam core with a feather-blend topper",
      "Bouclé weave is naturally stain resistant",
      "5-year structural guarantee included",
    ],
  },
  {
    slug: "oslo-leather-sofa",
    name: "Oslo Leather Sofa",
    category: "sofas",
    price: 1199,
    compareAt: 1350,
    rating: 4.9,
    reviews: 132,
    image: u("photo-1567016432779-094069958ea5"),
    material: "Full-grain leather",
    finishOptions: ["Tan Leather", "Chocolate Leather"],
    description:
      "Full-grain leather that only gets better with age. Tanned in small batches, the Oslo is generous, honest and built for decades.",
    details: [
      "Semi-aniline full-grain leather, tanned in northern Italy",
      "Naturally breathable and cool in summer, warm in winter",
      "Patina develops beautifully over the years",
      "10-year guarantee on frame and suspension",
    ],
  },
  {
    slug: "freja-corner-sofa",
    name: "Freja Corner Sofa",
    category: "sofas",
    price: 1349,
    rating: 4.6,
    reviews: 97,
    image: u("photo-1522708323590-d24dbb6b0267"),
    material: "Textured weave",
    finishOptions: ["Slate Grey", "Oatmeal", "Deep Forest"],
    tag: "bestseller",
    description:
      "A deep, generous corner sofa for whole-family evenings. The Freja is our most forgiving seat — wide, low and endlessly comfortable.",
    details: [
      "Reversible chaise — fits left or right corner",
      "2.4 m wide, seats up to five comfortably",
      "Fibre-filled back cushions with down-wrapped seat pads",
      "Free white-glove delivery and room placement",
    ],
  },
  {
    slug: "milo-lounge-chair",
    name: "Milo Lounge Chair",
    category: "armchairs",
    price: 349,
    rating: 4.8,
    reviews: 84,
    image: u("photo-1616486338812-3dadae4b4ace"),
    material: "Bouclé",
    finishOptions: ["Oat Bouclé", "Forest Velvet"],
    tag: "new",
    description:
      "The reading nook favourite. Milo cradles you with a curved back and cushioned arms, on slim oak legs that keep it light and airy.",
    details: [
      "Ergonomic high back supports head, neck and shoulders",
      "Removable cushion covers — spot clean or machine wash",
      "Solid oak legs, FSC-certified",
      "Pairs perfectly with the Alma Bouclé Sofa",
    ],
  },
  {
    slug: "astrid-rattan-chair",
    name: "Astrid Rattan Chair",
    category: "armchairs",
    price: 289,
    rating: 4.5,
    reviews: 61,
    image: u("photo-1595428774223-ef52624120d2"),
    material: "Handwoven rattan",
    finishOptions: ["Natural Rattan", "Black Rattan"],
    description:
      "Handwoven by master craftspeople from sustainably harvested rattan. The Astrid adds warmth, shadow-play and a lived-in feel.",
    details: [
      "Handwoven natural rattan over a powder-coated steel frame",
      "Machine-washable cotton seat cushion included",
      "Light enough to carry between rooms",
      "Wipe clean with a damp cloth",
    ],
  },
  {
    slug: "bjorn-oak-table",
    name: "Bjorn Oak Dining Table",
    category: "dining",
    price: 649,
    rating: 4.7,
    reviews: 93,
    image: u("photo-1556912173-3bb406ef7e77"),
    material: "Solid oak",
    finishOptions: ["Natural Oak", "Smoked Oak"],
    description:
      "A solid oak centrepiece for slow dinners and long conversations. Seats four, extends to six, and only gets more character with every spill.",
    details: [
      "Solid oak top with a satin VOC-free oil finish",
      "Extends from 140 cm to 200 cm with a hidden leaf",
      "Seats 4–6 people comfortably",
      "Minimal assembly — legs tighten in under 5 minutes",
    ],
  },
  {
    slug: "elsa-dining-chairs",
    name: "Elsa Dining Chair · Set of 2",
    category: "dining",
    price: 199,
    rating: 4.6,
    reviews: 58,
    image: u("photo-1519710164239-da123dc03ef4"),
    material: "Moulded plywood",
    finishOptions: ["Natural Birch", "Smoked Birch"],
    description:
      "Sculpted, stackable and quietly beautiful. The Elsa's moulded plywood seat hugs you in all the right places — even after a three-hour dinner.",
    details: [
      "Sculpted moulded birch plywood — bent, not sawn, for strength",
      "Stacks up to four high for easy storage",
      "Suitable for indoor and covered outdoor use",
      "Arrives fully assembled",
    ],
  },
  {
    slug: "nova-upholstered-bed",
    name: "Nova Upholstered Bed",
    category: "bedroom",
    price: 699,
    rating: 4.9,
    reviews: 121,
    image: u("photo-1540518614846-7eded433c457"),
    material: "Linen-blend weave",
    finishOptions: ["Oat Linen", "Slate Linen"],
    tag: "bestseller",
    description:
      "A softly padded headboard that turns bedtime into an event. The Nova pairs hotel-suite comfort with honest Scandinavian lines.",
    details: [
      "Tall upholstered headboard in a stain-resistant linen weave",
      "Fits all standard UK mattresses — divan or slatted",
      "Whisper-quiet, tool-free assembly",
      "Matching Nova bench and side tables available",
    ],
  },
  {
    slug: "embla-oak-bed",
    name: "Embla Bed",
    category: "bedroom",
    price: 549,
    rating: 4.7,
    reviews: 76,
    image: u("photo-1505693416388-ac5ce068fe85"),
    material: "Solid oak",
    finishOptions: ["Natural Oak", "White Limed Oak"],
    description:
      "Clean oak lines, a low profile and a headboard you can stack books on. The Embla is calm design that does the quiet work.",
    details: [
      "Low Scandinavian profile with a floating-frame look",
      "Solid oak with a natural wax finish — no lacquer",
      "Built-in headboard shelf keeps glasses, books and lamps close",
      "Fits standard UK mattresses (double and king)",
    ],
  },
  {
    slug: "luna-pendant",
    name: "Luna Pendant Lamp",
    category: "lighting",
    price: 89,
    rating: 4.6,
    reviews: 42,
    image: u("photo-1507473885765-e6ed057f782c"),
    material: "Opal glass",
    finishOptions: ["Opal White", "Smoked Amber"],
    tag: "new",
    description:
      "A globe of warm opal glass that pools gentle light over your table. The Luna makes even a Tuesday dinner feel special.",
    details: [
      "Hand-blown opal glass with a soft, glare-free glow",
      "2.5 m braided fabric cable — adjustable height",
      "E27 bulb, dimmer compatible (bulb not included)",
      "Clear, brushed-brass ceiling mount",
    ],
  },
  {
    slug: "sol-table-lamp",
    name: "Sol Table Lamp",
    category: "lighting",
    price: 59,
    rating: 4.5,
    reviews: 38,
    image: u("photo-1513506003901-1e6a229e2d15"),
    material: "Stoneware",
    finishOptions: ["Terracotta", "Chalk White"],
    description:
      "A little sun for your sideboard. The Sol is glazed stoneware with a practical touch dimmer and a warm, low-light calm.",
    details: [
      "Hand-glazed stoneware base in warm matte tones",
      "Touch dimmer with three brightness levels",
      "E27 bulb included — warm 2700 K",
      "Weighted base — stable on tables and windowsills",
    ],
  },
  {
    slug: "alva-bookshelf",
    name: "Alva Bookshelf",
    category: "storage",
    price: 179,
    rating: 4.7,
    reviews: 67,
    image: u("photo-1538688525198-9b88f6f53126"),
    material: "Birch plywood",
    finishOptions: ["Natural Birch", "Charcoal Birch"],
    tag: "new",
    description:
      "Light, honest and endlessly rearrangeable. The Alva's open shelves show off your books, plants and the things you love.",
    details: [
      "Three open shelves with a reinforced back panel",
      "Slim 8 cm profile — fits narrow hallways and alcoves",
      "FSC-certified birch plywood, formaldehyde-free",
      "Anti-tip wall strap included for peace of mind",
    ],
  },
  {
    slug: "tor-sideboard",
    name: "Tor Sideboard",
    category: "storage",
    price: 449,
    compareAt: 520,
    rating: 4.4,
    reviews: 45,
    image: u("photo-1524758631624-e2822e304c36"),
    material: "Oak veneer",
    finishOptions: ["Natural Oak", "Mocha Oak"],
    description:
      "The quiet hero of your hallway or dining room. Two soft-close doors hide the chaos, while the surface shows off the good stuff.",
    details: [
      "Two soft-close cabinets with adjustable shelves",
      "Oak veneer over FSC-certified core — warm grain, honest weight",
      "Recessed metal handles, tool-free assembly",
      "Cable holes for media and lamps in every compartment",
    ],
  },
];

export const FREE_DELIVERY_THRESHOLD = 300;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: CategorySlug): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getRelated(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = products
    .filter((p) => p.category !== product.category && p.slug !== product.slug)
    .slice(0, limit - sameCategory.length);
  return [...sameCategory, ...others];
}

export function formatPrice(value: number): string {
  return `£${value.toLocaleString("en-GB")}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-GB");
}