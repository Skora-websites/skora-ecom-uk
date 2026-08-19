"use client";

import Image from "next/image";
import { useState } from "react";
import { Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Next image with a graceful brand-toned placeholder if a remote
 * image fails to load.
 */
export function ProductImage({
  src,
  alt,
  className,
  priority,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: ProductImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex size-full items-center justify-center bg-muted",
          className
        )}
      >
        <Armchair className="size-12 text-muted-foreground/40" />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
      className={cn("object-cover object-center", className)}
    />
  );
}