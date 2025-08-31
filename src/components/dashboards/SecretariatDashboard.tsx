import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Phone,
  Video,
  MessageSquare,
  FileText,
  Folder,
  Archive,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Bot,
  Briefcase,
  Building,
  Coffee,
  Car,
  Shield,
  Key,
  Clipboard,
  BookOpen,
  Bell,
  Star,
  ThumbsUp,
  Activity,
  TrendingUp,
  Send,
  Paperclip,
  Settings,
  Home,
  Zap,
  Target,
  Award,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";
import { useCall } from "@/contexts/CallContext";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  assignedBy: string;
  category: "admin" | "correspondence" | "meeting" | "document";
  estimatedTime: number;
}

interface Meeting {
  id: string;
  title: string;
  organizer: string;
  attendees: string[];
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: "in-person" | "video" | "phone";
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  agenda: string[];
  priority: "high" | "medium" | "low";
}

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  type: "email" | "internal" | "sms";
  status: "unread" | "read" | "replied";
  attachments?: string[];
  priority: "high" | "medium" | "low";
}

interface Document {
  id: string;
  name: string;
  type: string;
  category: "contract" | "report" | "memo" | "policy" | "correspondence";
  size: string;
  uploadDate: string;
  lastModified: string;
  status: "draft" | "review" | "approved" | "archived";
  tags: string[];
  confidentialityLevel: "public" | "internal" | "confidential" | "restricted";
}

interface Visitor {
  id: string;
  name: string;
  company: string;
  purpose: string;
  host: string;
  checkIn: string;
  checkOut?: string;
  status: "expected" | "checked-in" | "checked-out";
  idNumber: string;
  phone: string;
  vehicleNumber?: string;
}

interface ExecutiveBriefing {
  id: string;
  title: string;
  type: "update" | "reminder" | "urgent" | "information";
  content: string;
  priority: "high" | "medium" | "low";
  date: string;
  relatedMeeting?: string;
  actionRequired: boolean;
}

