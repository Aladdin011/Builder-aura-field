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
import { Progress } from "@/components/ui/progress";
import {
  Building,
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  FileText,
  MessageSquare,
  Video,
  Phone,
  Zap,
  Activity,
  Briefcase,
  Map,
  Settings,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Share2,
  Bell,
  Star,
  Award,
  Layers,
  GitBranch,
  Code,
  Database,
  Globe,
  Cpu,
  HardDrive,
  Monitor,
  Gauge,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";
import { useCall } from "@/contexts/CallContext";

interface Project {
  id: string;
  name: string;
  client: string;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  team: string[];
  manager: string;
  priority: "low" | "medium" | "high" | "critical";
  type: "construction" | "solar" | "infrastructure" | "consulting";
  location: string;
}

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  availability: "available" | "busy" | "away" | "on-leave";
  currentProjects: string[];
  skills: string[];
  workload: number;
}

interface ResourceUsage {
  id: string;
  name: string;
  type: "equipment" | "material" | "personnel" | "budget";
  total: number;
  allocated: number;
  available: number;
  unit: string;
  cost: number;
}

interface ProjectFile {
  id: string;
  name: string;
  project: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  version: number;
  status: "draft" | "review" | "approved" | "archived";
}

export default function ProjectDashboard() {
  const theme = getDepartmentTheme("project-management");
  const { startCall } = useCall();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("current");

  // Sample data
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Lagos Smart City Infrastructure",
      client: "Lagos State Government",
      status: "active",
      progress: 68,
      startDate: "2023-09-01",
      endDate: "2024-06-30",
      budget: 450000000,
      spent: 306000000,
      team: ["John Doe", "Sarah Smith", "Mike Johnson", "Alice Brown"],
      manager: "Donatus Oduopara",
      priority: "critical",
      type: "infrastructure",
      location: "Lagos, Nigeria",
    },
    {
      id: "2",
      name: "Abuja Solar Energy Installation",
      client: "Federal Capital Territory",
      status: "active",
      progress: 42,
      startDate: "2023-11-15",
      endDate: "2024-04-15",
      budget: 180000000,
      spent: 75600000,
      team: ["David Wilson", "Emma Davis", "Tom Garcia"],
      manager: "James Abel",
      priority: "high",
      type: "solar",
      location: "Abuja, Nigeria",
    },
    {
      id: "3",
      name: "Kano Industrial Complex",
      client: "Kano State Industrial Development",
      status: "planning",
      progress: 15,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      budget: 320000000,
      spent: 48000000,
      team: ["Lisa Chen", "Mark Taylor", "Nina Patel"],
      manager: "Donatus Oduopara",
      priority: "medium",
      type: "construction",
      location: "Kano, Nigeria",
    },
    {
      id: "4",
      name: "Port Harcourt Bridge Renovation",
      client: "Rivers State Ministry of Works",
      status: "completed",
      progress: 100,
      startDate: "2023-03-01",
      endDate: "2023-11-30",
      budget: 95000000,
      spent: 92000000,
      team: ["Chris Lee", "Ana Rodriguez"],
      manager: "James Abel",
      priority: "high",
      type: "infrastructure",
      location: "Port Harcourt, Nigeria",
    },
  ]);

  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Foundation Construction Phase 2",
      project: "Lagos Smart City Infrastructure",
      assignee: "John Doe",
      status: "in-progress",
      priority: "high",
      dueDate: "2024-01-25",
      estimatedHours: 120,
      actualHours: 95,
      dependencies: ["foundation-phase-1"],
    },
    {
      id: "2",
      title: "Solar Panel Installation - Block A",
      project: "Abuja Solar Energy Installation",
      assignee: "David Wilson",
      status: "todo",
      priority: "high",
      dueDate: "2024-01-30",
      estimatedHours: 80,
      dependencies: [],
    },
    {
      id: "3",
      title: "Environmental Impact Assessment",
      project: "Kano Industrial Complex",
      assignee: "Lisa Chen",
      status: "review",
      priority: "medium",
      dueDate: "2024-02-05",
      estimatedHours: 60,
      actualHours: 55,
      dependencies: [],
    },
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      role: "Senior Engineer",
      department: "Engineering",
      availability: "busy",
      currentProjects: ["Lagos Smart City Infrastructure"],
      skills: ["Civil Engineering", "Project Planning", "AutoCAD"],
      workload: 85,
    },
    {
      id: "2",
      name: "Sarah Smith",
      role: "Construction Manager",
      department: "Construction",
      availability: "available",
      currentProjects: ["Lagos Smart City Infrastructure"],
      skills: ["Construction Management", "Safety", "Quality Control"],
      workload: 65,
    },
    {
      id: "3",
      name: "David Wilson",
      role: "Solar Specialist",
      department: "Solar Energy",
      availability: "busy",
      currentProjects: ["Abuja Solar Energy Installation"],
      skills: ["Solar Installation", "Electrical Systems", "Maintenance"],
      workload: 90,
    },
  ]);

  const [resourceUsage] = useState<ResourceUsage[]>([
    {
      id: "1",
      name: "Heavy Machinery",
      type: "equipment",
      total: 15,
      allocated: 12,
      available: 3,
      unit: "units",
      cost: 25000000,
    },
    {
      id: "2",
      name: "Construction Materials",
      type: "material",
      total: 100,
      allocated: 75,
      available: 25,
      unit: "tons",
      cost: 85000000,
    },
    {
      id: "3",
      name: "Engineering Team",
      type: "personnel",
      total: 25,
      allocated: 20,
      available: 5,
      unit: "engineers",
      cost: 45000000,
    },
    {
      id: "4",
      name: "Project Budget Q1",
      type: "budget",
      total: 200000000,
      allocated: 145000000,
      available: 55000000,
      unit: "NGN",
      cost: 200000000,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "done":
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
      case "review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "planning":
      case "todo":
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "on-hold":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      case "away":
        return "bg-yellow-500";
      case "on-leave":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const activeProjects = projects.filter((p) => p.status === "active");
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress =
    projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;

  const stats = [
    {
      title: "Active Projects",
      value: activeProjects.length,
      total: projects.length,
      change: "+2",
      trend: "up",
      icon: Building,
    },
    {
      title: "Total Budget",
      value: formatCurrency(totalBudget),
      change: "+15%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Budget Utilization",
      value: `${((totalSpent / totalBudget) * 100).toFixed(1)}%`,
      change: "+5%",
      trend: "up",
      icon: Target,
    },
    {
      title: "Avg Progress",
      value: `${avgProgress.toFixed(1)}%`,
      change: "+12%",
      trend: "up",
      icon: Activity,
    },
  ];

  return (
    <DashboardThemeWrapper
      department="project"
      title="Project Management Command Center"
      description="Comprehensive project oversight, resource management, and team coordination for JD Marc Limited."
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
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => startCall("project-management")}
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Team Call
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
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
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {stat.value}
                      {stat.total && (
                        <span className="text-lg text-gray-500 ml-1">
                          /{stat.total}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full">
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
                    {stat.change} vs last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Cards */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className={`h-5 w-5 ${theme.badge.text}`} />
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {activeProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                {project.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {project.client} • {project.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={getPriorityColor(project.priority)}
                              >
                                {project.priority}
                              </Badge>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {project.manager}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">
                                {project.progress}%
                              </span>
                            </div>
                            <Progress
                              value={project.progress}
                              className="h-2"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Budget
                              </p>
                              <p className="font-medium">
                                {formatCurrency(project.budget)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Spent
                              </p>
                              <p className="font-medium">
                                {formatCurrency(project.spent)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">
                                Team Size
                              </p>
                              <p className="font-medium">
                                {project.team.length} members
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Gantt Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className={`h-5 w-5 ${theme.badge.text}`} />
                      Project Timeline (Gantt View)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Interactive Gantt Chart with Dependencies
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Resource Heatmap */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className={`h-5 w-5 ${theme.badge.text}`} />
                      Resource Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resourceUsage.map((resource, index) => (
                        <div key={resource.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {resource.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {(
                                (resource.allocated / resource.total) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <Progress
                            value={(resource.allocated / resource.total) * 100}
                            className={`h-2 ${
                              resource.allocated / resource.total > 0.9
                                ? "[&>div]:bg-red-500"
                                : resource.allocated / resource.total > 0.7
                                  ? "[&>div]:bg-yellow-500"
                                  : "[&>div]:bg-green-500"
                            }`}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              {resource.allocated}/{resource.total}{" "}
                              {resource.unit}
                            </span>
                            <span>{formatCurrency(resource.cost)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Availability */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className={`h-5 w-5 ${theme.badge.text}`} />
                      Team Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getAvailabilityColor(
                                member.availability,
                              )}`}
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {member.role}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {member.workload}%
                            </p>
                            <div className="flex gap-1 mt-1">
                              <Button size="sm" variant="ghost" className="p-1">
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="p-1">
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className={`h-5 w-5 ${theme.badge.text}`} />
                      Smart Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                              Budget Alert
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-300">
                              Lagos project 5% over budget
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Milestone Due
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-300">
                              Foundation Phase 2 due tomorrow
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Team Update
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-300">
                              John mentioned you in project chat
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                All Projects
              </h3>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {project.name}
                          </CardTitle>
                          <CardDescription>{project.client}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">
                            {formatCurrency(project.budget)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team:</span>
                          <span className="font-medium">
                            {project.team.length} members
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deadline:</span>
                          <span className="font-medium">
                            {new Date(project.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className={`h-5 w-5 ${theme.badge.text}`} />
                  Kanban Board
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {["todo", "in-progress", "review", "done"].map((status) => (
                    <div key={status} className="space-y-4">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                        {status.replace("-", " ")} (
                        {tasks.filter((t) => t.status === status).length})
                      </h3>
                      <div className="space-y-3">
                        {tasks
                          .filter((t) => t.status === status)
                          .map((task) => (
                            <div
                              key={task.id}
                              className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-sm"
                            >
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                                  {task.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {task.project}
                                </p>
                                <div className="flex items-center justify-between">
                                  <Badge
                                    className={getPriorityColor(task.priority)}
                                  >
                                    {task.priority}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {task.estimatedHours}h
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  Due:{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourceUsage.map((resource, index) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5" />
                      {resource.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Allocation</span>
                        <span className="font-medium">
                          {resource.allocated}/{resource.total} {resource.unit}
                        </span>
                      </div>
                      <Progress
                        value={(resource.allocated / resource.total) * 100}
                        className="h-3"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Available</p>
                        <p className="font-medium">
                          {resource.available} {resource.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost</p>
                        <p className="font-medium">
                          {formatCurrency(resource.cost)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(
                            member.availability,
                          )} rounded-full border-2 border-white`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Workload</span>
                        <span className="text-sm font-medium">
                          {member.workload}%
                        </span>
                      </div>
                      <Progress value={member.workload} className="h-2" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Current Projects
                      </p>
                      <div className="space-y-1">
                        {member.currentProjects.map((project, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Project Communication Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme.badge.text}`} />
                Project Team Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with development teams, contractors, and stakeholders
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startCall("project-management")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => startCall("project-management")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Team Chat
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
