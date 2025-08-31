import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCall } from "@/contexts/CallContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  Video,
  Plus,
  MoreHorizontal,
  Download,
  Bell,
  Search,
  Filter,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  UserPlus,
  FileText,
  BarChart3,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface DashboardProps {
  user: any;
  department: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    headerBg: string;
  };
  children?: React.ReactNode;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "On-Site" | "Remote" | "Hybrid";
  avatar?: string;
}

interface InterviewItem {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  time: string;
  date: string;
}

interface EmploymentStats {
  totalEmployees: number;
  permanentEmployees: number;
  contractEmployees: number;
  temporaryEmployees: number;
  freelancers: number;
  interns: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
}) => (
  <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && (
              <span
                className={`text-sm font-medium flex items-center gap-1 ${
                  changeType === "positive"
                    ? "text-green-600"
                    : changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : changeType === "negative" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function ModernDashboardLayout({
  user,
  department,
  themeColors,
  children,
}: DashboardProps) {
  const { isInCall, startCall } = useCall();
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [jobs] = useState<JobItem[]>([
    {
      id: "1",
      title: "Senior Product Designer",
      company: "JD Marc",
      location: "On-Site",
      type: "On-Site",
    },
    {
      id: "2",
      title: "Node.js Developer",
      company: "JD Marc",
      location: "On-Site",
      type: "On-Site",
    },
    {
      id: "3",
      title: "React.js Developer",
      company: "JD Marc",
      location: "On-Site",
      type: "On-Site",
    },
    {
      id: "4",
      title: "WordPress Developer",
      company: "JD Marc",
      location: "On-Site",
      type: "On-Site",
    },
  ]);

  const [interviews] = useState<InterviewItem[]>([
    {
      id: "1",
      name: "Emery Donin",
      role: "ReactJS Developer",
      time: "10:00 AM",
      date: "Mar 12, 2023",
    },
    {
      id: "2",
      name: "Charlie Korsgaard",
      role: "MongoDB Architect",
      time: "10:00 AM",
      date: "Mar 12, 2023",
    },
    {
      id: "3",
      name: "Ryan Vaccaro",
      role: "NodeJs Developer",
      time: "10:00 AM",
      date: "Mar 12, 2023",
    },
  ]);

  const [employmentStats] = useState<EmploymentStats>({
    totalEmployees: 3109,
    permanentEmployees: 3109,
    contractEmployees: 3109,
    temporaryEmployees: 3109,
    freelancers: 3109,
    interns: 3109,
  });

  const [averageKPI] = useState({
    percentage: 89.06,
    description: "100%",
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleStartCall = () => {
    startCall("department-meeting", {
      title: `${department} Department Meeting`,
      participants: [],
    });
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${themeColors.background} 0%, ${themeColors.secondary} 100%)` 
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ 
          backgroundColor: `${themeColors.headerBg}CC`,
          borderColor: `${themeColors.primary}20`
        }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TalentaSync</h1>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span>Dashboard</span>
                  <span>Employees</span>
                  <span>Jobs</span>
                  <span>Candidates</span>
                  <span>Leaves</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatDate(currentTime)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white text-gray-800">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white text-left">
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-white/70">{department}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white/70" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {getGreeting()},
              </h2>
              <h3 className="text-3xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleStartCall}
                disabled={isInCall}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Video className="h-4 w-4 mr-2" />
                {isInCall ? "In Call" : "Start Meeting"}
              </Button>
              <Button variant="outline" className="text-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Add new widget
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        >
          <MetricCard
            title="Total Employees"
            value="310"
            change="+12.0%"
            changeType="positive"
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Applicants"
            value="1,244"
            change="+8.0%"
            changeType="positive"
            icon={<UserPlus className="h-5 w-5" />}
          />
          <MetricCard
            title="New Employees"
            value="1,298K"
            change="+12%"
            changeType="positive"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <MetricCard
            title="Resigned Employees"
            value="1,298K"
            change="+12%"
            changeType="negative"
            icon={<TrendingDown className="h-5 w-5" />}
          />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Active Jobs</CardTitle>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {jobs.length} <span className="text-sm font-normal text-muted-foreground">Jobs</span>
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View All</DropdownMenuItem>
                      <DropdownMenuItem>Add New Job</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {job.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.type}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{job.location}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {interviews.length} <span className="text-sm font-normal text-muted-foreground">Interviews</span>
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View All</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                      <DropdownMenuItem>Calendar View</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interviews.map((interview) => (
                      <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-100 text-green-600">
                              {interview.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{interview.name}</h4>
                            <p className="text-sm text-muted-foreground">{interview.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{interview.date}</p>
                          <p className="text-xs text-muted-foreground">{interview.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Average Team KPI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Average Team KPI</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Export Report</DropdownMenuItem>
                      <DropdownMenuItem>Set Goals</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl font-bold">{averageKPI.percentage}%</span>
                        <span className="text-sm text-muted-foreground">{averageKPI.description}</span>
                      </div>
                      <Progress value={averageKPI.percentage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Employment Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Employment Status</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                      <p className="text-2xl font-bold">{employmentStats.totalEmployees}</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Permanent Employees", value: employmentStats.permanentEmployees, color: "bg-blue-500" },
                        { label: "Contract Employees", value: employmentStats.contractEmployees, color: "bg-green-500" },
                        { label: "Temporary Employees", value: employmentStats.temporaryEmployees, color: "bg-yellow-500" },
                        { label: "Freelancers", value: employmentStats.freelancers, color: "bg-purple-500" },
                        { label: "Interns", value: employmentStats.interns, color: "bg-pink-500" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Attendance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Attendance Overview</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Calendar</DropdownMenuItem>
                      <DropdownMenuItem>Generate Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Attendance chart placeholder - would be replaced with actual chart */}
                    <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-12 w-12 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Monthly Attendance Rate</p>
                      <p className="text-xl font-bold text-green-600">94.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Custom Children Content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}