export default function SecretariatDashboard() {
  const theme = getDepartmentTheme("secretariat-admin");
  const { startCall } = useCall();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Prepare Board Meeting Minutes",
      description:
        "Draft and distribute minutes from the monthly board meeting",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-22",
      assignedBy: "Jude Onwudebe",
      category: "document",
      estimatedTime: 120,
    },
    {
      id: "2",
      title: "Schedule Executive Interviews",
      description: "Coordinate interviews for Senior Project Manager position",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-25",
      assignedBy: "HR Department",
      category: "meeting",
      estimatedTime: 60,
    },
    {
      id: "3",
      title: "Update Company Policies",
      description: "Review and update remote work policies",
      priority: "medium",
      status: "pending",
      dueDate: "2024-01-30",
      assignedBy: "Management",
      category: "document",
      estimatedTime: 180,
    },
    {
      id: "4",
      title: "Organize Travel Arrangements",
      description: "Book flights and accommodation for Lagos project visit",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-20",
      assignedBy: "Project Manager",
      category: "admin",
      estimatedTime: 45,
    },
  ]);

  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Weekly Executive Review",
      organizer: "Jude Onwudebe",
      attendees: ["Sarah Okafor", "Michael Adebayo", "Grace Nwosu"],
      date: "2024-01-22",
      startTime: "09:00",
      endTime: "10:30",
      location: "Board Room",
      type: "in-person",
      status: "scheduled",
      agenda: [
        "Project Status Updates",
        "Financial Review",
        "New Business Opportunities",
      ],
      priority: "high",
    },
    {
      id: "2",
      title: "Client Presentation - Smart City Project",
      organizer: "Michael Adebayo",
      attendees: ["Lagos State Team", "Project Engineers"],
      date: "2024-01-23",
      startTime: "14:00",
      endTime: "16:00",
      location: "Conference Room A",
      type: "video",
      status: "scheduled",
      agenda: [
        "Project Overview",
        "Technical Specifications",
        "Timeline and Milestones",
      ],
      priority: "high",
    },
    {
      id: "3",
      title: "HR Policy Review",
      organizer: "David Emeka",
      attendees: ["Management Team", "Department Heads"],
      date: "2024-01-24",
      startTime: "11:00",
      endTime: "12:00",
      location: "Virtual Meeting",
      type: "video",
      status: "scheduled",
      agenda: ["Policy Updates", "Implementation Guidelines"],
      priority: "medium",
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "info@lagosstate.gov.ng",
      recipient: "sarah.admin@jdmarcng.com",
      subject: "Infrastructure Project Approval - Urgent Response Required",
      content:
        "Dear JD Marc Limited, We are pleased to inform you that your infrastructure development proposal has been approved...",
      timestamp: "2024-01-20T10:30:00Z",
      type: "email",
      status: "unread",
      priority: "high",
      attachments: ["approval_letter.pdf"],
    },
    {
      id: "2",
      sender: "Jude Onwudebe",
      recipient: "sarah.admin@jdmarcng.com",
      subject: "Board Meeting Preparation",
      content:
        "Sarah, please prepare the quarterly financial reports for tomorrow's board meeting...",
      timestamp: "2024-01-20T08:15:00Z",
      type: "internal",
      status: "read",
      priority: "high",
    },
    {
      id: "3",
      sender: "contracts@fcda.gov.ng",
      recipient: "sarah.admin@jdmarcng.com",
      subject: "Contract Amendment - Solar Energy Project",
      content:
        "Please find attached the contract amendment for the solar energy installation project...",
      timestamp: "2024-01-19T16:45:00Z",
      type: "email",
      status: "replied",
      priority: "medium",
      attachments: ["contract_amendment.pdf"],
    },
  ]);

  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Q4 2023 Financial Report",
      type: "PDF",
      category: "report",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      lastModified: "2024-01-20",
      status: "approved",
      tags: ["financial", "quarterly", "2023"],
      confidentialityLevel: "internal",
    },
    {
      id: "2",
      name: "Board Meeting Minutes - January 2024",
      type: "DOCX",
      category: "memo",
      size: "1.1 MB",
      uploadDate: "2024-01-18",
      lastModified: "2024-01-18",
      status: "draft",
      tags: ["board", "meeting", "minutes"],
      confidentialityLevel: "confidential",
    },
    {
      id: "3",
      name: "Updated Remote Work Policy",
      type: "PDF",
      category: "policy",
      size: "890 KB",
      uploadDate: "2024-01-12",
      lastModified: "2024-01-19",
      status: "review",
      tags: ["policy", "remote-work", "HR"],
      confidentialityLevel: "internal",
    },
    {
      id: "4",
      name: "Lagos State Contract - Signed",
      type: "PDF",
      category: "contract",
      size: "3.2 MB",
      uploadDate: "2024-01-10",
      lastModified: "2024-01-10",
      status: "approved",
      tags: ["contract", "lagos", "infrastructure"],
      confidentialityLevel: "restricted",
    },
  ]);

  const [visitors] = useState<Visitor[]>([
    {
      id: "1",
      name: "Dr. Adebayo Williams",
      company: "Lagos State Ministry of Works",
      purpose: "Project Discussion",
      host: "Jude Onwudebe",
      checkIn: "2024-01-20T09:30:00Z",
      status: "checked-in",
      idNumber: "A12345678",
      phone: "+234 801 234 5678",
    },
    {
      id: "2",
      name: "Eng. Fatima Ahmed",
      company: "FCT Development Authority",
      purpose: "Contract Review",
      host: "Michael Adebayo",
      checkIn: "2024-01-20T11:00:00Z",
      checkOut: "2024-01-20T12:30:00Z",
      status: "checked-out",
      idNumber: "B98765432",
      phone: "+234 802 987 6543",
      vehicleNumber: "ABC-123-DE",
    },
    {
      id: "3",
      name: "Mr. James Okafor",
      company: "Solar Tech Nigeria",
      purpose: "Partnership Meeting",
      host: "Grace Nwosu",
      checkIn: "",
      status: "expected",
      idNumber: "C11223344",
      phone: "+234 803 456 7890",
    },
  ]);

  const [executiveBriefings] = useState<ExecutiveBriefing[]>([
    {
      id: "1",
      title: "Lagos State Project Approval Received",
      type: "urgent",
      content:
        "Infrastructure development project has been approved. Contract signing scheduled for next week.",
      priority: "high",
      date: "2024-01-20",
      actionRequired: true,
    },
    {
      id: "2",
      title: "Board Meeting Tomorrow",
      type: "reminder",
      content:
        "Monthly board meeting scheduled for 9:00 AM. Financial reports and project updates required.",
      priority: "high",
      date: "2024-01-21",
      relatedMeeting: "1",
      actionRequired: false,
    },
    {
      id: "3",
      title: "Quarterly Tax Filing Deadline",
      type: "reminder",
      content: "VAT and corporate tax returns due by January 31st, 2024.",
      priority: "medium",
      date: "2024-01-18",
      actionRequired: true,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "checked-out":
      case "replied":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "scheduled":
      case "draft":
      case "expected":
      case "unread":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
      case "ongoing":
      case "review":
      case "checked-in":
      case "read":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case "restricted":
        return "bg-red-100 text-red-800 border-red-200";
      case "confidential":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "internal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "public":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = [
    {
      title: "Pending Tasks",
      value: tasks.filter((t) => t.status === "pending").length,
      change: "-2",
      trend: "down",
      icon: Clipboard,
    },
    {
      title: "Today's Meetings",
      value: meetings.filter(
        (m) => m.date === new Date().toISOString().split("T")[0],
      ).length,
      change: "+1",
      trend: "up",
      icon: CalendarIcon,
    },
    {
      title: "Unread Messages",
      value: messages.filter((m) => m.status === "unread").length,
      change: "+3",
      trend: "up",
      icon: Mail,
    },
    {
      title: "Active Visitors",
      value: visitors.filter((v) => v.status === "checked-in").length,
      change: "0",
      trend: "stable",
      icon: Users,
    },
  ];

  return (
    <DashboardThemeWrapper
      department="secretariat"
      title="Executive Secretariat Command Center"
      description="Comprehensive administrative support, scheduling, and executive assistance for JD Marc Limited leadership."
    >
      <div className="space-y-6">
        {/* Top Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks, meetings, documents..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => startCall("secretariat-admin")}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Executive Call
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <TrendingUp
                    className={`h-4 w-4 mr-1 ${
                      stat.trend === "up"
                        ? "text-green-500"
                        : stat.trend === "down"
                          ? "text-red-500 rotate-180"
                          : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {stat.change} vs yesterday
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Tasks & Calendar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calendar Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className={`h-5 w-5 ${theme.badge.text}`} />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Today's Schedule
                  </div>
                  {meetings
                    .filter(
                      (m) => m.date === new Date().toISOString().split("T")[0],
                    )
                    .slice(0, 3)
                    .map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          {meeting.startTime} - {meeting.title}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className={`h-5 w-5 ${theme.badge.text}`} />
                  Priority Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks
                    .filter(
                      (t) => t.priority === "high" && t.status !== "completed",
                    )
                    .slice(0, 4)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className={`h-5 w-5 ${theme.badge.text}`} />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 Suggest scheduling the Lagos State contract signing for
                      Tuesday morning
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      📧 Draft email template for board meeting invitations
                      ready
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Executive Briefing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className={`h-5 w-5 ${theme.badge.text}`} />
                  Executive Briefing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executiveBriefings.slice(0, 3).map((briefing) => (
                    <motion.div
                      key={briefing.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                              {briefing.title}
                            </h4>
                            <Badge
                              className={getPriorityColor(briefing.priority)}
                            >
                              {briefing.priority}
                            </Badge>
                            {briefing.actionRequired && (
                              <Badge className="bg-orange-100 text-orange-800">
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {briefing.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(briefing.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className={`h-5 w-5 ${theme.badge.text}`} />
                    Task Management
                  </CardTitle>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                              {task.title}
                            </h4>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {task.description}
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Due:</span>{" "}
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Assigned by:</span>{" "}
                              {task.assignedBy}
                            </div>
                            <div>
                              <span className="font-medium">Est. Time:</span>{" "}
                              {task.estimatedTime} min
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Archive */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Archive className={`h-5 w-5 ${theme.badge.text}`} />
                    Document Archive
                  </CardTitle>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                            {doc.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {doc.size} • {doc.type} •{" "}
                            {new Date(doc.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getConfidentialityColor(
                            doc.confidentialityLevel,
                          )}
                        >
                          {doc.confidentialityLevel}
                        </Badge>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Messages & Visitors */}
          <div className="lg:col-span-1 space-y-6">
            {/* Message Center */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className={`h-5 w-5 ${theme.badge.text}`} />
                  Message Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.slice(0, 4).map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 ${
                        message.status === "unread"
                          ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                              {message.sender}
                            </p>
                            <Badge
                              className={getPriorityColor(message.priority)}
                            >
                              {message.priority}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                            {message.content.substring(0, 50)}...
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {message.attachments && (
                            <Paperclip className="h-3 w-3 text-gray-400" />
                          )}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              message.status === "unread"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  <Send className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </CardContent>
            </Card>

            {/* Visitor Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className={`h-5 w-5 ${theme.badge.text}`} />
                  Visitor Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                            {visitor.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {visitor.company}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Host: {visitor.host}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Purpose: {visitor.purpose}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(visitor.status)}>
                            {visitor.status}
                          </Badge>
                          {visitor.checkIn && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(visitor.checkIn).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Register Visitor
                </Button>
              </CardContent>
            </Card>

            {/* Quick Contact Directory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className={`h-5 w-5 ${theme.badge.text}`} />
                  Quick Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "Jude Onwudebe",
                      role: "Managing Director",
                      status: "available",
                    },
                    {
                      name: "Michael Adebayo",
                      role: "Business Development",
                      status: "in-meeting",
                    },
                    {
                      name: "Grace Nwosu",
                      role: "Financial Analyst",
                      status: "busy",
                    },
                    {
                      name: "David Emeka",
                      role: "HR Coordinator",
                      status: "away",
                    },
                  ].map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            contact.status === "available"
                              ? "bg-green-500"
                              : contact.status === "busy"
                                ? "bg-red-500"
                                : contact.status === "in-meeting"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {contact.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {contact.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="p-1">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Always-on Communication Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme.badge.text}`} />
                Executive Communication Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Always-on communication center for executive support and
                  administrative coordination
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startCall("secretariat-admin")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => startCall("secretariat-admin")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Admin Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardThemeWrapper>
  );
}
