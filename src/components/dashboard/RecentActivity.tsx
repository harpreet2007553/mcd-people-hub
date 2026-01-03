import {
  UserPlus,
  ArrowRightLeft,
  CalendarCheck,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "recruitment",
    icon: UserPlus,
    title: "New employee onboarded",
    description: "Amit Verma joined as Junior Engineer in South Zone",
    time: "2 hours ago",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 2,
    type: "transfer",
    icon: ArrowRightLeft,
    title: "Transfer processed",
    description: "Sunita Devi transferred from North to Central Zone",
    time: "4 hours ago",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: 3,
    type: "attendance",
    icon: CalendarCheck,
    title: "Leave request approved",
    description: "Medical leave for Ramesh Singh approved (5 days)",
    time: "5 hours ago",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 4,
    type: "grievance",
    icon: AlertCircle,
    title: "New grievance filed",
    description: "Grievance #GR-2025-0892 submitted for review",
    time: "6 hours ago",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: 5,
    type: "payroll",
    icon: FileText,
    title: "Payroll generated",
    description: "January 2026 payroll processing completed",
    time: "Yesterday",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export const RecentActivity = () => {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg font-semibold text-card-foreground">
          Recent Activity
        </h2>
        <button className="text-sm text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                activity.bgColor
              )}
            >
              <activity.icon className={cn("h-5 w-5", activity.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
