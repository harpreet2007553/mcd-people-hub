import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  ArrowRightLeft,
  Wallet,
  TrendingUp,
  MessageSquareWarning,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Employees", path: "/employees" },
  { icon: UserPlus, label: "Recruitment", path: "/recruitment" },
  { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
  { icon: ArrowRightLeft, label: "Transfers", path: "/transfers" },
  { icon: Wallet, label: "Payroll", path: "/payroll" },
  { icon: TrendingUp, label: "Performance", path: "/performance" },
  { icon: MessageSquareWarning, label: "Grievances", path: "/grievances" },
  { icon: Building2, label: "Departments", path: "/departments" },
];

const bottomMenuItems = [
  { icon: Shield, label: "Admin", path: "/admin", adminOnly: true },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { hasRole } = useAuth();

  const filteredBottomMenuItems = bottomMenuItems.filter(
    (item) => !item.adminOnly || hasRole("admin")
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
          <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="font-heading text-sm font-semibold text-sidebar-foreground">
              MCD HRMS
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              Delhi Municipal Corp
            </span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="animate-fade-in">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <ul className="space-y-1">
          {filteredBottomMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="animate-fade-in">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-4 flex w-full items-center justify-center rounded-lg py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
};
