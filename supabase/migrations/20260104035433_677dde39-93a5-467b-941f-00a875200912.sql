-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  check_out TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'late', 'half_day')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('casual', 'sick', 'earned', 'maternity', 'paternity', 'unpaid')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Attendance RLS policies
CREATE POLICY "Users can view their own attendance"
ON public.attendance_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attendance"
ON public.attendance_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance"
ON public.attendance_records FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "HR and admins can view all attendance"
ON public.attendance_records FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'hr_officer'::app_role));

-- Leave requests RLS policies
CREATE POLICY "Users can view their own leave requests"
ON public.leave_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leave requests"
ON public.leave_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending leave requests"
ON public.leave_requests FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "HR and admins can view all leave requests"
ON public.leave_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role) OR has_role(auth.uid(), 'hr_officer'::app_role));

CREATE POLICY "HR and admins can update leave requests"
ON public.leave_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

-- Add trigger for leave_requests updated_at
CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON public.leave_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();