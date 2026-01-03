import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const employees = [
  {
    id: "EMP001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@mcd.gov.in",
    phone: "+91 98765 43210",
    department: "Engineering",
    designation: "Senior Engineer",
    zone: "North Zone",
    status: "active",
    joinDate: "15 Mar 2018",
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    email: "priya.sharma@mcd.gov.in",
    phone: "+91 98765 43211",
    department: "Health & Sanitation",
    designation: "Health Officer",
    zone: "South Zone",
    status: "active",
    joinDate: "22 Jul 2019",
  },
  {
    id: "EMP003",
    name: "Amit Verma",
    email: "amit.verma@mcd.gov.in",
    phone: "+91 98765 43212",
    department: "Revenue & Finance",
    designation: "Tax Inspector",
    zone: "East Zone",
    status: "active",
    joinDate: "10 Jan 2020",
  },
  {
    id: "EMP004",
    name: "Sunita Devi",
    email: "sunita.devi@mcd.gov.in",
    phone: "+91 98765 43213",
    department: "Education & Welfare",
    designation: "Education Officer",
    zone: "West Zone",
    status: "on-leave",
    joinDate: "05 Sep 2017",
  },
  {
    id: "EMP005",
    name: "Ramesh Singh",
    email: "ramesh.singh@mcd.gov.in",
    phone: "+91 98765 43214",
    department: "Administrative Services",
    designation: "Admin Officer",
    zone: "Central Zone",
    status: "active",
    joinDate: "18 Feb 2021",
  },
  {
    id: "EMP006",
    name: "Kavita Gupta",
    email: "kavita.gupta@mcd.gov.in",
    phone: "+91 98765 43215",
    department: "Engineering",
    designation: "Junior Engineer",
    zone: "North Zone",
    status: "probation",
    joinDate: "01 Dec 2025",
  },
];

const statusColors = {
  active: "bg-success/10 text-success border-success/20",
  "on-leave": "bg-warning/10 text-warning border-warning/20",
  probation: "bg-accent/10 text-accent border-accent/20",
  inactive: "bg-muted text-muted-foreground border-muted",
};

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Employees
            </h1>
            <p className="text-muted-foreground">
              Manage all municipal employees across departments and zones
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="health">Health & Sanitation</SelectItem>
                <SelectItem value="revenue">Revenue & Finance</SelectItem>
                <SelectItem value="education">Education & Welfare</SelectItem>
                <SelectItem value="admin">Administrative</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="north">North Zone</SelectItem>
                <SelectItem value="south">South Zone</SelectItem>
                <SelectItem value="east">East Zone</SelectItem>
                <SelectItem value="west">West Zone</SelectItem>
                <SelectItem value="central">Central Zone</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {employee.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.id} • {employee.designation}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{employee.department}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{employee.zone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[employee.status as keyof typeof statusColors]}
                    >
                      {employee.status.charAt(0).toUpperCase() +
                        employee.status.slice(1).replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {employee.joinDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Transfer</DropdownMenuItem>
                        <DropdownMenuItem>View Attendance</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing 1-6 of 14,328 employees</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
