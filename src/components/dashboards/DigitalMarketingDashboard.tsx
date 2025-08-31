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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Megaphone,
  BarChart3,
  Eye,
  MousePointer,
  Share2,
  Calendar,
  PlusCircle,
  Edit,
  TrendingUp,
  Users,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Camera,
  FileText,
  Target,
  DollarSign,
  Zap,
  Bot,
  Video,
  Image,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Filter,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Palette,
  ChevronDown,
  Activity,
  Sparkles,
  Briefcase,
  BookOpen,
  Send,
  Bell,
  Search,
  RefreshCw,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";
import { useCall } from "@/contexts/CallContext";

// Enhanced interfaces
interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: "draft" | "active" | "paused" | "completed";
  budget: string;
  spend: string;
  roi: string;
  reach: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: string;
  conversions: number;
  bounceRate: number;
  startDate: string;
  endDate: string;
}

interface SocialPost {
  id: string;
  content: string;
  platform: string[];
  scheduledDate: string;
  status: "draft" | "scheduled" | "published";
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ContentAsset {
  id: string;
  name: string;
  type: "image" | "video" | "gif" | "document";
  url: string;
  size: string;
  uploadDate: string;
  tags: string[];
}

interface BlogPost {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  status: "draft" | "published";
  views: number;
  shares: number;
  timeOnPage: string;
  bounceRate: number;
}

interface MarketingAutomation {
  id: string;
  name: string;
  platform: string;
  status: "active" | "paused" | "error";
  lastRun: string;
  nextRun: string;
  performance: number;
}

export default function DigitalMarketingDashboard() {
  const theme = getDepartmentTheme("digital-marketing");
  const { startCall, callState } = useCall();
  const [selectedThemeColor, setSelectedThemeColor] = useState("pink");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  // Real-time data simulation
  const [realTimeData, setRealTimeData] = useState({
    ctr: 2.8,
    cpc: 1.25,
    bounceRate: 35.2,
    activeVisitors: 127,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        ctr: Math.round((2.5 + Math.random() * 0.8) * 10) / 10,
        cpc: Math.round((1.0 + Math.random() * 0.5) * 100) / 100,
        bounceRate: Math.round((30 + Math.random() * 10) * 10) / 10,
        activeVisitors: Math.floor(100 + Math.random() * 50),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sample data
  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "JD Marc Infrastructure Solutions",
      platform: "LinkedIn",
      status: "active",
      budget: "₦500,000",
      spend: "₦347,250",
      roi: "285%",
      reach: 45000,
      impressions: 125000,
      clicks: 3500,
      ctr: 2.8,
      cpc: "₦99",
      conversions: 142,
      bounceRate: 28.5,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
    },
    {
      id: "2",
      name: "Smart City Projects Showcase",
      platform: "Facebook",
      status: "active",
      budget: "₦750,000",
      spend: "₦623,100",
      roi: "320%",
      reach: 67000,
      impressions: 185000,
      clicks: 4200,
      ctr: 2.3,
      cpc: "₦148",
      conversions: 89,
      bounceRate: 32.1,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
    },
    {
      id: "3",
      name: "Solar Energy Solutions",
      platform: "Google Ads",
      status: "paused",
      budget: "₦300,000",
      spend: "₦275,850",
      roi: "165%",
      reach: 28000,
      impressions: 95000,
      clicks: 2100,
      ctr: 2.2,
      cpc: "₦131",
      conversions: 45,
      bounceRate: 41.2,
      startDate: "2024-02-01",
      endDate: "2024-03-01",
    },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "The Future of Infrastructure in Nigeria",
      author: "Dr. Adebayo Ogundimu",
      publishDate: "2024-01-15",
      status: "published",
      views: 2847,
      shares: 156,
      timeOnPage: "3:42",
      bounceRate: 24.8,
    },
    {
      id: "2",
      title: "Sustainable Construction Methods",
      author: "Eng. Fatima Aliyu",
      publishDate: "2024-01-18",
      status: "published",
      views: 1923,
      shares: 89,
      timeOnPage: "4:15",
      bounceRate: 31.2,
    },
  ];

