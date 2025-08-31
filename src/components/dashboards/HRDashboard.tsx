import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCall } from "@/contexts/CallContext";
import { useAdvancedAnalytics } from "@/lib/advancedAnalytics";
import ModernDashboardLayout from "./ModernDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Heart,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Phone,
  Video,
  MessageSquare,
  FileText,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Briefcase,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Mail,
  MapPin,
  GraduationCap,
  Building,
  Star,
  Timer,
  DollarSign,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "on-leave" | "terminated";
  performance: number;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: "vacation" | "sick" | "personal" | "maternity";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

interface JobApplication {
  id: string;
  candidateName: string;
  position: string;
  experience: string;
  status: "new" | "screening" | "interview" | "offer" | "hired" | "rejected";
  appliedDate: string;
  source: string;
}

interface PerformanceMetric {
  department: string;
  averageRating: number;
  employeeCount: number;
  topPerformers: number;
  improvementNeeded: number;
}

export default function HRDashboard() {
  const { user } = useAuth();
  const { isInCall, startCall } = useCall();
  const { trackEvent } = useAdvancedAnalytics();
  
  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Project Manager",
      department: "Project Management",
      email: "sarah.johnson@jdmarc.com",
      phone: "+234 803 000 1001",
      joinDate: "2023-01-15",
      status: "active",
      performance: 92,
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Senior Developer",
      department: "IT",
      email: "michael.chen@jdmarc.com",
      phone: "+234 803 000 1002",
      joinDate: "2022-08-20",
      status: "active",
      performance: 88,
    },
    {
      id: "3",
      name: "Emma Wilson",
      role: "Marketing Specialist",
      department: "Digital Marketing",
      email: "emma.wilson@jdmarc.com",
      phone: "+234 803 000 1003",
      joinDate: "2023-03-10",
      status: "on-leave",
      performance: 85,
    },
    {
      id: "4",
      name: "David Brown",
      role: "Accountant",
      department: "Accounting",
      email: "david.brown@jdmarc.com",
      phone: "+234 803 000 1004",
      joinDate: "2022-11-05",
      status: "active",
      performance: 94,
    },
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "Emma Wilson",
      type: "vacation",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      status: "pending",
      reason: "Family vacation",
    },
    {
      id: "2",
      employeeName: "John Doe",
      type: "sick",
      startDate: "2024-01-18",
      endDate: "2024-01-19",
      status: "approved",
      reason: "Medical appointment",
    },
    {
      id: "3",
      employeeName: "Lisa Park",
      type: "personal",
      startDate: "2024-01-22",
      endDate: "2024-01-22",
      status: "pending",
      reason: "Personal matters",
    },
  ]);

  const [jobApplications] = useState<JobApplication[]>([
    {
      id: "1",
      candidateName: "Alex Rivera",
      position: "Frontend Developer",
      experience: "3 years",
      status: "interview",
      appliedDate: "2024-01-10",
      source: "LinkedIn",
    },
    {
      id: "2",
      candidateName: "Priya Patel",
      position: "UX Designer",
      experience: "5 years",
      status: "screening",
      appliedDate: "2024-01-12",
      source: "Company Website",
    },
    {
      id: "3",
      candidateName: "Marcus Thompson",
      position: "Project Manager",
      experience: "7 years",
      status: "offer",
      appliedDate: "2024-01-08",
      source: "Referral",
    },
  ]);

  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      department: "Project Management",
      averageRating: 4.2,
      employeeCount: 15,
      topPerformers: 8,
      improvementNeeded: 2,
    },
    {
      department: "IT Development",
      averageRating: 4.0,
      employeeCount: 12,
      topPerformers: 6,
      improvementNeeded: 3,
    },
    {
      department: "Digital Marketing",
      averageRating: 3.8,
      employeeCount: 10,
      topPerformers: 4,
      improvementNeeded: 4,
    },
    {
      department: "Accounting",
      averageRating: 4.5,
      employeeCount: 8,
      topPerformers: 6,
      improvementNeeded: 1,
    },
  ]);

  const hrThemeColors = {
    primary: "#1e40af", // Rich blue
    secondary: "#f8fafc", // Pale gray
    accent: "#3b82f6",
    background: "#f1f5f9",
    headerBg: "#0f172a", // Dark blue for header
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "new":
        return "bg-blue-100 text-blue-800";
      case "screening":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "offer":
        return "bg-green-100 text-green-800";
      case "hired":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "text-blue-600";
      case "sick":
        return "text-red-600";
      case "personal":
        return "text-purple-600";
      case "maternity":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  };

  const handleStartHRMeeting = () => {
    trackEvent('interaction', 'hr_meeting_start', { department: 'human-resources' });
    startCall("hr-team-meeting", {
      title: "HR Team Meeting",
      participants: [],
    });
  };

  const handleAddEmployee = () => {
    trackEvent('interaction', 'add_employee_click', { department: 'human-resources' });
    // TODO: Implement add employee functionality
  };

  const handlePostJob = () => {
    trackEvent('interaction', 'post_job_click', { department: 'human-resources' });
    // TODO: Implement post job functionality
  };

  const handleGenerateReport = () => {
    trackEvent('interaction', 'generate_report_click', { department: 'human-resources' });
    // TODO: Implement report generation
  };

  const handleApproveLeave = (requestId: string, employeeName: string) => {
    trackEvent('interaction', 'approve_leave', { requestId, employeeName, department: 'human-resources' });
    // TODO: Implement leave approval
  };

  const handleRejectLeave = (requestId: string, employeeName: string) => {
    trackEvent('interaction', 'reject_leave', { requestId, employeeName, department: 'human-resources' });
    // TODO: Implement leave rejection
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === "active").length;
  const onLeaveEmployees = employees.filter(emp => emp.status === "on-leave").length;
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === "pending").length;
  const newApplications = jobApplications.filter(app => app.status === "new").length;
  const upcomingInterviews = jobApplications.filter(app => app.status === "interview").length;

  return (
    <ModernDashboardLayout
      user={user}
      department="Human Resources"
      themeColors={hrThemeColors}
    >
      <div className="space-y-6">
        {/* HR Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +5% from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{activeEmployees}</p>
                  <p className="text-sm text-gray-600 mt-1">{onLeaveEmployees} on leave</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Leave Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingLeaveRequests}</p>
                  <p className="text-sm text-yellow-600 mt-1">Pending approval</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">New Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{newApplications}</p>
                  <p className="text-sm text-purple-600 mt-1">{upcomingInterviews} interviews scheduled</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <UserPlus className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main HR Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Employee Management */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Employee Overview
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Current staff and their status</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Employee
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export List
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.role}</p>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{employee.performance}%</span>
                          </div>
                          <Badge className={getStatusColor(employee.status)}>
                            {employee.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leave Requests */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Leave Requests
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Pending and recent leave applications</p>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getLeaveTypeColor(request.type).replace('text-', 'bg-').replace('-600', '-100')}`}>
                          <Calendar className={`h-4 w-4 ${getLeaveTypeColor(request.type)}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.employeeName}</h4>
                          <p className="text-sm text-gray-600 capitalize">{request.type} leave</p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        {request.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApproveLeave(request.id, request.employeeName)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleRejectLeave(request.id, request.employeeName)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Job Applications */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobApplications.map((application) => (
                    <div key={application.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{application.candidateName}</h4>
                          <p className="text-sm text-gray-600">{application.position}</p>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Experience: {application.experience}</p>
                        <p>Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                        <p>Source: {application.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.department} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">{metric.department}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{metric.averageRating}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Employees: {metric.employeeCount}</span>
                          <span>Top Performers: {metric.topPerformers}</span>
                        </div>
                        <Progress value={(metric.averageRating / 5) * 100} className="h-2" />
                        {metric.improvementNeeded > 0 && (
                          <p className="text-xs text-yellow-600">
                            {metric.improvementNeeded} need improvement
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={handleStartHRMeeting}
                    disabled={isInCall}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {isInCall ? "In Meeting" : "Start HR Meeting"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={handleAddEmployee}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Employee
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    onClick={handlePostJob}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post Job Opening
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                    onClick={handleGenerateReport}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
