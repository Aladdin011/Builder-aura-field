import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Shield,
  Key,
  Building,
  Users,
  Clock,
  UserCheck,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Timer,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";
// Development test accounts and utility functions
const testAccounts = [
  {
    email: "admin@jdmarc.ng",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as const,
    phone: "+234 808 000 0001",
    location: "Lagos, Nigeria",
    department: "Administration",
  },
  {
    email: "user@jdmarc.ng",
    password: "user123",
    firstName: "Test",
    lastName: "User",
    role: "user" as const,
    phone: "+234 808 000 0002",
    location: "Abuja, Nigeria",
    department: "General",
  },
];

const getTestAccountByEmail = (email: string) => {
  return testAccounts.find((account) => account.email === email);
};

const validateUniqueKey = (key: string, department: string) => {
  // Simple validation for development
  return key.startsWith(getDepartmentPrefix(department)) && key.length >= 8;
};

const getDepartmentPrefix = (department: string) => {
  const prefixes: Record<string, string> = {
    Administration: "ADM",
    General: "GEN",
    Engineering: "ENG",
    Finance: "FIN",
    HR: "HRM",
  };
  return prefixes[department] || "GEN";
};

interface Department {
  id: string;
  name: string;
  prefix: string;
  description: string;
}

interface UniqueKeyValidation {
  isValid: boolean;
  isExpired: boolean;
  department?: string;
  expiresAt?: string;
  error?: string;
}

