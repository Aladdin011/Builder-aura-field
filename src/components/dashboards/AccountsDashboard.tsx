import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  FileText,
  TrendingUp,
  CreditCard,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";

interface Invoice {
  id: string;
  project: string;
  client: string;
  amount: string;
  status: "paid" | "pending" | "overdue" | "draft";
  dueDate: string;
  issueDate: string;
}

export default function AccountsDashboard() {
  const theme = getDepartmentTheme("accounting");

  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      project: "Lagos Smart City Phase 2",
      client: "Lagos State Government",
      amount: "₦25,000,000",
      status: "paid",
      dueDate: "2024-01-15",
      issueDate: "2023-12-15",
    },
    {
      id: "INV-002",
      project: "Abuja Power Grid Upgrade",
      client: "Federal Capital Territory",
      amount: "₦18,500,000",
      status: "pending",
      dueDate: "2024-02-10",
      issueDate: "2024-01-10",
    },
    {
      id: "INV-003",
      project: "Port Harcourt Industrial Complex",
      client: "Rivers State Government",
      amount: "₦32,750,000",
      status: "overdue",
      dueDate: "2024-01-20",
      issueDate: "2023-12-20",
    },
  ]);

  const [stats] = useState({
    totalRevenue: "₦156.7M",
    pendingPayments: "₦42.3M",
    paidInvoices: 18,
    overdueAmount: "₦8.2M",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardThemeWrapper
      department="accounts"
      title="Accounting & Finance Dashboard"
      description="Manage invoices, track payments, and monitor financial health"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.totalRevenue}
                  </p>
                </div>
                <div className={`p-3 ${theme.badge.bg} rounded-full`}>
                  <DollarSign className={`h-6 w-6 ${theme.badge.text}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Payments
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.pendingPayments}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Paid Invoices
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.paidInvoices}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Overdue Amount
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.overdueAmount}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoice Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className={`h-5 w-5 ${theme.badge.text}`} />
                Invoice Management
              </CardTitle>
              <CardDescription>
                Track invoices, payments, and outstanding amounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold theme-text-primary">
                          {invoice.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {invoice.project}
                        </p>
                        <p className="text-sm text-gray-500">
                          {invoice.client}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                        <p className="text-lg font-bold theme-text-primary mt-1">
                          {invoice.amount}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Issue Date:</span>{" "}
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>{" "}
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {invoice.status === "pending" && (
                        <Button size="sm" className={theme.button.primary}>
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className={`h-5 w-5 ${theme.badge.text}`} />
                Financial Summary
              </CardTitle>
              <CardDescription>
                Monthly revenue and expense breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <p className="text-2xl font-bold theme-text-primary">
                    ₦45.2M
                  </p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <p className="text-2xl font-bold theme-text-primary">
                    ₦38.7M
                  </p>
                  <p className="text-sm text-gray-600">Last Month</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">+16.8%</p>
                  <p className="text-sm text-gray-600">Growth</p>
                </div>
              </div>
              <div className="mt-6">
                <Button className={`w-full ${theme.button.primary}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Financial Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardThemeWrapper>
  );
}
