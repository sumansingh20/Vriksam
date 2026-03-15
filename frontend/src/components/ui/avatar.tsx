"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Size variants                                                      */
/* ------------------------------------------------------------------ */

const avatarSizeVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-base",
        xl: "h-20 w-20 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/* ------------------------------------------------------------------ */
/*  Status indicator positions                                         */
/* ------------------------------------------------------------------ */

const statusSizeMap: Record<string, string> = {
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border-[1.5px]",
  lg: "h-3.5 w-3.5 border-2",
  xl: "h-4 w-4 border-2",
};

const statusColorMap: Record<string, string> = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

/* ------------------------------------------------------------------ */
/*  Avatar                                                             */
/* ------------------------------------------------------------------ */

type StatusType = "online" | "offline" | "busy" | "away";

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarSizeVariants> {
  /** Image source */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback initials (1-2 chars) */
  fallback?: string;
  /** Show a status indicator dot */
  status?: StatusType;
  /** Add a glow border ring */
  glow?: boolean;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt, fallback, status, glow, ...props }, ref) => {
  return (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          avatarSizeVariants({ size }),
          /* Glow ring */
          glow && [
            "ring-2 ring-emerald-400/50",
            "shadow-lg shadow-emerald-500/20",
          ],
          "transition-all duration-300",
          className
        )}
        {...props}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt ?? ""}
          className="aspect-square h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full",
            "bg-gradient-to-br from-emerald-400 to-green-600",
            "font-semibold text-white uppercase select-none"
          )}
          delayMs={300}
        >
          {fallback ?? "?"}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>

      {/* Status dot */}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full",
            "border-white dark:border-gray-900",
            statusSizeMap[size ?? "md"],
            statusColorMap[status],
            status === "online" && "animate-pulse"
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

/* ------------------------------------------------------------------ */
/*  Avatar Group                                                       */
/* ------------------------------------------------------------------ */

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max avatars visible before "+N" overflow */
  max?: number;
  children: React.ReactNode;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const visible = max ? items.slice(0, max) : items;
    const overflow = max ? items.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visible.map((child, i) => (
          <div
            key={i}
            className="ring-2 ring-white dark:ring-gray-900 rounded-full"
          >
            {child}
          </div>
        ))}
        {overflow > 0 && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              "bg-emerald-100 text-emerald-800 text-xs font-semibold",
              "ring-2 ring-white dark:ring-gray-900",
              "dark:bg-emerald-900/50 dark:text-emerald-300"
            )}
          >
            +{overflow}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup, avatarSizeVariants };
