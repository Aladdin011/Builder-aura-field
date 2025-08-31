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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  FileText,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  CreditCard,
  PiggyBank,
  Receipt,
  Calculator,
  BarChart3,
  PieChart,
  LineChart,
  Video,
  Phone,
  MessageSquare,
  Clock,
  RefreshCw,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Building,
  Briefcase,
  Wallet,
  Target,
  Archive,
  BookOpen,
  Send,
  PrinterIcon,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";
import { useCall } from "@/contexts/CallContext";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  status: "pending" | "completed" | "failed";
  reference: string;
  account: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  project: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
  status: "pending" | "paid" | "on-hold";
}

interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentage: number;
  period: string;
}

interface RecurringPayment {
  id: string;
  description: string;
  amount: number;
  frequency: "weekly" | "monthly" | "quarterly" | "annually";
  nextDue: string;
  category: string;
  status: "active" | "paused" | "cancelled";
  autoPayEnabled: boolean;
}

export default function AccountingDashboard() {
  const theme = getDepartmentTheme("accounting");
  const { startCall } = useCall();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedView, setSelectedView] = useState("monthly");

  // Sample data
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 15000000,
      description: "Smart City Project - Phase 1 Payment",
      category: "Project Revenue",
      date: "2024-01-20T10:00:00Z",
      status: "completed",
      reference: "REF-2024-001",
      account: "Main Business Account",
    },
    {
      id: "2",
      type: "expense",
      amount: 2500000,
      description: "Construction Materials - Cement & Steel",
      category: "Materials",
      date: "2024-01-19T14:30:00Z",
      status: "completed",
      reference: "EXP-2024-045",
      account: "Operations Account",
    },
    {
      id: "3",
      type: "income",
      amount: 8750000,
      description: "Solar Installation Project - Final Payment",
      category: "Solar Revenue",
      date: "2024-01-18T09:15:00Z",
      status: "completed",
      reference: "REF-2024-002",
      account: "Main Business Account",
    },
    {
      id: "4",
      type: "expense",
      amount: 1200000,
      description: "Staff Salaries - January 2024",
      category: "Payroll",
      date: "2024-01-15T12:00:00Z",
      status: "completed",
      reference: "PAY-2024-001",
      account: "Payroll Account",
    },
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientName: "Lagos State Government",
      amount: 25000000,
      status: "sent",
      issueDate: "2024-01-15",
      dueDate: "2024-02-14",
      project: "Infrastructure Development - Victoria Island",
      items: [
        {
          description: "Construction Services",
          quantity: 1,
          rate: 20000000,
          amount: 20000000,
        },
        {
          description: "Project Management",
          quantity: 1,
          rate: 5000000,
          amount: 5000000,
        },
      ],
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientName: "Federal Capital Territory",
      amount: 18500000,
      status: "paid",
      issueDate: "2024-01-10",
      dueDate: "2024-02-09",
      project: "Smart City Technology Implementation",
      items: [
        {
          description: "System Integration",
          quantity: 1,
          rate: 15000000,
          amount: 15000000,
        },
        {
          description: "Technical Support",
          quantity: 1,
          rate: 3500000,
          amount: 3500000,
        },
      ],
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      clientName: "Abuja Municipal Area Council",
      amount: 12000000,
      status: "overdue",
      issueDate: "2023-12-20",
      dueDate: "2024-01-19",
      project: "Solar Energy Installation - Phase 2",
      items: [
        {
          description: "Solar Panel Installation",
          quantity: 1,
          rate: 10000000,
          amount: 10000000,
        },
        {
          description: "Maintenance Contract",
          quantity: 1,
          rate: 2000000,
          amount: 2000000,
        },
      ],
    },
  ]);

  const [payrollRecords] = useState<PayrollRecord[]>([
    {
      id: "1",
      employeeId: "EMP-001",
      employeeName: "Jude Onwudebe",
      department: "Management",
      basicSalary: 2000000,
      allowances: 500000,
      deductions: 150000,
      netPay: 2350000,
      payPeriod: "January 2024",
      status: "paid",
    },
    {
      id: "2",
      employeeId: "EMP-002",
      employeeName: "Sarah Okafor",
      department: "Administration",
      basicSalary: 800000,
      allowances: 150000,
      deductions: 75000,
      netPay: 875000,
      payPeriod: "January 2024",
      status: "paid",
    },
    {
      id: "3",
      employeeId: "EMP-003",
      employeeName: "Michael Adebayo",
      department: "Business Development",
      basicSalary: 1200000,
      allowances: 200000,
      deductions: 100000,
      netPay: 1300000,
      payPeriod: "January 2024",
      status: "pending",
    },
  ]);

  const [budgetItems] = useState<BudgetItem[]>([
    {
      id: "1",
      category: "Project Expenses",
      budgeted: 50000000,
      actual: 42000000,
      variance: -8000000,
      percentage: 84,
      period: "Q1 2024",
    },
    {
      id: "2",
      category: "Staff Costs",
      budgeted: 25000000,
      actual: 26500000,
      variance: 1500000,
      percentage: 106,
      period: "Q1 2024",
    },
    {
      id: "3",
      category: "Operations",
      budgeted: 15000000,
      actual: 12800000,
      variance: -2200000,
      percentage: 85.3,
      period: "Q1 2024",
    },
    {
      id: "4",
      category: "Marketing",
      budgeted: 8000000,
      actual: 9200000,
      variance: 1200000,
      percentage: 115,
      period: "Q1 2024",
    },
  ]);

  const [recurringPayments] = useState<RecurringPayment[]>([
    {
      id: "1",
      description: "Office Rent - Abuja HQ",
      amount: 2500000,
      frequency: "monthly",
      nextDue: "2024-02-01",
      category: "Facilities",
      status: "active",
      autoPayEnabled: true,
    },
    {
      id: "2",
      description: "Insurance Premium - General Liability",
      amount: 5000000,
      frequency: "quarterly",
      nextDue: "2024-03-15",
      category: "Insurance",
      status: "active",
      autoPayEnabled: false,
    },
    {
      id: "3",
      description: "Software Licenses - Project Management",
      amount: 150000,
      frequency: "monthly",
      nextDue: "2024-02-01",
      category: "Technology",
      status: "active",
      autoPayEnabled: true,
    },
  ]);

  // Financial metrics
  const totalRevenue = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const pendingInvoices = invoices.filter((inv) => inv.status !== "paid");
  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "sent":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
      case "overdue":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
      case "paused":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+15.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      change: "+8.1%",
      trend: "up",
      icon: TrendingDown,
    },
    {
      title: "Net Profit",
      value: formatCurrency(netProfit),
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      change: "+2.3%",
      trend: "up",
      icon: Target,
    },
  ];

  return (
    <DashboardThemeWrapper
      department="accounting"
      title="Financial Management Center"
      description="Comprehensive accounting, budgeting, and financial analytics for JD Marc Limited."
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
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="current-quarter">This Quarter</SelectItem>
                  <SelectItem value="current-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-500" />
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => startCall("accounting")}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Finance Call
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Financial KPI Cards */}
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
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-full">
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
                    {stat.change} vs last period
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
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Payroll
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue vs Expenses Chart */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className={`h-5 w-5 ${theme.badge.text}`} />
                      Revenue vs Expenses Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-center">
                        <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Revenue & Expenses Chart ({selectedView} view)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className={`h-5 w-5 ${theme.badge.text}`} />
                      Recent Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "income"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {transaction.category} • {transaction.reference}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <Badge
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle
                        className={`h-5 w-5 ${theme.badge.text}`}
                      />
                      Payment Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                              Overdue Invoices
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-300">
                              {overdueInvoices.length} invoices past due date
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Pending Payments
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-300">
                              Office rent due in 3 days
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Bell className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Tax Deadline
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-300">
                              VAT return due February 28th
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className={`h-5 w-5 ${theme.badge.text}`} />
                      Cash Flow Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Current Balance
                        </span>
                        <span className="font-bold text-lg text-green-600">
                          {formatCurrency(netProfit)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Pending Receivables
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            pendingInvoices.reduce(
                              (sum, inv) => sum + inv.amount,
                              0,
                            ),
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Upcoming Expenses
                        </span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(
                            recurringPayments
                              .filter((p) => p.status === "active")
                              .reduce((sum, p) => sum + p.amount, 0),
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className={`h-5 w-5 ${theme.badge.text}`} />
                      Financial News
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                        <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">
                          CBN Raises Interest Rates
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Impact on construction loan rates expected
                        </p>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                        <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">
                          New Tax Regulations
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Updated VAT rules for construction sector
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Invoice Management
              </h3>
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {invoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {invoice.invoiceNumber}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {invoice.clientName} • {invoice.project}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                            {formatCurrency(invoice.amount)}
                          </p>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Issue Date
                          </p>
                          <p className="font-medium">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Due Date
                          </p>
                          <p className="font-medium">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Items
                          </p>
                          <p className="font-medium">
                            {invoice.items.length} items
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Status
                          </p>
                          <p className="font-medium capitalize">
                            {invoice.status}
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
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Payroll Management
              </h3>
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                <Calculator className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {payrollRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                            {record.employeeName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {record.department} • {record.payPeriod}
                          </p>
                        </div>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Basic Salary
                          </p>
                          <p className="font-medium">
                            {formatCurrency(record.basicSalary)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Allowances
                          </p>
                          <p className="font-medium text-green-600">
                            +{formatCurrency(record.allowances)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Deductions
                          </p>
                          <p className="font-medium text-red-600">
                            -{formatCurrency(record.deductions)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Net Pay
                          </p>
                          <p className="font-bold text-lg">
                            {formatCurrency(record.netPay)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className={`h-5 w-5 ${theme.badge.text}`} />
                  Budget vs Actual Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.category}
                        </h4>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              item.variance >= 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {item.variance >= 0 ? "+" : ""}
                            {formatCurrency(item.variance)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.percentage.toFixed(1)}% of budget
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Budgeted
                          </p>
                          <p className="font-medium">
                            {formatCurrency(item.budgeted)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Actual
                          </p>
                          <p className="font-medium">
                            {formatCurrency(item.actual)}
                          </p>
                        </div>
                      </div>

                      <Progress
                        value={Math.min(item.percentage, 100)}
                        className={`h-2 ${
                          item.percentage > 100
                            ? "[&>div]:bg-red-500"
                            : item.percentage > 90
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${theme.badge.text}`} />
                  Recurring Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recurringPayments.map((payment, index) => (
                    <div
                      key={payment.id}
                      className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                            {payment.description}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {payment.category} • {payment.frequency}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Next:{" "}
                            {new Date(payment.nextDue).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profit & Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">P&L Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Cash Flow Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Expense Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Finance Team Communication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme.badge.text}`} />
                Finance Team Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with accounting team and financial advisors
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startCall("accounting")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => startCall("accounting")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Finance Chat
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
