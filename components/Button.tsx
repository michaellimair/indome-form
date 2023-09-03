import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import clsx from "clsx";

export const Button: FC<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    type="submit"
    {...props}
    className={clsx(
      "text-white",
      "focus:ring-4",
      "focus:outline-none",
      "focus:ring-blue-300",
      "font-medium",
      "rounded-lg",
      "text-sm",
      "w-full",
      "sm:w-auto",
      "px-5",
      "py-2.5",
      "text-center",
      "disabled:cursor-not-allowed",
      props.className,
      {
        "bg-slate-400 hover:bg-blue-800": props.disabled,
        "dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800": !props.disabled,
        "bg-blue-700": !props.disabled,
      }
    )}
  >
    {children}
  </button>
)