import { Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const departments = [
  {
    name: "Engineering & Infrastructure",
    employees: 4250,
    budget: 85,
    color: "bg-primary",
  },
  {
    name: "Health & Sanitation",
    employees: 3890,
    budget: 72,
    color: "bg-secondary",
  },
  {
    name: "Revenue & Finance",
    employees: 1560,
    budget: 90,
    color: "bg-accent",
  },
  {
    name: "Education & Welfare",
    employees: 2340,
    budget: 65,
    color: "bg-success",
  },
  {
    name: "Administrative Services",
    employees: 980,
    budget: 78,
    color: "bg-warning",
  },
];

export const DepartmentOverview = () => {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg font-semibold text-card-foreground">
          Department Overview
        </h2>
        <button className="text-sm text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-5">
        {departments.map((dept, index) => (
          <div
            key={index}
            className="space-y-2 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {dept.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dept.employees.toLocaleString()} employees
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {dept.budget}%
              </span>
            </div>
            <Progress value={dept.budget} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
