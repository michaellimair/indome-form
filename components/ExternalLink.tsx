import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react";

export const ExternalLink: FC<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>> = ({
  children,
  ...props
}) => (
  <a {...props} className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
    {children}
  </a>
)