import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Users, History, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  department: string | null;
  designation: string | null;
  role: AppRole;
  role_id: string;
}

interface AuditLogEntry {
  id: string;
  target_user_id: string;
  changed_by_user_id: string;
  old_role: AppRole;
  new_role: AppRole;
  changed_at: string;
  target_user_name?: string;
  changed_by_name?: string;
}

const roleColors: Record<AppRole, string> = {
  admin: "bg-destructive text-destructive-foreground",
  hr_manager: "bg-primary text-primary-foreground",
  hr_officer: "bg-secondary text-secondary-foreground",
  department_head: "bg-accent text-accent-foreground",
  employee: "bg-muted text-muted-foreground",
};

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  hr_manager: "HR Manager",
  hr_officer: "HR Officer",
  department_head: "Department Head",
  employee: "Employee",
};

const Admin = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = profiles.map((profile) => {
        const userRole = roles.find((r) => r.user_id === profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id,
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          department: profile.department,
          designation: profile.designation,
          role: userRole?.role || "employee",
          role_id: userRole?.id || "",
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data: logs, error: logsError } = await supabase
        .from("role_audit_log")
        .select("*")
        .order("changed_at", { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name");

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

      const logsWithNames: AuditLogEntry[] = (logs || []).map((log) => ({
        ...log,
        target_user_name: profileMap.get(log.target_user_id) || "Unknown User",
        changed_by_name: profileMap.get(log.changed_by_user_id) || "Unknown User",
      }));

      setAuditLogs(logsWithNames);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching audit logs",
        description: error.message,
      });
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const handleRoleChange = async (userId: string, roleId: string, oldRole: AppRole, newRole: AppRole) => {
    if (oldRole === newRole) return;
    
    setUpdating(userId);
    try {
      const { error: updateError } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("id", roleId);

      if (updateError) throw updateError;

      // Log the role change
      const { error: auditError } = await supabase.from("role_audit_log").insert({
        target_user_id: userId,
        changed_by_user_id: user?.id || "",
        old_role: oldRole,
        new_role: newRole,
      });

      if (auditError) {
        console.error("Failed to log audit entry:", auditError);
      }

      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u))
      );

      // Refresh audit logs
      fetchAuditLogs();

      toast({
        title: "Role updated",
        description: `User role has been changed to ${roleLabels[newRole]}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: error.message,
      });
    } finally {
      setUpdating(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "admin").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">HR Staff</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.role === "hr_manager" || u.role === "hr_officer").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <History className="h-4 w-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Roles Management</CardTitle>
                <CardDescription>
                  View and modify user roles. Changes take effect immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead>Change Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userItem) => (
                        <TableRow key={userItem.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={userItem.avatar_url || undefined} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(userItem.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{userItem.full_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {userItem.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{userItem.department || "—"}</TableCell>
                          <TableCell>{userItem.designation || "—"}</TableCell>
                          <TableCell>
                            <Badge className={roleColors[userItem.role]}>
                              {roleLabels[userItem.role]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={userItem.role}
                              onValueChange={(value: AppRole) =>
                                handleRoleChange(userItem.user_id, userItem.role_id, userItem.role, value)
                              }
                              disabled={updating === userItem.user_id}
                            >
                              <SelectTrigger className="w-[160px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="hr_manager">HR Manager</SelectItem>
                                <SelectItem value="hr_officer">HR Officer</SelectItem>
                                <SelectItem value="department_head">Department Head</SelectItem>
                                <SelectItem value="employee">Employee</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Role Change History</CardTitle>
                <CardDescription>
                  Track all role changes with timestamps and who made the change.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User Changed</TableHead>
                        <TableHead>Role Change</TableHead>
                        <TableHead>Changed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(log.changed_at), "MMM d, yyyy h:mm a")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.target_user_name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={roleColors[log.old_role]}>
                                {roleLabels[log.old_role]}
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <Badge className={roleColors[log.new_role]}>
                                {roleLabels[log.new_role]}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {log.changed_by_name}
                          </TableCell>
                        </TableRow>
                      ))}
                      {auditLogs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No role changes recorded yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
