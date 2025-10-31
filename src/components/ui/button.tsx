// import everything from React library
import * as React from "react";
// Slot is a utility from Radix UI that lets this component act as a wrapper for another element
import { Slot } from "@radix-ui/react-slot";
// cva (Class Variance Authority) helps define reusable class name variants
import { cva, type VariantProps } from "class-variance-authority";
// cn is a utility function for conditionally joining class names
import { cn } from "@/lib/utils";

// ***************************************************************

// define base styles and variants for the Button using cva
const buttonVariants = cva(
  // base styles applied to all buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // button variants ("types of buttons" i.e.); can add additional variants if desired
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      // button size variants to adjust dimensions
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    // default button and size variant for when none are specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// define button component
function Button({
  className,
  variant,
  size,
  asChild = false,  // if true, renders <Slot> instead of <button> to allow wrapping another element
  ...props          // include any other properties (e.g. onClick)
}:

React.ComponentProps<"button"> &          // inherit all standard button properties
  VariantProps<typeof buttonVariants> &   // include type definitions for the variant and size properties
  // explicitly type the optional asChild property, which decides if <Slot> instead of <button> is rendered
  { asChild?: boolean }) {
  
  // Decide which component to render:
  // If true: Slot (allows wrapping another element)
  // If false: `button
  const Comp = asChild ? Slot : "button";
  
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
