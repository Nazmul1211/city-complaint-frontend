import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  variant?: "default" | "success" | "warning" | "info" | "primary";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-muted text-foreground",
    accent: "border-border/60",
  },
  primary: {
    iconBg: "bg-primary/10 text-primary",
    accent: "border-primary/20",
  },
  success: {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    accent: "border-emerald-500/20",
  },
  warning: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    accent: "border-amber-500/20",
  },
  info: {
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    accent: "border-blue-500/20",
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-md",
        styles.accent,
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div
            className={cn("p-2.5 rounded-xl transition-colors", styles.iconBg)}
          >
            <Icon className="size-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-md",
                  trend.isPositive
                    ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                    : "text-rose-600 bg-rose-500/10 dark:text-rose-400",
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground truncate">
                {trend?.label || description}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
