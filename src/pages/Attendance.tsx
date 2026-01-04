import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, Clock, LogIn, LogOut, CalendarDays, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  date: string;
  status: string;
  notes: string | null;
}

interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  created_at: string;
  user_name?: string;
}

const leaveTypeLabels: Record<string, string> = {
  casual: "Casual Leave",
  sick: "Sick Leave",
  earned: "Earned Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
  unpaid: "Unpaid Leave",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-700 border-green-500/30",
  rejected: "bg-red-500/20 text-red-700 border-red-500/30",
  present: "bg-green-500/20 text-green-700 border-green-500/30",
  late: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  half_day: "bg-orange-500/20 text-orange-700 border-orange-500/30",
};

const Attendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, hasRole } = useAuth();
  const { toast } = useToast();

  const isHROrAdmin = hasRole("admin") || hasRole("hr_manager") || hasRole("hr_officer");

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false })
        .limit(30);

      if (error) throw error;
      setAttendance(data || []);

      const today = format(new Date(), "yyyy-MM-dd");
      const todayRec = data?.find((r) => r.date === today);
      setTodayRecord(todayRec || null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      let query = supabase.from("leave_requests").select("*").order("created_at", { ascending: false });

      if (!isHROrAdmin) {
        query = query.eq("user_id", user?.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (isHROrAdmin && data) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name");
        const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
        const withNames = data.map((lr) => ({ ...lr, user_name: profileMap.get(lr.user_id) || "Unknown" }));
        setLeaveRequests(withNames);
      } else {
        setLeaveRequests(data || []);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAttendance();
      fetchLeaveRequests();
    }
  }, [user]);

  const handleCheckIn = async () => {
    try {
      const now = new Date();
      const hour = now.getHours();
      let status = "present";
      if (hour >= 10) status = "late";
      if (hour >= 13) status = "half_day";

      const { error } = await supabase.from("attendance_records").insert({
        user_id: user?.id,
        check_in: now.toISOString(),
        date: format(now, "yyyy-MM-dd"),
        status,
      });

      if (error) throw error;
      toast({ title: "Checked in successfully", description: `Status: ${status}` });
      fetchAttendance();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    try {
      const { error } = await supabase
        .from("attendance_records")
        .update({ check_out: new Date().toISOString() })
        .eq("id", todayRecord.id);

      if (error) throw error;
      toast({ title: "Checked out successfully" });
      fetchAttendance();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleLeaveSubmit = async () => {
    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please fill all fields" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("leave_requests").insert({
        user_id: user?.id,
        leave_type: leaveType,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        reason: reason.trim(),
      });

      if (error) throw error;
      toast({ title: "Leave request submitted" });
      setLeaveDialogOpen(false);
      setLeaveType("");
      setStartDate(undefined);
      setEndDate(undefined);
      setReason("");
      fetchLeaveRequests();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveAction = async (id: string, action: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({ status: action, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast({ title: `Leave request ${action}` });
      fetchLeaveRequests();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const getWorkDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return "In progress";
    const hours = differenceInHours(new Date(checkOut), new Date(checkIn));
    const mins = differenceInMinutes(new Date(checkOut), new Date(checkIn)) % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <CalendarCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Attendance</h1>
              <p className="text-muted-foreground">Track check-ins, check-outs, and leave requests</p>
            </div>
          </div>
          <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button><CalendarDays className="mr-2 h-4 w-4" />Apply Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Submit a new leave request for approval.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="earned">Earned Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left", !startDate && "text-muted-foreground")}>
                          {startDate ? format(startDate, "PPP") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} className="pointer-events-auto" /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left", !endDate && "text-muted-foreground")}>
                          {endDate ? format(endDate, "PPP") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} className="pointer-events-auto" /></PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for leave..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleLeaveSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Today's Attendance</CardTitle>
            <CardDescription>{format(new Date(), "EEEE, MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {todayRecord ? (
                  <>
                    <p className="text-sm text-muted-foreground">Check-in: <span className="font-medium text-foreground">{format(new Date(todayRecord.check_in), "h:mm a")}</span></p>
                    <p className="text-sm text-muted-foreground">Check-out: <span className="font-medium text-foreground">{todayRecord.check_out ? format(new Date(todayRecord.check_out), "h:mm a") : "—"}</span></p>
                    <p className="text-sm text-muted-foreground">Duration: <span className="font-medium text-foreground">{getWorkDuration(todayRecord.check_in, todayRecord.check_out)}</span></p>
                  </>
                ) : (
                  <p className="text-muted-foreground">You haven't checked in yet today.</p>
                )}
              </div>
              <div className="flex gap-2">
                {!todayRecord ? (
                  <Button onClick={handleCheckIn} className="gap-2"><LogIn className="h-4 w-4" />Check In</Button>
                ) : !todayRecord.check_out ? (
                  <Button onClick={handleCheckOut} variant="secondary" className="gap-2"><LogOut className="h-4 w-4" />Check Out</Button>
                ) : (
                  <Badge className={statusColors[todayRecord.status]}>{todayRecord.status}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
            <TabsTrigger value="leave">{isHROrAdmin ? "All Leave Requests" : "My Leave Requests"}</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>{format(new Date(record.check_in), "h:mm a")}</TableCell>
                          <TableCell>{record.check_out ? format(new Date(record.check_out), "h:mm a") : "—"}</TableCell>
                          <TableCell>{getWorkDuration(record.check_in, record.check_out)}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColors[record.status]}>{record.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                      {attendance.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No attendance records found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave">
            <Card>
              <CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isHROrAdmin && <TableHead>Employee</TableHead>}
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      {isHROrAdmin && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        {isHROrAdmin && <TableCell className="font-medium">{leave.user_name}</TableCell>}
                        <TableCell>{leaveTypeLabels[leave.leave_type]}</TableCell>
                        <TableCell>{format(new Date(leave.start_date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(leave.end_date), "MMM d, yyyy")}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[leave.status]}>
                            {leave.status === "pending" && <AlertCircle className="mr-1 h-3 w-3" />}
                            {leave.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                            {leave.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                            {leave.status}
                          </Badge>
                        </TableCell>
                        {isHROrAdmin && (
                          <TableCell>
                            {leave.status === "pending" && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleLeaveAction(leave.id, "approved")}><CheckCircle className="h-4 w-4" /></Button>
                                <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleLeaveAction(leave.id, "rejected")}><XCircle className="h-4 w-4" /></Button>
                              </div>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {leaveRequests.length === 0 && (
                      <TableRow><TableCell colSpan={isHROrAdmin ? 7 : 6} className="text-center py-8 text-muted-foreground">No leave requests found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
