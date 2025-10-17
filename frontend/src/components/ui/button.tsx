import React, { forwardRef } from "react";

import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import { LoaderCircle } from "lucide-react";

const buttonVariants = cva(
  `
    relative inline-flex items-center justify-center gap-x-2 px-4 text-white
    py-3 rounded-lg font-semibold text-sm transition-all duration-300
    disabled:pointer-events-none
  `,
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-primary text-white disabled:bg-zinc-600 hover:bg-zinc-800",
        ghost: "rounded-xl text-black bg-white/20 hover:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, loading, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <LoaderCircle className="absolute animate-spin" size={18} />
            <div className="invisible">{props.children}</div>
          </>
        ) : (
          <>{props.children}</>
        )}
      </button>
    );
  },
);

export { Button, buttonVariants };
