import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building2,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";

type RegistrationStep = 1 | 2;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, isLoading, isAuthenticated } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (
      field === "confirmPassword" ||
      (field === "password" && formData.confirmPassword)
    ) {
      const password = field === "password" ? value : formData.password;
      const confirmPassword =
        field === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordMatch(password === confirmPassword && password.length > 0);
    }
  };

  const validateStep = (step: RegistrationStep): boolean => {
    setError("");

    switch (step) {
      case 1:
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.phone
        ) {
          setError("Please fill in all required fields");
          return false;
        }
        if (!formData.email.includes("@")) {
          setError("Please enter a valid email address");
          return false;
        }
        return true;

      case 2:
        if (
          !formData.location ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setError("Please fill in all required fields");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return false;
        }
        if (!passwordMatch) {
          setError("Passwords do not match");
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2) as RegistrationStep);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as RegistrationStep);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(2)) return;

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        company: formData.company,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        trackBusinessEvent.userAuth("register");
        setSuccess("Account created successfully! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  const stepTitles = {
    1: "Personal Information",
    2: "Account Setup",
  };

  const progress = (currentStep / 2) * 100;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-arch-light-blue/20 via-white to-arch-light-blue/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/95">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-arch-charcoal to-arch-blue-gray text-white py-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <Link
                  to="/"
                  className="inline-block mb-4 hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/images/brand/logo.jpg"
                    alt="JD Marc Limited Logo"
                    className="h-16 w-auto mx-auto object-contain"
                  />
                </Link>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Join JD Marc Limited
                </CardTitle>
                <CardDescription className="text-arch-light-blue">
                  Create your account to access our platform
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-arch-charcoal">
                    Step {currentStep} of 2: {stepTitles[currentStep]}
                  </span>
                  <span className="text-sm text-arch-blue-gray">
                    {Math.round(progress)}% Complete
                  </span>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    {[1, 2].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            step <= currentStep
                              ? "bg-arch-orange text-white shadow-lg"
                              : step === currentStep + 1
                                ? "bg-arch-orange/20 text-arch-orange border-2 border-arch-orange"
                                : "bg-arch-light-blue/30 text-arch-blue-gray"
                          }`}
                        >
                          {step < currentStep ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            step
                          )}
                        </div>
                        {step < 2 && (
                          <div
                            className={`w-12 h-0.5 transition-all duration-300 ${
                              step < currentStep
                                ? "bg-arch-orange"
                                : "bg-arch-light-blue/30"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Progress
                  value={progress}
                  className="h-2 bg-arch-light-blue/30"
                >
                  <div
                    className="h-full bg-gradient-to-r from-arch-orange to-arch-rust transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </Progress>
              </div>

              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-green-700 text-sm">{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div key="step1" {...fadeInUp} className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-arch-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="h-8 w-8 text-arch-orange" />
                        </div>
                        <h3 className="text-xl font-semibold text-arch-charcoal">
                          Personal Details
                        </h3>
                        <p className="text-arch-blue-gray text-sm mt-1">
                          Tell us about yourself
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-arch-charcoal font-medium"
                          >
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            className="h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-arch-charcoal font-medium"
                          >
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            className="h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
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
                            placeholder="Enter your email address"
                            className="pl-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-arch-charcoal font-medium"
                        >
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                          <Input
                            id="phone"
                            placeholder="+234 803 000 0000"
                            className="pl-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="company"
                          className="text-arch-charcoal font-medium"
                        >
                          Company/Organization (Optional)
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                          <Input
                            id="company"
                            placeholder="Enter your company name"
                            className="pl-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Account Setup */}
                  {currentStep === 2 && (
                    <motion.div key="step2" {...fadeInUp} className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-arch-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Lock className="h-8 w-8 text-arch-orange" />
                        </div>
                        <h3 className="text-xl font-semibold text-arch-charcoal">
                          Account Setup
                        </h3>
                        <p className="text-arch-blue-gray text-sm mt-1">
                          Complete your account details
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="location"
                          className="text-arch-charcoal font-medium"
                        >
                          Location *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                          <Input
                            id="location"
                            placeholder="City, Country"
                            className="pl-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                            value={formData.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
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
                              placeholder="Create a strong password"
                              className="pl-11 pr-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
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
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-arch-charcoal font-medium"
                          >
                            Confirm Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className={`pl-11 pr-16 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20 ${
                                passwordMatch === false
                                  ? "border-red-500 focus:border-red-500"
                                  : passwordMatch === true
                                    ? "border-green-500 focus:border-green-500"
                                    : ""
                              }`}
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value,
                                )
                              }
                              required
                            />
                            <div className="absolute right-11 top-3">
                              {passwordMatch === true && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                              {passwordMatch === false && (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-3 text-arch-blue-gray hover:text-arch-orange transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {passwordMatch === false && (
                            <p className="text-red-500 text-xs mt-1">
                              Passwords do not match
                            </p>
                          )}
                          {passwordMatch === true && (
                            <p className="text-green-500 text-xs mt-1">
                              Passwords match
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-arch-light-blue/20 border border-arch-light-blue/40 rounded-lg p-4">
                        <h4 className="font-medium text-arch-charcoal mb-2">
                          Password Requirements:
                        </h4>
                        <ul className="text-sm text-arch-blue-gray space-y-1">
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            At least 8 characters long
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            One uppercase letter
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.password) ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            One number
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 border-arch-light-blue text-arch-charcoal hover:bg-arch-light-blue/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < 2 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-arch-orange hover:bg-arch-rust text-white"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-arch-orange hover:bg-arch-rust text-white min-w-[140px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Create Account
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-8 pt-6 border-t border-arch-light-blue/30">
                <p className="text-arch-blue-gray">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-arch-orange hover:text-arch-rust font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
