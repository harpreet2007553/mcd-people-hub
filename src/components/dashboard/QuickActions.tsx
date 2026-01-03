import {
  UserPlus,
  FileText,
  CalendarPlus,
  Send,
  Download,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: UserPlus,
    label: "Add Employee",
    description: "Register new staff",
  },
  {
    icon: FileText,
    label: "Generate Report",
    description: "Create HR reports",
  },
  {
    icon: CalendarPlus,
    label: "Mark Attendance",
    description: "Daily attendance",
  },
  {
    icon: Send,
    label: "Process Transfer",
    description: "Initiate transfer",
  },
  {
    icon: Download,
    label: "Download Payslip",
    description: "Bulk payslips",
  },
  {
    icon: ClipboardList,
    label: "View Grievances",
    description: "Pending cases",
  },
];

export const QuickActions = () => {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card">
      <h2 className="font-heading text-lg font-semibold text-card-foreground mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-muted/50 hover:border-primary/30 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <action.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
