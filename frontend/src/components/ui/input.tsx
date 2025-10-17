import React, { useState, forwardRef } from "react";

import { cn } from "@/lib/utils";

import { EyeOff, EyeIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  withHideIcon?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ withHideIcon, ...props }, ref) => {
    const [passwordInputType, setPasswordInputType] = useState<
      "password" | "text"
    >("password");

    const changePasswordInputTypeHandler = () => {
      if (passwordInputType === "password") {
        setPasswordInputType("text");
      } else {
        setPasswordInputType("password");
      }
    };

    return (
      <div className="relative w-full">
        <input
          {...props}
          ref={ref}
          type={withHideIcon ? passwordInputType : props.type}
          className={cn(
            "duration-900 w-full border transition-all focus:border-blue-400",
            props.className,
          )}
        />

        {withHideIcon && (
          <button
            type="button"
            onClick={changePasswordInputTypeHandler}
            className="absolute inset-y-1 right-1 top-1 rounded-r-xl p-3"
          >
            {passwordInputType === "password" ? (
              <EyeOff strokeWidth={1.5} size={20} />
            ) : (
              <EyeIcon strokeWidth={1.5} size={20} />
            )}
          </button>
        )}
      </div>
    );
  },
);
