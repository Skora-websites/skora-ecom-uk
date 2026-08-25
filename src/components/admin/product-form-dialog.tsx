"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Link as LinkIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { categories } from "@/lib/products";
import { saveProduct, type StoreProduct } from "@/lib/store";
import { cn } from "@/lib/utils";

const CATEGORY_SLUGS = [
  "sofas",
  "armchairs",
  "dining",
  "bedroom",
  "lighting",
  "storage",
] as const;

const schema = z.object({
  name: z.string().min(3, "Enter a product name"),
  category: z.enum(CATEGORY_SLUGS),
  price: z
    .string()
    .min(1, "Enter a price")
    .refine((v) => Number(v) > 0, "Price must be above zero"),
  compareAt: z.string().refine(
    (v) => v === "" || Number(v) > 0,
    "Compare-at must be above zero"
  ),
  rating: z
    .string()
    .min(1, "Add a rating")
    .refine(
      (v) => Number(v) >= 0 && Number(v) <= 5,
      "Rating must be between 0 and 5"
    ),
  reviews: z
    .string()
    .min(1, "Add a review count")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      "Must be a whole number, 0 or more"
    ),
  image: z.string(),
  material: z.string().min(2, "Enter a material"),
  finishOptions: z.string().min(1, "Add at least one finish"),
  tag: z.enum(["none", "new", "bestseller"]),
  description: z.string().min(10, "Add a short description"),
  details: z.string().min(3, "Add at least one detail"),
  status: z.enum(["active", "draft"]),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80";

function isDataUrl(value: string): boolean {
  return value.startsWith("data:image/");
}

/**
 * Reads an image file and returns a compressed JPEG data URL (max 1200px)
 * so uploaded photos stay small enough for localStorage.
 */
function readAndResizeImage(
  file: File,
  maxDim = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas is not available"));
          return;
        }
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.onerror = () => reject(new Error("Could not read that image"));
      image.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

interface ProductFormDialogProps {
  open: boolean;
  existing: StoreProduct | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

function toFormValues(product: StoreProduct | null): FormValues {
  if (!product) {
    return {
      name: "",
      category: "sofas",
      price: "",
      compareAt: "",
      rating: "4.5",
      reviews: "0",
      image: "",
      material: "",
      finishOptions: "",
      tag: "none",
      description: "",
      details: "",
      status: "active",
    };
  }
  return {
    name: product.name,
    category: product.category,
    price: String(product.price),
    compareAt: product.compareAt ? String(product.compareAt) : "",
    rating: String(product.rating),
    reviews: String(product.reviews),
    image: product.image,
    material: product.material,
    finishOptions: product.finishOptions.join(", "),
    tag: product.tag ?? "none",
    description: product.description,
    details: product.details.join("\n"),
    status: product.status,
  };
}

export function ProductFormDialog({
  open,
  existing,
  onOpenChange,
  onClose,
}: ProductFormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(existing),
  });

  const [imageMode, setImageMode] = useState<"upload" | "url">("url");
  const imageValue = form.watch("image");

  useEffect(() => {
    if (open) {
      const values = toFormValues(existing);
      form.reset(values);
      setImageMode(isDataUrl(values.image) ? "upload" : "url");
    }
  }, [open, existing, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readAndResizeImage(file);
      form.setValue("image", dataUrl, { shouldDirty: true });
      setImageMode("upload");
    } catch {
      toast.error("Couldn't read that image — try another file");
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = () => {
    form.setValue("image", "", { shouldDirty: true });
    setImageMode("url");
  };

  const handleSubmit = (values: FormValues) => {
    const saved = saveProduct(
      {
        name: values.name.trim(),
        category: values.category,
        price: Number(values.price),
        compareAt: values.compareAt ? Number(values.compareAt) : undefined,
        rating: Number(values.rating),
        reviews: Number(values.reviews),
        image: values.image.trim() || DEFAULT_IMAGE,
        material: values.material.trim(),
        finishOptions: values.finishOptions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tag: values.tag === "none" ? undefined : values.tag,
        description: values.description.trim(),
        details: values.details
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        status: values.status,
      },
      existing?.slug
    );
    toast.success(
      existing
        ? `“${saved.name}” updated`
        : `“${saved.name}” added to the store`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {existing ? `Edit ${existing.name}` : "Add a product"}
          </DialogTitle>
          <DialogDescription>
            Changes appear on the storefront immediately and are saved in this
            browser.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Iris Lounge Chair"
                      className="h-11 rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-full">
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-full">
                          <SelectValue placeholder="Pick a tag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No tag</SelectItem>
                        <SelectItem value="new">New arrival</SelectItem>
                        <SelectItem value="bestseller">Bestseller</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (£)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="499"
                        className="h-11 rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compareAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare-at (£)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="599"
                        className="h-11 rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional, for sale prices.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reviews"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reviews</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        className="h-11 rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Solid oak"
                        className="h-11 rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0–5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="4.5"
                        className="h-11 rounded-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-3">
                            <FormLabel className="mb-0">Product image</FormLabel>
                            <div className="flex rounded-full bg-secondary p-1" role="tablist" aria-label="Image source">
                              <button
                                type="button"
                                role="tab"
                                aria-selected={imageMode === "upload"}
                                onClick={() => setImageMode("upload")}
                                className={cn(
                                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                                  imageMode === "upload"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <Upload className="size-3.5" /> Upload
                              </button>
                              <button
                                type="button"
                                role="tab"
                                aria-selected={imageMode === "url"}
                                onClick={() => setImageMode("url")}
                                className={cn(
                                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                                  imageMode === "url"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <LinkIcon className="size-3.5" /> URL
                              </button>
                            </div>
                          </div>
            
                          {imageMode === "upload" ? (
                            <>
                              <label className="group relative flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-4 text-center transition-colors hover:border-primary hover:bg-secondary/50">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageUpload}
                                  aria-label="Upload product image"
                                />
                                {imageValue ? (
                                  <>
                                    <img
                                      src={imageValue}
                                      alt="Product image preview"
                                      className="h-44 w-full rounded-xl object-cover"
                                    />
                                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-xs font-semibold text-white">
                                      Click to replace
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="grid size-12 place-items-center rounded-2xl bg-background text-primary shadow-sm">
                                      <ImagePlus className="size-6" />
                                    </span>
                                    <span className="text-sm font-medium">Click to upload a photo</span>
                                    <span className="text-xs text-muted-foreground">
                                      PNG or JPG — automatically resized for the store
                                    </span>
                                  </>
                                )}
                              </label>
                              {imageValue && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeImage}
                                  className="w-fit text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="size-4" /> Remove image
                                </Button>
                              )}
                            </>
                          ) : (
                            <>
                              <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="https://images.unsplash.com/…"
                                        className="h-11 rounded-full"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Paste an image URL, or switch to Upload to use a photo from your device.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {imageValue && imageValue.startsWith("http") && (
                                <img
                                  src={imageValue}
                                  alt="Product image preview"
                                  className="h-32 w-full rounded-2xl border object-cover"
                                />
                              )}
                            </>
                          )}
                        </div>

            <FormField
              control={form.control}
              name="finishOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishes</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Natural Oak, Smoked Oak"
                      className="h-11 rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Separate options with commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short, inviting description for the product page."
                      className="min-h-24 rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"One bullet point per line.\nKiln-dried solid oak legs\nRemovable, washable covers"}
                      className="min-h-28 rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Each line becomes a bullet point on the product page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-4 rounded-2xl border p-4">
                  <div className="space-y-1">
                    <FormLabel>Live on storefront</FormLabel>
                    <FormDescription>
                      Draft products are hidden from the shop.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "active"}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "active" : "draft")
                      }
                      aria-label="Live status"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button type="submit">
                {existing ? "Save changes" : "Add product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
