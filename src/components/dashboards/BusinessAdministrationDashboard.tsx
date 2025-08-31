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
  TrendingUp,
  BarChart3,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  FileText,
  MessageSquare,
  Video,
  Phone,
  Calendar,
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
  Activity,
  Globe,
  Monitor,
  Zap,
  Shield,
  Database,
  GitBranch,
  Code,
  Workflow,
  BookOpen,
  Map,
  Gauge,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Archive,
  Trash2,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";
import { useCall } from "@/contexts/CallContext";

interface OrgKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: string;
  category: "financial" | "operational" | "strategic" | "performance";
}

interface Approval {
  id: string;
  title: string;
  type: "budget" | "project" | "policy" | "expense" | "contract";
  requestedBy: string;
  department: string;
  amount?: number;
  status: "pending" | "approved" | "rejected" | "under-review";
  priority: "low" | "medium" | "high" | "critical";
  submittedDate: string;
  dueDate: string;
  description: string;
  documents: string[];
}

interface WorkflowStep {
  id: string;
  name: string;
  type: "action" | "approval" | "notification" | "condition";
  department: string;
  assignee?: string;
  estimatedDuration: number;
  status: "pending" | "active" | "completed" | "blocked";
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: "approval" | "onboarding" | "project" | "maintenance";
  status: "active" | "draft" | "archived";
  steps: WorkflowStep[];
  triggers: string[];
  createdBy: string;
  lastModified: string;
}

interface PolicyDocument {
  id: string;
  title: string;
  category: "hr" | "finance" | "operations" | "compliance" | "safety";
  version: string;
  status: "draft" | "active" | "archived" | "under-review";
  author: string;
  lastUpdated: string;
  effectiveDate: string;
  nextReview: string;
  departments: string[];
}

interface ComplianceItem {
  id: string;
  regulation: string;
  status: "compliant" | "non-compliant" | "pending" | "review-required";
  lastAudit: string;
  nextAudit: string;
  responsible: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  actions: string[];
}

