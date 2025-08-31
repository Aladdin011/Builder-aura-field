import { useState } from "react";
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
import {
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";

type ResetStep = "email" | "code" | "password" | "success";

interface ResetData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState<ResetStep>("email");
  const [resetData, setResetData] = useState<ResetData>({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof ResetData, value: string) => {
    setResetData((prev) => ({ ...prev, [field]: value }));

    if (
      field === "confirmPassword" ||
      (field === "newPassword" && resetData.confirmPassword)
    ) {
      const password = field === "newPassword" ? value : resetData.newPassword;
      const confirmPassword =
        field === "confirmPassword" ? value : resetData.confirmPassword;
      setPasswordMatch(password === confirmPassword && password.length > 0);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!resetData.email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(resetData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(resetData.email);
      
      if (result.success) {
        setSuccess("Password reset code sent to your email");
        setCurrentStep("code");
        trackBusinessEvent.userAuth("forgot-password-sent");
      } else {
        setError(result.error || "Failed to send reset email");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetData.code) {
      setError("Please enter the verification code");
      return;
    }

    if (resetData.code.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit code
      if (resetData.code.length === 6) {
        setSuccess("Code verified successfully");
        setCurrentStep("password");
        trackBusinessEvent.userAuth("reset-code-verified");
      } else {
        setError("Invalid verification code");
      }
    } catch (error) {
      setError("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetData.newPassword || !resetData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (resetData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!passwordMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(
        resetData.email,
        resetData.code,
        resetData.newPassword
      );

      if (result.success) {
        setCurrentStep("success");
        trackBusinessEvent.userAuth("password-reset-completed");
      } else {
        setError(result.error || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          className="w-full max-w-md"
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
                    onError={(e) => {
                      e.currentTarget.src = "https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6982878bae124d2589b95f89b1a5cf5b?format=webp&width=200";
                    }}
                  />
                </Link>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-arch-light-blue">
                  {currentStep === "email" && "Enter your email to reset your password"}
                  {currentStep === "code" && "Enter the verification code"}
                  {currentStep === "password" && "Create a new password"}
                  {currentStep === "success" && "Password reset successful"}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="p-8">
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

              <AnimatePresence mode="wait">
                {/* Step 1: Email Input */}
                {currentStep === "email" && (
                  <motion.form
                    key="email-step"
                    {...fadeInUp}
                    onSubmit={handleSendResetEmail}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-arch-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Mail className="h-8 w-8 text-arch-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-arch-charcoal">
                        Forgot Password?
                      </h3>
                      <p className="text-arch-blue-gray text-sm mt-1">
                        Enter your email and we'll send you a reset code
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-arch-charcoal font-medium"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="pl-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                          value={resetData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-arch-orange hover:bg-arch-rust text-white font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Sending Reset Code...
                        </>
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                  </motion.form>
                )}

                {/* Step 2: Verification Code */}
                {currentStep === "code" && (
                  <motion.form
                    key="code-step"
                    {...fadeInUp}
                    onSubmit={handleVerifyCode}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-arch-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <KeyRound className="h-8 w-8 text-arch-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-arch-charcoal">
                        Enter Verification Code
                      </h3>
                      <p className="text-arch-blue-gray text-sm mt-1">
                        We've sent a 6-digit code to <strong>{resetData.email}</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="code"
                        className="text-arch-charcoal font-medium"
                      >
                        Verification Code
                      </Label>
                      <Input
                        id="code"
                        placeholder="Enter 6-digit code"
                        className="h-12 text-center text-2xl tracking-widest border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                        value={resetData.code}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                          handleInputChange("code", value);
                        }}
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-arch-orange hover:bg-arch-rust text-white font-medium"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Verifying Code...
                          </>
                        ) : (
                          "Verify Code"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep("email")}
                        className="w-full border-arch-light-blue text-arch-charcoal hover:bg-arch-light-blue/20"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Email
                      </Button>
                    </div>
                  </motion.form>
                )}

                {/* Step 3: New Password */}
                {currentStep === "password" && (
                  <motion.form
                    key="password-step"
                    {...fadeInUp}
                    onSubmit={handleResetPassword}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-arch-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="h-8 w-8 text-arch-orange" />
                      </div>
                      <h3 className="text-xl font-semibold text-arch-charcoal">
                        Create New Password
                      </h3>
                      <p className="text-arch-blue-gray text-sm mt-1">
                        Choose a strong password for your account
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="newPassword"
                          className="text-arch-charcoal font-medium"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                          <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="pl-11 pr-11 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20"
                            value={resetData.newPassword}
                            onChange={(e) =>
                              handleInputChange("newPassword", e.target.value)
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
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-arch-blue-gray" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            className={`pl-11 pr-16 h-12 border-arch-light-blue/50 focus:border-arch-orange focus:ring-arch-orange/20 ${
                              passwordMatch === false
                                ? "border-red-500 focus:border-red-500"
                                : passwordMatch === true
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                            }`}
                            value={resetData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange("confirmPassword", e.target.value)
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      </div>
                    </div>

                    <div className="bg-arch-light-blue/20 border border-arch-light-blue/40 rounded-lg p-4">
                      <h4 className="font-medium text-arch-charcoal mb-2">
                        Password Requirements:
                      </h4>
                      <ul className="text-sm text-arch-blue-gray space-y-1">
                        <li className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              resetData.newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          At least 8 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              /[A-Z]/.test(resetData.newPassword) ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          One uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              /[0-9]/.test(resetData.newPassword) ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          One number
                        </li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-arch-orange hover:bg-arch-rust text-white font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Resetting Password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </motion.form>
                )}

                {/* Step 4: Success */}
                {currentStep === "success" && (
                  <motion.div
                    key="success-step"
                    {...fadeInUp}
                    className="text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-arch-charcoal mb-2">
                        Password Reset Successful!
                      </h3>
                      <p className="text-arch-blue-gray">
                        Your password has been successfully reset. You can now log in with your new password.
                      </p>
                    </div>

                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full h-12 bg-arch-orange hover:bg-arch-rust text-white font-medium"
                    >
                      Continue to Login
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Back to Login Link */}
              {currentStep !== "success" && (
                <div className="text-center mt-8 pt-6 border-t border-arch-light-blue/30">
                  <p className="text-arch-blue-gray">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-arch-orange hover:text-arch-rust font-medium transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
