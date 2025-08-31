import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ChevronDown, User } from "lucide-react";

interface DashboardThemeWrapperProps {
  children: ReactNode;
  department: string;
  className?: string;
  title?: string;
  description?: string;
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
  title,
  description,
}: DashboardThemeWrapperProps) {
  const { user, logout } = useAuth();
  const themeClass =
    departmentThemes[department as keyof typeof departmentThemes] ||
    "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20";

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className={cn("min-h-screen", themeClass, className)}>
      {/* Header with user info and sign out */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            {title && (
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-2 hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">
                        {department.replace('-', ' ')}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