export default function BusinessAdministrationDashboard() {
  const theme = getDepartmentTheme("business-administration");
  const { startCall } = useCall();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("current-month");

  // Sample data
  const [orgKPIs] = useState<OrgKPI[]>([
    {
      id: "1",
      name: "Revenue Growth",
      value: 25.7,
      target: 30,
      unit: "%",
      trend: "up",
      change: "+5.2%",
      category: "financial",
    },
    {
      id: "2",
      name: "Employee Satisfaction",
      value: 8.4,
      target: 9,
      unit: "/10",
      trend: "up",
      change: "+0.3",
      category: "performance",
    },
    {
      id: "3",
      name: "Project Delivery Rate",
      value: 92,
      target: 95,
      unit: "%",
      trend: "stable",
      change: "+1%",
      category: "operational",
    },
    {
      id: "4",
      name: "Client Retention",
      value: 87,
      target: 90,
      unit: "%",
      trend: "down",
      change: "-2.1%",
      category: "strategic",
    },
    {
      id: "5",
      name: "Cost Efficiency",
      value: 78,
      target: 85,
      unit: "%",
      trend: "up",
      change: "+3.5%",
      category: "financial",
    },
    {
      id: "6",
      name: "Innovation Index",
      value: 6.8,
      target: 8,
      unit: "/10",
      trend: "up",
      change: "+0.5",
      category: "strategic",
    },
  ]);

  const [approvals] = useState<Approval[]>([
    {
      id: "1",
      title: "Lagos Infrastructure Project Budget Increase",
      type: "budget",
      requestedBy: "Donatus Oduopara",
      department: "Project Management",
      amount: 15000000,
      status: "pending",
      priority: "high",
      submittedDate: "2024-01-20",
      dueDate: "2024-01-25",
      description:
        "Request for additional budget due to material cost increases",
      documents: ["budget-revision.pdf", "cost-analysis.xlsx"],
    },
    {
      id: "2",
      title: "New Employee Onboarding Process",
      type: "policy",
      requestedBy: "HR Department",
      department: "Human Resources",
      status: "under-review",
      priority: "medium",
      submittedDate: "2024-01-18",
      dueDate: "2024-01-30",
      description: "Updated onboarding process for new hires",
      documents: ["onboarding-policy.pdf"],
    },
    {
      id: "3",
      title: "Solar Panel Supplier Contract",
      type: "contract",
      requestedBy: "James Abel",
      department: "Project Management",
      amount: 45000000,
      status: "approved",
      priority: "critical",
      submittedDate: "2024-01-15",
      dueDate: "2024-01-22",
      description: "3-year contract with preferred solar panel supplier",
      documents: ["contract-draft.pdf", "supplier-evaluation.pdf"],
    },
    {
      id: "4",
      title: "Marketing Campaign Budget",
      type: "expense",
      requestedBy: "Digital Marketing",
      department: "Marketing",
      amount: 2500000,
      status: "pending",
      priority: "medium",
      submittedDate: "2024-01-19",
      dueDate: "2024-01-26",
      description: "Q1 digital marketing campaign budget",
      documents: ["campaign-proposal.pdf"],
    },
  ]);

  const [workflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Budget Approval Process",
      description: "Standard process for budget requests above ₦1M",
      category: "approval",
      status: "active",
      steps: [
        {
          id: "1",
          name: "Department Head Review",
          type: "approval",
          department: "Requesting Department",
          estimatedDuration: 24,
          status: "completed",
        },
        {
          id: "2",
          name: "Finance Team Analysis",
          type: "action",
          department: "Finance",
          assignee: "Finance Team",
          estimatedDuration: 48,
          status: "active",
        },
        {
          id: "3",
          name: "Executive Approval",
          type: "approval",
          department: "Executive",
          estimatedDuration: 72,
          status: "pending",
        },
      ],
      triggers: ["budget_request", "amount > 1000000"],
      createdBy: "System Admin",
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      name: "New Employee Onboarding",
      description: "Complete onboarding process for new hires",
      category: "onboarding",
      status: "active",
      steps: [
        {
          id: "1",
          name: "HR Documentation",
          type: "action",
          department: "HR",
          estimatedDuration: 8,
          status: "completed",
        },
        {
          id: "2",
          name: "IT Setup",
          type: "action",
          department: "IT",
          estimatedDuration: 4,
          status: "completed",
        },
        {
          id: "3",
          name: "Department Introduction",
          type: "action",
          department: "Department",
          estimatedDuration: 16,
          status: "active",
        },
      ],
      triggers: ["new_hire"],
      createdBy: "HR Admin",
      lastModified: "2024-01-10",
    },
  ]);

  const [policies] = useState<PolicyDocument[]>([
    {
      id: "1",
      title: "Remote Work Policy",
      category: "hr",
      version: "2.1",
      status: "active",
      author: "HR Department",
      lastUpdated: "2024-01-15",
      effectiveDate: "2024-02-01",
      nextReview: "2024-07-01",
      departments: ["All Departments"],
    },
    {
      id: "2",
      title: "Financial Approval Authority Matrix",
      category: "finance",
      version: "3.0",
      status: "active",
      author: "Finance Team",
      lastUpdated: "2024-01-10",
      effectiveDate: "2024-01-15",
      nextReview: "2024-04-15",
      departments: ["Finance", "Executive"],
    },
    {
      id: "3",
      title: "Data Security and Privacy Guidelines",
      category: "compliance",
      version: "1.5",
      status: "under-review",
      author: "IT Security",
      lastUpdated: "2024-01-18",
      effectiveDate: "2024-02-15",
      nextReview: "2024-08-15",
      departments: ["All Departments"],
    },
  ]);

  const [compliance] = useState<ComplianceItem[]>([
    {
      id: "1",
      regulation: "Nigeria Data Protection Regulation (NDPR)",
      status: "compliant",
      lastAudit: "2023-12-15",
      nextAudit: "2024-06-15",
      responsible: "IT Security Team",
      riskLevel: "medium",
      actions: ["Annual privacy training", "Data mapping update"],
    },
    {
      id: "2",
      regulation: "Occupational Safety and Health Act",
      status: "review-required",
      lastAudit: "2023-11-20",
      nextAudit: "2024-02-20",
      responsible: "Safety Officer",
      riskLevel: "high",
      actions: ["Site safety audit", "Equipment inspection"],
    },
    {
      id: "3",
      regulation: "Companies and Allied Matters Act (CAMA)",
      status: "compliant",
      lastAudit: "2023-10-30",
      nextAudit: "2024-10-30",
      responsible: "Legal Team",
      riskLevel: "low",
      actions: ["Annual filing", "Board resolutions"],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "compliant":
      case "active":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "under-review":
      case "review-required":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
      case "non-compliant":
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
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

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const highPriorityItems = approvals.filter(
    (a) => a.priority === "high" || a.priority === "critical",
  );
  const complianceIssues = compliance.filter((c) => c.status !== "compliant");
  const activeWorkflows = workflows.filter((w) => w.status === "active");

  const stats = [
    {
      title: "Pending Approvals",
      value: pendingApprovals.length,
      total: approvals.length,
      change: "+2",
      trend: "up",
      icon: Clock,
    },
    {
      title: "Active Workflows",
      value: activeWorkflows.length,
      total: workflows.length,
      change: "+1",
      trend: "up",
      icon: Workflow,
    },
    {
      title: "KPI Target Achievement",
      value: `${Math.round(
        (orgKPIs.filter((kpi) => kpi.value >= kpi.target).length /
          orgKPIs.length) *
          100,
      )}%`,
      change: "+5%",
      trend: "up",
      icon: Target,
    },
    {
      title: "Compliance Score",
      value: `${Math.round(
        (compliance.filter((c) => c.status === "compliant").length /
          compliance.length) *
          100,
      )}%`,
      change: "-2%",
      trend: "down",
      icon: Shield,
    },
  ];

  return (
    <DashboardThemeWrapper
      department="business-administration"
      title="Business Administration Command Center"
      description="Organization-wide KPIs, approval workflows, policy management, and governance oversight for JD Marc Limited."
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
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="current-quarter">Current Quarter</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search approvals, workflows..."
              className="w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => startCall("business-administration")}
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
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
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Organizational KPIs */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className={`h-5 w-5 ${theme.badge.text}`} />
                      Organization-wide KPIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {orgKPIs.map((kpi, index) => (
                        <motion.div
                          key={kpi.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="p-4 border border-gray-200 dark:border-slate-600 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                {kpi.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                {kpi.category}
                              </p>
                            </div>
                            {getTrendIcon(kpi.trend)}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                {kpi.value}
                                {kpi.unit}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Target: {kpi.target}
                                {kpi.unit}
                              </span>
                            </div>
                            <Progress
                              value={(kpi.value / kpi.target) * 100}
                              className="h-2"
                            />
                            <div className="flex justify-between text-sm">
                              <span
                                className={`${
                                  kpi.trend === "up"
                                    ? "text-green-600"
                                    : kpi.trend === "down"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {kpi.change} vs last period
                              </span>
                              <span
                                className={
                                  kpi.value >= kpi.target
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }
                              >
                                {kpi.value >= kpi.target
                                  ? "✓ On Target"
                                  : "Below Target"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Executive Dashboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className={`h-5 w-5 ${theme.badge.text}`} />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                              Company Health
                            </h4>
                          </div>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                            85%
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Overall performance score
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-900 dark:text-green-200">
                              Growth Rate
                            </h4>
                          </div>
                          <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                            +18%
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Year-over-year growth
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            <h4 className="font-semibold text-purple-900 dark:text-purple-200">
                              Team Efficiency
                            </h4>
                          </div>
                          <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                            92%
                          </p>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            Average productivity score
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Urgent Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle
                        className={`h-5 w-5 ${theme.badge.text}`}
                      />
                      Urgent Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {highPriorityItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                {item.title}
                              </p>
                              <p className="text-xs text-red-600 dark:text-red-300">
                                Due:{" "}
                                {new Date(item.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {complianceIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            <Shield className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                {issue.regulation}
                              </p>
                              <p className="text-xs text-yellow-600 dark:text-yellow-300">
                                Status: {issue.status.replace("-", " ")}
                              </p>
                            </div>
                            <div
                              className={`w-2 h-2 rounded-full ${getRiskLevelColor(issue.riskLevel)}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className={`h-5 w-5 ${theme.badge.text}`} />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Active Policies
                        </span>
                        <span className="font-medium">
                          {policies.filter((p) => p.status === "active").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Workflows Running
                        </span>
                        <span className="font-medium">
                          {activeWorkflows.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Pending Reviews
                        </span>
                        <span className="font-medium text-orange-600">
                          {
                            policies.filter((p) => p.status === "under-review")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Compliance Issues
                        </span>
                        <span className="font-medium text-red-600">
                          {complianceIssues.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className={`h-5 w-5 ${theme.badge.text}`} />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-slate-800 dark:text-slate-200">
                            Solar Panel Contract approved
                          </p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-slate-800 dark:text-slate-200">
                            New workflow created
                          </p>
                          <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                        <div>
                          <p className="text-sm text-slate-800 dark:text-slate-200">
                            Policy review requested
                          </p>
                          <p className="text-xs text-gray-500">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Approval Management
              </h3>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Approval Request
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {approvals.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {approval.title}
                          </CardTitle>
                          <CardDescription>
                            Requested by {approval.requestedBy} •{" "}
                            {approval.department}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(approval.status)}>
                            {approval.status.replace("-", " ")}
                          </Badge>
                          <Badge
                            className={getPriorityColor(approval.priority)}
                          >
                            {approval.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {approval.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Type
                          </p>
                          <p className="font-medium capitalize">
                            {approval.type}
                          </p>
                        </div>
                        {approval.amount && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Amount
                            </p>
                            <p className="font-medium">
                              {formatCurrency(approval.amount)}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Due Date
                          </p>
                          <p className="font-medium">
                            {new Date(approval.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {approval.documents.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Attached Documents
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {approval.documents.map((doc, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {approval.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Comment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Workflow Builder & Management
              </h3>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {workflow.name}
                          </CardTitle>
                          <CardDescription>
                            {workflow.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">
                          Workflow Steps
                        </h4>
                        {workflow.steps.map((step, idx) => (
                          <div
                            key={step.id}
                            className="flex items-center gap-3"
                          >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {step.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {step.department} • {step.estimatedDuration}h
                              </p>
                            </div>
                            <Badge className={getStatusColor(step.status)}>
                              {step.status.replace("-", " ")}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Category
                          </p>
                          <p className="font-medium capitalize">
                            {workflow.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Last Modified
                          </p>
                          <p className="font-medium">
                            {new Date(
                              workflow.lastModified,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <GitBranch className="h-3 w-3 mr-1" />
                          Clone
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Policy Management
              </h3>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Policy
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {policy.title}
                          </CardTitle>
                          <CardDescription>
                            Version {policy.version}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium capitalize">
                            {policy.category}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Author:</span>
                          <span className="font-medium">{policy.author}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Effective Date:</span>
                          <span className="font-medium">
                            {new Date(
                              policy.effectiveDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Review:</span>
                          <span className="font-medium">
                            {new Date(policy.nextReview).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Applies to:</p>
                        <div className="flex flex-wrap gap-1">
                          {policy.departments.map((dept, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Compliance Management
              </h3>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Regulation
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {compliance.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {item.regulation}
                          </CardTitle>
                          <CardDescription>
                            Responsible: {item.responsible}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace("-", " ")}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${getRiskLevelColor(item.riskLevel)}`}
                            />
                            <span className="text-sm capitalize">
                              {item.riskLevel} Risk
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Last Audit
                          </p>
                          <p className="font-medium">
                            {new Date(item.lastAudit).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Next Audit
                          </p>
                          <p className="font-medium">
                            {new Date(item.nextAudit).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Required Actions
                        </p>
                        <div className="space-y-2">
                          {item.actions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-slate-800 dark:text-slate-200">
                                {action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule Audit
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Internal Communication Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme.badge.text}`} />
                Executive Communication Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with department heads, executives, and board members
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startCall("business-administration")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => startCall("business-administration")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Conference
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Executive Chat
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
