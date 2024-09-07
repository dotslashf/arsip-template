import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        white: "dark:bg-white bg-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        disabled: "cursor-not-allowed text-slate-400",
        link: "text-primary underline-offset-4 hover:underline",
        confirm:
          "focus:outline-none text-white bg-confirm hover:bg-green-800 focus:ring-4 focus:ring-confirm font-medium dark:bg-confirm dark:focus:ring-confirm",
        warning:
          "focus:outline-none text-white bg-warning hover:bg-yellow-500 focus:ring-4 focus:ring-warning font-medium dark:focus:ring-warning ",
        discord:
          "bg-discord text-white hover:bg-discord-hover focus:ring-discord",
        twitter:
          "bg-twitter text-white hover:bg-twitter-hover focus:ring-twitter",
        google: "bg-google text-white hover:bg-google/80 focus:ring-google",
        gold: "bg-yellow-500 dark:bg-yellow-500 text-yellow-950 dark:text-yellow-950 hover:bg-yellow-600 dark:hover:bg-yellow-400 border-yellow-600 dark:border-yellow-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        url: "h-6 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xs: "px-2 py-1",
        none: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
