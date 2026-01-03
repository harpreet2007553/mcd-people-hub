import {
  Users,
  UserPlus,
  CalendarCheck,
  ArrowRightLeft,
  Wallet,
  TrendingUp,
  MessageSquareWarning,
  Building2,
  Clock,
  CheckCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DepartmentOverview } from "@/components/dashboard/DepartmentOverview";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your HR operations.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value="14,328"
            subtitle="Active workforce"
            icon={Users}
            trend={{ value: 2.5, isPositive: true }}
            variant="primary"
          />
          <StatsCard
            title="Present Today"
            value="12,847"
            subtitle="89.7% attendance"
            icon={CalendarCheck}
            trend={{ value: 1.2, isPositive: true }}
            variant="secondary"
          />
          <StatsCard
            title="Pending Transfers"
            value="156"
            subtitle="Awaiting approval"
            icon={ArrowRightLeft}
            variant="accent"
          />
          <StatsCard
            title="Open Grievances"
            value="42"
            subtitle="Require attention"
            icon={MessageSquareWarning}
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Modules Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              HR Modules
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ModuleCard
                title="Recruitment"
                description="Manage job postings, applications, and hiring workflows"
                icon={UserPlus}
                path="/recruitment"
                stats={[
                  { label: "Open Positions", value: 23 },
                  { label: "Applications", value: 347 },
                ]}
              />
              <ModuleCard
                title="Attendance"
                description="Track daily attendance, leaves, and working hours"
                icon={Clock}
                path="/attendance"
                stats={[
                  { label: "On Leave", value: 284 },
                  { label: "Late Today", value: 45 },
                ]}
              />
              <ModuleCard
                title="Payroll"
                description="Process salaries, generate payslips, and manage deductions"
                icon={Wallet}
                path="/payroll"
                stats={[
                  { label: "Processed", value: "₹48.2Cr" },
                  { label: "Pending", value: 12 },
                ]}
              />
              <ModuleCard
                title="Performance"
                description="Track employee performance, appraisals, and goals"
                icon={TrendingUp}
                path="/performance"
                stats={[
                  { label: "Reviews Due", value: 89 },
                  { label: "Completed", value: "94%" },
                ]}
              />
              <ModuleCard
                title="Transfers"
                description="Handle inter-department and zone transfer requests"
                icon={ArrowRightLeft}
                path="/transfers"
                stats={[
                  { label: "This Month", value: 34 },
                  { label: "Pending", value: 156 },
                ]}
              />
              <ModuleCard
                title="Grievances"
                description="Manage employee complaints and resolution tracking"
                icon={MessageSquareWarning}
                path="/grievances"
                stats={[
                  { label: "Open", value: 42 },
                  { label: "Resolved", value: 128 },
                ]}
              />
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentActivity />
          <DepartmentOverview />
        </div>

        {/* Footer Stats */}
        <div className="rounded-xl bg-gradient-hero p-6 text-primary-foreground">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-heading font-bold">12</p>
              <p className="text-sm opacity-80">Zones</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-heading font-bold">68</p>
              <p className="text-sm opacity-80">Departments</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-heading font-bold">14,328</p>
              <p className="text-sm opacity-80">Total Employees</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-heading font-bold">₹156Cr</p>
              <p className="text-sm opacity-80">Annual Payroll</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
