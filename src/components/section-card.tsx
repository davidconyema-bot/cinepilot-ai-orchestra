import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h3 className="font-display text-base font-semibold tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-gradient">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
