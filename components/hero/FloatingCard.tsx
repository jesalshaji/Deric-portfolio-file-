import type { ReactNode } from "react";

export function FloatingCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-cream/15 bg-void/40 px-4 py-3 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
