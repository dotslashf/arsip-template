import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground hover:bg-primary hover:text-primary-foreground bg-background",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        gold: "bg-yellow-500 dark:bg-yellow-500 text-yellow-950 dark:text-yellow-950 hover:bg-yellow-600 dark:hover:bg-yellow-400 border-yellow-600 dark:border-yellow-400",
        silver:
          "bg-gray-300 dark:bg-gray-400 text-gray-900 dark:text-gray-900 hover:bg-gray-400 dark:hover:bg-gray-300 border-gray-400 dark:border-gray-500",
        bronze:
          "bg-amber-700 dark:bg-amber-600 text-amber-50 dark:text-amber-50 hover:bg-amber-800 dark:hover:bg-amber-500 border-amber-800 dark:border-amber-500",
        white:
          "bg-white dark:bg-slate-100 text-gray-900 dark:text-slate-800 hover:bg-slate-200 dark:hover:bg-slate-200 border-gray-300 dark:border-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