const departments: Department[] = [
  {
    id: "accounting",
    name: "Accounting & Finance",
    prefix: "AC",
    description: "Financial management and reporting",
  },
  {
    id: "hr",
    name: "Human Resources",
    prefix: "HR",
    description: "Personnel and organizational development",
  },
  {
    id: "project-management",
    name: "Project Management",
    prefix: "PM",
    description: "Project oversight and execution",
  },
  {
    id: "business-development",
    name: "Business Development",
    prefix: "BD",
    description: "Strategic growth and partnerships",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    prefix: "DM",
    description: "Marketing and communications",
  },
  {
    id: "secretariat-admin",
    name: "Secretariat & Administration",
    prefix: "SA",
    description: "Administrative support and coordination",
  },
  {
    id: "business-administration",
    name: "Business Administration",
    prefix: "BA",
    description: "Governance and policy management",
  },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isStaffMember, setIsStaffMember] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  const [showUniqueKeyModal, setShowUniqueKeyModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [keyValidationAttempts, setKeyValidationAttempts] = useState(0);

  const { login, isLoading, isAuthenticated } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Reset form when staff member checkbox changes
  useEffect(() => {
    if (!isStaffMember) {
      setSelectedDepartment("");
      setUniqueKey("");
      setShowUniqueKeyModal(false);
      setError("");
    }
  }, [isStaffMember]);

  const validateUniqueKeyLocal = async (
    key: string,
    department: string,
  ): Promise<UniqueKeyValidation> => {
    // Simulate API call to backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const departmentInfo = departments.find((d) => d.id === department);
    const expectedPrefix = departmentInfo?.prefix || "";

    // Basic format validation
    if (!key.startsWith(expectedPrefix)) {
      return {
        isValid: false,
        isExpired: false,
        error: `Key must start with ${expectedPrefix} for ${departmentInfo?.name}`,
      };
    }

    if (key.length !== 6) {
      return {
        isValid: false,
        isExpired: false,
        error: "UniqueKey must be 6 characters (2 letters + 4 digits)",
      };
    }

    // Check against test accounts
    const isValidKey = validateUniqueKey(key, department);

    if (isValidKey) {
      return {
        isValid: true,
        isExpired: false,
        department: departmentInfo?.name,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    // Mock expired key check for demo
    if (key === `${expectedPrefix}9999`) {
      return {
        isValid: false,
        isExpired: true,
        error: "This UniqueKey has expired. Please contact your administrator.",
      };
    }

    // Invalid key
    return {
      isValid: false,
      isExpired: false,
      error: "Invalid UniqueKey. Please check your key and try again.",
    };
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (isStaffMember && !selectedDepartment) {
      setError("Please select your department");
      return;
    }

    if (isStaffMember) {
      // For staff members, show unique key modal
      setShowUniqueKeyModal(true);
    } else {
      // For non-staff, proceed with regular login
      await performLogin();
    }
  };

  const handleUniqueKeySubmit = async () => {
    if (!uniqueKey) {
      setError("Please enter your UniqueKey");
      return;
    }

    setIsValidatingKey(true);
    setError("");

    try {
      const validation = await validateUniqueKeyLocal(
        uniqueKey,
        selectedDepartment,
      );

      if (validation.isValid) {
        setSuccess("UniqueKey verified successfully!");
        setShowUniqueKeyModal(false);
        await performLogin(selectedDepartment);
      } else {
        setKeyValidationAttempts((prev) => prev + 1);

        if (validation.isExpired) {
          setError(validation.error || "UniqueKey has expired");
          // After 3 failed attempts with expired key, redirect to logout
          if (keyValidationAttempts >= 2) {
            setTimeout(() => {
              setShowUniqueKeyModal(false);
              setIsStaffMember(false);
              setSelectedDepartment("");
              setUniqueKey("");
              setError(
                "Too many failed attempts. Please contact your administrator.",
              );
            }, 2000);
          }
        } else {
          setError(validation.error || "Invalid UniqueKey");

          // After 3 failed attempts, close modal and reset
          if (keyValidationAttempts >= 2) {
            setTimeout(() => {
              setShowUniqueKeyModal(false);
              setError("Too many failed attempts. Please try again later.");
            }, 2000);
          }
        }
      }
    } catch (error) {
      setError("Failed to validate UniqueKey. Please try again.");
    } finally {
      setIsValidatingKey(false);
    }
  };

  const performLogin = async (department?: string) => {
    const result = await login(email, password);

    if (result.success) {
      trackBusinessEvent.userAuth("login");

      if (department) {
        // Store department info for role-specific dashboard routing
        localStorage.setItem("userDepartment", department);
        trackBusinessEvent.userAuth("staff_login", { department });
      }

      setSuccess("Login successful! Redirecting to dashboard...");

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } else {
      setError(result.error || "Login failed");
    }
  };

  const resetUniqueKeyModal = () => {
    setShowUniqueKeyModal(false);
    setUniqueKey("");
    setError("");
    setKeyValidationAttempts(0);
  };

  const selectedDeptInfo = departments.find((d) => d.id === selectedDepartment);

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left Side - Enhanced Image with Architectural Background */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-arch-charcoal/95 to-arch-blue-gray/90 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F3ea4e8ddcd314db6b491a8835cfb72ec?format=webp&width=800')",
            }}
          />

          {/* Content Overlay */}
          <div className="relative z-20 flex flex-col justify-center p-12 text-white">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* JD MARC Logo */}
              <div className="mb-8">
                <img
                  src="/images/brand/logo.jpg"
                  alt="JD Marc Limited Logo"
                  className="h-20 w-auto object-contain mx-auto"
                />
              </div>

              <h1 className="text-4xl font-bold mb-4 text-white">
                Welcome Back
              </h1>
              <p className="text-lg text-arch-light-blue mb-6">
                Access your secure dashboard with enhanced staff verification
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-arch-orange" />
                  <span className="font-semibold">Enhanced Security</span>
                </div>
                <p className="text-sm text-arch-light-blue">
                  Staff members require department verification with a 7-day
                  UniqueKey for secure access.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Enhanced Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-arch-light-blue/20 via-white to-arch-light-blue/30"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 pb-8 bg-gradient-to-r from-arch-charcoal to-arch-blue-gray text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-center">
                Secure Access
              </CardTitle>
              <CardDescription className="text-center text-arch-light-blue">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleInitialSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-green-700 text-sm">{success}</span>
                  </motion.div>
                )}

                {/* Staff Member Checkbox */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-arch-light-blue/20 border border-arch-light-blue/40 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="staff-member"
                      checked={isStaffMember}
                      onCheckedChange={(checked) =>
                        setIsStaffMember(checked as boolean)
                      }
                      className="border-arch-orange data-[state=checked]:bg-arch-orange data-[state=checked]:border-arch-orange"
                    />
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-arch-orange" />
                      <Label
                        htmlFor="staff-member"
                        className="text-arch-charcoal font-medium cursor-pointer"
                      >
                        Are you a staff member?
                      </Label>
                    </div>
                  </div>
                  {isStaffMember && (
                    <p className="text-xs text-arch-blue-gray mt-2 ml-8">
                      Staff members require department verification and a
                      UniqueKey
                    </p>
                  )}
                </motion.div>

                {/* Department Selection */}
                <AnimatePresence>
                  {isStaffMember && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="department"
                        className="text-arch-charcoal font-medium"
                      >
                        Select Your Department *
                      </Label>
                      <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                      >
                        <SelectTrigger className="h-12 border-arch-light-blue/50 focus:border-arch-orange">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-arch-blue-gray" />
                            <SelectValue placeholder="Choose your department" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-6 bg-arch-orange/20 rounded text-xs font-mono flex items-center justify-center text-arch-orange">
                                  {dept.prefix}
                                </div>
                                <div>
                                  <div className="font-medium">{dept.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {dept.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="email"
                    className="text-arch-charcoal font-medium"
                  >
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@jdmarcng.com"
                      className="pl-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="password"
                    className="text-arch-charcoal font-medium"
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-11 pr-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-arch-blue-gray hover:text-arch-orange transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Remember Me and Forgot Password */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      className="border-arch-light-blue data-[state=checked]:bg-arch-orange data-[state=checked]:border-arch-orange"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-arch-charcoal"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-arch-orange hover:text-arch-rust transition-colors"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-arch-orange hover:bg-arch-rust text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {isStaffMember
                            ? "Proceed to Verification"
                            : "Sign In"}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Registration Link */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-center pt-4 border-t border-arch-light-blue/30"
                >
                  <p className="text-arch-charcoal">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-arch-orange hover:text-arch-rust font-medium transition-colors"
                    >
                      Create one here
                    </Link>
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* UniqueKey Verification Modal */}
      <Dialog open={showUniqueKeyModal} onOpenChange={resetUniqueKeyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-arch-charcoal">
              <ShieldCheck className="h-5 w-5 text-arch-orange" />
              Staff Verification Required
            </DialogTitle>
            <DialogDescription className="text-arch-blue-gray">
              Please enter your department UniqueKey to complete secure access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedDeptInfo && (
              <div className="bg-arch-light-blue/20 border border-arch-light-blue/40 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-8 bg-arch-orange/20 rounded text-sm font-mono flex items-center justify-center text-arch-orange">
                    {selectedDeptInfo.prefix}
                  </div>
                  <div>
                    <h4 className="font-medium text-arch-charcoal">
                      {selectedDeptInfo.name}
                    </h4>
                    <p className="text-xs text-arch-blue-gray">
                      {selectedDeptInfo.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-arch-blue-gray">
                  <Timer className="h-3 w-3" />
                  <span>UniqueKeys expire after 7 days</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="unique-key"
                className="text-arch-charcoal font-medium"
              >
                UniqueKey *
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                <Input
                  id="unique-key"
                  placeholder={`${selectedDeptInfo?.prefix || "XX"}1234`}
                  className="pl-11 h-12 text-center font-mono text-lg tracking-widest border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                  value={uniqueKey}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 6);
                    setUniqueKey(value);
                  }}
                  maxLength={6}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUniqueKeySubmit();
                    }
                  }}
                />
              </div>
              <p className="text-xs text-arch-blue-gray">
                Format: {selectedDeptInfo?.prefix}#### (2 letters + 4 digits)
              </p>
            </div>

            {keyValidationAttempts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Attempt {keyValidationAttempts}/3 -{" "}
                    {3 - keyValidationAttempts} attempts remaining
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetUniqueKeyModal}
                className="flex-1 border-arch-light-blue text-arch-charcoal hover:bg-arch-light-blue/20"
                disabled={isValidatingKey}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUniqueKeySubmit}
                disabled={
                  !uniqueKey || uniqueKey.length !== 6 || isValidatingKey
                }
                className="flex-1 bg-arch-orange hover:bg-arch-rust text-white"
              >
                {isValidatingKey ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify & Login</span>
                  </div>
                )}
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2 text-blue-700">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium mb-1">Need a UniqueKey?</p>
                  <p>
                    Contact your department administrator or IT support to
                    generate a new 7-day access key.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
