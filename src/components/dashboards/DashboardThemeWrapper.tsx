import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ModernDashboardLayout from "./ModernDashboardLayout";

interface DashboardThemeWrapperProps {
  children: ReactNode;
  department?: string;
  className?: string;
}

// Normalize various department keys used across the app
const normalizeDepartment = (dept?: string): string => {
  if (!dept) return "default";
  const key = dept.toLowerCase().trim();
  if (key === "project" || key === "project management" || key === "project-management") return "project-management";
  if (key === "secretariat" || key === "secretariat admin" || key === "secretariat-admin") return "secretariat-admin";
  if (key === "account" || key === "accounts" || key === "accounting & finance" || key === "accounting") return "accounting";
  if (key === "hr" || key === "human resources" || key === "human-resources") return "human-resources";
  if (key === "business administration" || key === "business-administration") return "business-administration";
  if (key === "business development" || key === "business-development") return "business-development";
  if (key === "digital marketing" || key === "digital-marketing") return "digital-marketing";
  return "default";
};

// Department-specific theme colors for ModernDashboardLayout
const getModernThemeColors = (dept: string) => {
  switch (dept) {
    case "secretariat-admin":
      return {
        primary: "#1E3A8A",
        secondary: "#F8FAFC",
        accent: "#F59E0B",
        background: "#EEF2FF",
        headerBg: "#0F172A",
      };
    case "business-development":
      return {
        primary: "#065F46",
        secondary: "#F8FAFC",
        accent: "#10B981",
        background: "#F0FDF4",
        headerBg: "#064E3B",
      };
    case "business-administration":
      return {
        primary: "#6D28D9",
        secondary: "#F8FAFC",
        accent: "#F59E0B",
        background: "#F5F3FF",
        headerBg: "#4C1D95",
      };
    case "project-management":
      return {
        primary: "#7C3AED",
        secondary: "#F8FAFC",
        accent: "#EF4444",
        background: "#F5F3FF",
        headerBg: "#4C1D95",
      };
    case "accounting":
      return {
        primary: "#DC2626",
        secondary: "#F8FAFC",
        accent: "#059669",
        background: "#FEF2F2",
        headerBg: "#991B1B",
      };
    case "human-resources":
      return {
        primary: "#7C2D12",
        secondary: "#F8FAFC",
        accent: "#3B82F6",
        background: "#FFFBEB",
        headerBg: "#7C2D12",
      };
    case "digital-marketing":
      return {
        primary: "#DB2777",
        secondary: "#F8FAFC",
        accent: "#F59E0B",
        background: "#FDF2F8",
        headerBg: "#9D174D",
      };
    default:
      return {
        primary: "#0B1014",
        secondary: "#F8FAFC",
        accent: "#EE690B",
        background: "#F1F5F9",
        headerBg: "#111827",
      };
  }
};

const getDepartmentDisplayName = (dept: string): string => {
  switch (dept) {
    case "secretariat-admin":
      return "Secretariat & Administration";
    case "business-development":
      return "Business Development";
    case "business-administration":
      return "Business Administration";
    case "project-management":
      return "Project Management";
    case "accounting":
      return "Accounting & Finance";
    case "human-resources":
      return "Human Resources";
    case "digital-marketing":
      return "Digital Marketing";
    default:
      return "General";
  }
};

export default function DashboardThemeWrapper({
  children,
  department,
  className,
}: DashboardThemeWrapperProps) {
  const { user } = useAuth();
  const resolvedDept = normalizeDepartment(department || user?.department);
  const themeColors = getModernThemeColors(resolvedDept);
  const displayName = getDepartmentDisplayName(resolvedDept);

  return (
    <ModernDashboardLayout
      user={user}
      department={displayName}
      themeColors={themeColors}
    >
      <div className={cn("", className)}>{children}</div>
    </ModernDashboardLayout>
  );
}
