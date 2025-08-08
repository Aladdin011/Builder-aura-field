import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardThemeWrapperProps {
  children: ReactNode;
  department: string;
  className?: string;
}

const departmentThemes = {
  "business-development":
    "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
  accounting:
    "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
  "business-administration":
    "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
  secretariat:
    "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
  project:
    "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
  hr: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20",
  "digital-marketing":
    "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20",
  accounts:
    "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20",
};

export default function DashboardThemeWrapper({
  children,
  department,
  className,
}: DashboardThemeWrapperProps) {
  const themeClass =
    departmentThemes[department as keyof typeof departmentThemes] ||
    "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20";

  return (
    <div className={cn("min-h-screen", themeClass, className)}>{children}</div>
  );
}
