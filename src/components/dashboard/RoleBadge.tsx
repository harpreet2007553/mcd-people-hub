import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AppRole = "admin" | "hr_manager" | "hr_officer" | "department_head" | "employee";

interface RoleBadgeProps {
  role: AppRole | null;
  className?: string;
}

const roleConfig: Record<AppRole, { label: string; className: string }> = {
  admin: {
    label: "Administrator",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  hr_manager: {
    label: "HR Manager",
    className: "bg-secondary/10 text-secondary border-secondary/20",
  },
  hr_officer: {
    label: "HR Officer",
    className: "bg-accent/10 text-accent border-accent/20",
  },
  department_head: {
    label: "Department Head",
    className: "bg-success/10 text-success border-success/20",
  },
  employee: {
    label: "Employee",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  if (!role) return null;

  const config = roleConfig[role];

  return (
    <Badge
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};