  const automationTools: MarketingAutomation[] = [
    {
      id: "1",
      name: "Email Campaign - Weekly Newsletter",
      platform: "Mailchimp",
      status: "active",
      lastRun: "2024-01-20 09:00",
      nextRun: "2024-01-27 09:00",
      performance: 85,
    },
    {
      id: "2",
      name: "Lead Nurturing Sequence",
      platform: "HubSpot CRM",
      status: "active",
      lastRun: "2024-01-20 14:30",
      nextRun: "2024-01-21 14:30",
      performance: 92,
    },
    {
      id: "3",
      name: "Social Media Scheduler",
      platform: "Buffer",
      status: "error",
      lastRun: "2024-01-19 18:00",
      nextRun: "Pending Fix",
      performance: 0,
    },
  ];

  const aiSuggestions = [
    {
      type: "timing",
      message: "Best posting time for LinkedIn: 9-11 AM on Tuesdays",
      confidence: 94,
    },
    {
      type: "content",
      message: "Infrastructure content performs 65% better on weekdays",
      confidence: 87,
    },
    {
      type: "budget",
      message: "Increase LinkedIn ad spend by 20% for optimal ROI",
      confidence: 91,
    },
  ];

  const leadFunnelData = [
    { stage: "Awareness", count: 5420, conversion: 100 },
    { stage: "Interest", count: 2850, conversion: 52.6 },
    { stage: "Consideration", count: 1680, conversion: 31.0 },
    { stage: "Intent", count: 890, conversion: 16.4 },
    { stage: "Purchase", count: 245, conversion: 4.5 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "google ads":
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const themeColors = [
    { name: "pink", class: "from-pink-600 via-rose-600 to-orange-600" },
    { name: "blue", class: "from-blue-600 via-indigo-600 to-purple-600" },
    { name: "green", class: "from-green-600 via-emerald-600 to-teal-600" },
    { name: "orange", class: "from-orange-600 via-red-600 to-pink-600" },
  ];

  return (
    <DashboardThemeWrapper
      department="digital-marketing"
      title="Digital Marketing Command Center"
      description="Comprehensive multi-channel marketing analytics, automation, and campaign management for JD Marc Limited."
    >
      <div className="space-y-6">
        {/* Top Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Palette className={`h-5 w-5 ${theme.badge.text}`} />
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Theme:
              </span>
              <Select
                value={selectedThemeColor}
                onValueChange={setSelectedThemeColor}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themeColors.map((color) => (
                    <SelectItem key={color.name} value={color.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${color.class}`}
                        />
                        <span className="capitalize">{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1D</SelectItem>
                  <SelectItem value="7d">7D</SelectItem>
                  <SelectItem value="30d">30D</SelectItem>
                  <SelectItem value="90d">90D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => startCall("digital-marketing")}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
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

        {/* Real-time KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Live CTR
                  </p>
                  <motion.p
                    key={realTimeData.ctr}
                    initial={{ scale: 1.2, color: "#10b981" }}
                    animate={{ scale: 1, color: "#374151" }}
                    className="text-3xl font-bold"
                  >
                    {realTimeData.ctr}%
                  </motion.p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <MousePointer className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  +0.3% vs yesterday
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Live CPC
                  </p>
                  <motion.p
                    key={realTimeData.cpc}
                    initial={{ scale: 1.2, color: "#10b981" }}
                    animate={{ scale: 1, color: "#374151" }}
                    className="text-3xl font-bold"
                  >
                    ₦{realTimeData.cpc}
                  </motion.p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  -₦0.15 vs yesterday
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Bounce Rate
                  </p>
                  <motion.p
                    key={realTimeData.bounceRate}
                    initial={{ scale: 1.2, color: "#ef4444" }}
                    animate={{ scale: 1, color: "#374151" }}
                    className="text-3xl font-bold"
                  >
                    {realTimeData.bounceRate}%
                  </motion.p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                <span className="text-sm text-red-600">+2.1% vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Active Visitors
                  </p>
                  <motion.p
                    key={realTimeData.activeVisitors}
                    initial={{ scale: 1.2, color: "#8b5cf6" }}
                    animate={{ scale: 1, color: "#374151" }}
                    className="text-3xl font-bold"
                  >
                    {realTimeData.activeVisitors}
                  </motion.p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="text-sm text-gray-600">Live count</span>
              </div>
            </CardContent>
          </Card>
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
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Campaign Performance Cards */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Megaphone className={`h-5 w-5 ${theme.badge.text}`} />
                        Active Campaigns Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {campaigns
                          .filter((c) => c.status === "active")
                          .map((campaign, index) => (
                            <motion.div
                              key={campaign.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getPlatformIcon(campaign.platform)}
                                  <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                      {campaign.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {campaign.platform}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={getStatusColor(campaign.status)}
                                >
                                  {campaign.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    Spend
                                  </p>
                                  <p className="font-semibold">
                                    {campaign.spend}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    ROI
                                  </p>
                                  <p className="font-semibold text-green-600">
                                    {campaign.roi}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    Reach
                                  </p>
                                  <p className="font-semibold">
                                    {campaign.reach.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    Conversions
                                  </p>
                                  <p className="font-semibold">
                                    {campaign.conversions}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2">
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
                </motion.div>

                {/* Lead Generation Funnel */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className={`h-5 w-5 ${theme.badge.text}`} />
                        Lead Generation Funnel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leadFunnelData.map((stage, index) => (
                          <div key={stage.stage} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-700 dark:text-slate-200">
                                {stage.stage}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {stage.count.toLocaleString()}
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                  {stage.conversion}%
                                </span>
                              </div>
                            </div>
                            <Progress
                              value={stage.conversion}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* AI Assistant Quick Insights */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className={`h-5 w-5 ${theme.badge.text}`} />
                        AI Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiSuggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-500"
                          >
                            <div className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                                  {suggestion.message}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Confidence:
                                  </span>
                                  <span className="text-xs font-medium text-blue-600">
                                    {suggestion.confidence}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Blog Performance Monitor */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className={`h-5 w-5 ${theme.badge.text}`} />
                        Blog Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {blogPosts.map((post, index) => (
                          <div
                            key={post.id}
                            className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                          >
                            <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-2">
                              {post.title}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Views:
                                </span>
                                <span className="font-medium ml-1">
                                  {post.views.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Shares:
                                </span>
                                <span className="font-medium ml-1">
                                  {post.shares}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Time:
                                </span>
                                <span className="font-medium ml-1">
                                  {post.timeOnPage}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Bounce:
                                </span>
                                <span className="font-medium ml-1">
                                  {post.bounceRate}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Marketing Automation Status */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className={`h-5 w-5 ${theme.badge.text}`} />
                        Automation Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {automationTools.map((tool, index) => (
                          <div
                            key={tool.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-800"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  tool.status === "active"
                                    ? "bg-green-500"
                                    : tool.status === "error"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                }`}
                              />
                              <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                  {tool.platform}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {tool.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium">
                                {tool.performance}%
                              </p>
                              <p className="text-xs text-gray-500">
                                {tool.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Campaign Management
              </h3>
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {campaigns.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getPlatformIcon(campaign.platform)}
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                              {campaign.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {campaign.platform} • {campaign.startDate} -{" "}
                              {campaign.endDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Budget
                          </p>
                          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {campaign.budget}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Spend
                          </p>
                          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {campaign.spend}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            ROI
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {campaign.roi}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Reach
                          </p>
                          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {campaign.reach.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            CTR
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {campaign.ctr}%
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Conversions
                          </p>
                          <p className="text-lg font-bold text-purple-600">
                            {campaign.conversions}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Social Scheduler */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className={`h-5 w-5 ${theme.badge.text}`} />
                    Social Media Scheduler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="What's happening at JD Marc today?"
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-pink-500 to-rose-500"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Tracker */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className={`h-5 w-5 ${theme.badge.text}`} />
                    Engagement Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Facebook", "LinkedIn", "Instagram", "Twitter"].map(
                      (platform, index) => (
                        <div
                          key={platform}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getPlatformIcon(platform)}
                            <span className="font-medium">{platform}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold">
                                {Math.floor(Math.random() * 500 + 100)}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Likes
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">
                                {Math.floor(Math.random() * 100 + 20)}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Shares
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">
                                {Math.floor(Math.random() * 50 + 10)}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Comments
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Visual Content Manager
              </h3>
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Content
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative aspect-square bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {index % 3 === 0 ? (
                      <Image className="h-12 w-12 text-gray-400 dark:text-slate-500" />
                    ) : index % 3 === 1 ? (
                      <Video className="h-12 w-12 text-gray-400 dark:text-slate-500" />
                    ) : (
                      <FileText className="h-12 w-12 text-gray-400 dark:text-slate-500" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-medium">
                      {index % 3 === 0
                        ? "project-image"
                        : index % 3 === 1
                          ? "company-video"
                          : "infographic"}
                      -{index + 1}.
                      {index % 3 === 0
                        ? "jpg"
                        : index % 3 === 1
                          ? "mp4"
                          : "pdf"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {automationTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {tool.status === "active" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : tool.status === "error" ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                          {tool.platform}
                        </CardTitle>
                        <Switch checked={tool.status === "active"} />
                      </div>
                      <CardDescription>{tool.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Performance
                          </span>
                          <span className="font-medium">
                            {tool.performance}%
                          </span>
                        </div>
                        <Progress value={tool.performance} className="h-2" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Last Run
                            </p>
                            <p className="font-medium">{tool.lastRun}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Next Run
                            </p>
                            <p className="font-medium">{tool.nextRun}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Reports
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className={`h-5 w-5 ${theme.badge.text}`} />
                  AI Marketing Assistant
                </CardTitle>
                <CardDescription>
                  Get intelligent recommendations for campaign optimization and
                  timing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* AI Suggestions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                      Smart Recommendations
                    </h4>
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500 rounded-full">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-800 dark:text-slate-200 font-medium">
                              {suggestion.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Progress
                                value={suggestion.confidence}
                                className="h-2 flex-1"
                              />
                              <span className="text-sm font-medium text-blue-600">
                                {suggestion.confidence}% confidence
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Best Campaign Times */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                      Optimal Campaign Times
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          platform: "LinkedIn",
                          bestTime: "Tue-Thu, 9-11 AM",
                          performance: 94,
                        },
                        {
                          platform: "Facebook",
                          bestTime: "Wed-Fri, 1-3 PM",
                          performance: 87,
                        },
                        {
                          platform: "Instagram",
                          bestTime: "Mon-Wed, 11 AM-1 PM",
                          performance: 91,
                        },
                      ].map((platform, index) => (
                        <div
                          key={platform.platform}
                          className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getPlatformIcon(platform.platform)}
                            <span className="font-medium">
                              {platform.platform}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {platform.bestTime}
                          </p>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={platform.performance}
                              className="h-2 flex-1"
                            />
                            <span className="text-xs font-medium">
                              {platform.performance}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Chat Interface */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                      Ask AI Assistant
                    </h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask about campaign optimization, best practices, or analytics..."
                        className="flex-1"
                      />
                      <Button className="bg-gradient-to-r from-pink-500 to-rose-500">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Team Communication Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme.badge.text}`} />
                Marketing Team Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with your marketing team instantly
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startCall("digital-marketing")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => startCall("digital-marketing")}
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
