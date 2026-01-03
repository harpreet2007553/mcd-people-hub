import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  stats?: { label: string; value: string | number }[];
  variant?: "default" | "primary" | "secondary";
}

export const ModuleCard = ({
  title,
  description,
  icon: Icon,
  path,
  stats,
  variant = "default",
}: ModuleCardProps) => {
  const variants = {
    default: "border-border hover:border-primary/30",
    primary: "border-primary/20 bg-primary/5 hover:border-primary/40",
    secondary: "border-secondary/20 bg-secondary/5 hover:border-secondary/40",
  };

  return (
    <Link
      to={path}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
      </div>

      <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>

      {stats && stats.length > 0 && (
        <div className="flex gap-4 pt-4 border-t border-border">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-lg font-semibold text-card-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
};
