import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = "" }: SectionProps) {
  const classes = ["bg-white p-4", className].filter(Boolean).join(" ");

  return <section className={classes}>{children}</section>;
}
