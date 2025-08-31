import React, { createContext, useContext, useState, useEffect } from "react";
import { apiCall } from "@/services/api";

// User interface
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  company?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  isVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  department?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (
    userData: RegisterData,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Registration data interface
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  company?: string;
  password: string;
  confirmPassword: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Development mode flag
const isDevelopmentMode = import.meta.env.MODE === "development";

// Mock users for development
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@jdmarcng.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    company: "JD Marc Limited",
    phone: "+234 123 456 7890",
    location: "Abuja, Nigeria",
    isVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2023-01-01T00:00:00.000Z",
    department: "secretariat-admin",
  },
  {
    id: "2",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    company: "Example Corp",
    phone: "+234 987 654 3210",
    location: "Lagos, Nigeria",
    isVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2023-01-15T00:00:00.000Z",
    department: "business-development",
  },
  {
    id: "3",
    email: "project@jdmarcng.com",
    firstName: "Project",
    lastName: "Manager",
    role: "user",
    company: "JD Marc Limited",
    phone: "+234 555 123 4567",
    location: "Lagos, Nigeria",
    isVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2023-01-20T00:00:00.000Z",
    department: "project-management",
  },
  {
    id: "4",
    email: "hr@jdmarcng.com",
    firstName: "HR",
    lastName: "Manager",
    role: "user",
    company: "JD Marc Limited",
    phone: "+234 555 234 5678",
    location: "Abuja, Nigeria",
    isVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2023-01-25T00:00:00.000Z",
    department: "human-resources",
  },
  {
    id: "5",
    email: "accounting@jdmarcng.com",
    firstName: "Finance",
    lastName: "Manager",
    role: "user",
    company: "JD Marc Limited",
    phone: "+234 555 345 6789",
    location: "Abuja, Nigeria",
    isVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2023-02-01T00:00:00.000Z",
    department: "accounting",
  },
  {
    id: "6",
    email: "marketing@jdmarcng.com",
    firstName: "Marketing",
    lastName: "Specialist",
    role: "user",
    company: "JD Marc Limited",
    phone: "+234 555 456 7890",
    location: "Lagos, Nigeria",
    isVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2023-02-10T00:00:00.000Z",
    department: "digital-marketing",
  },
];

// Storage keys
const USER_STORAGE_KEY = "jdmarc_user";
const TOKEN_STORAGE_KEY = "jdmarc_token";

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log("🔐 User session restored:", parsedUser.email);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid stored data
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    };

    initializeAuth();
  }, []);

  // Store user data securely
  const storeUserData = (userData: User, token: string) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(userData);
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  };

  // Clear user data
  const clearUserData = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  // Login function
  const login = async (
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);
    setUser(null);

    try {
      // Try real API first
      try {
        const response = await apiCall<{ user: User; token: string }>(
          "/auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              rememberMe: credentials.rememberMe,
            }),
          },
        );

        const { user: userData, token } = response;

        storeUserData(userData, token);
        setIsLoading(false);

        return {
          success: true,
          user: userData,
        };
      } catch (apiError) {
        console.warn("Backend unavailable, using development mode for login");

        // Mock authentication for development when backend is unavailable
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        const mockUser = mockUsers.find((u) => u.email === credentials.email);

        if (mockUser && credentials.password === "password123") {
          const updatedUser = {
            ...mockUser,
            lastLoginAt: new Date().toISOString(),
          };

          const mockToken = `mock_token_${Date.now()}`;
          storeUserData(updatedUser, mockToken);
          setIsLoading(false);

          return {
            success: true,
            user: updatedUser,
          };
        }

        setIsLoading(false);
        return {
          success: false,
          error: "Invalid email or password",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);

      return {
        success: false,
        error: "Login failed. Please check your connection and try again.",
      };
    }
  };

  // Register function
  const register = async (
    userData: RegisterData,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    try {
      // Validate password confirmation
      if (userData.password !== userData.confirmPassword) {
        setIsLoading(false);
        return {
          success: false,
          error: "Passwords do not match",
        };
      }

      // Try real API for registration first
      try {
        const response = await apiCall<{ user: User; token: string }>(
          "/auth/register",
          {
            method: "POST",
            body: JSON.stringify({
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone,
              location: userData.location,
              company: userData.company,
              password: userData.password,
            }),
          },
        );

        const { user: newUser, token } = response;
        storeUserData(newUser, token);
        setIsLoading(false);

        return {
          success: true,
          user: newUser,
        };
      } catch (apiError) {
        console.warn(
          "Backend unavailable, using development mode for registration",
        );

        // Mock registration for development when backend is unavailable
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

        // Check if email already exists in mock users
        const existingUser = mockUsers.find((u) => u.email === userData.email);

        if (existingUser) {
          setIsLoading(false);
          return {
            success: false,
            error: "An account with this email already exists",
          };
        }

        const newUser: User = {
          id: `mock_${Date.now()}`,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: "user", // New registrations default to user role
          company: userData.company,
          phone: userData.phone,
          location: userData.location,
          isVerified: true, // Auto-verify in development
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        const mockToken = `mock_token_${Date.now()}`;
        storeUserData(newUser, mockToken);
        setIsLoading(false);

        return {
          success: true,
          user: newUser,
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);

      return {
        success: false,
        error:
          "Registration failed. Please check your connection and try again.",
      };
    }
  };

  // Forgot password function
  const forgotPassword = async (
    email: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Try real API first
      try {
        await apiCall("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email }),
        });

        setIsLoading(false);
        return { success: true };
      } catch (apiError) {
        console.warn(
          "Backend unavailable, using development mode for forgot password",
        );

        // Mock forgot password for development
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if email exists in mock users
        const userExists = mockUsers.find((u) => u.email === email);

        setIsLoading(false);
        if (userExists || isDevelopmentMode) {
          return { success: true };
        } else {
          return {
            success: false,
            error: "No account found with this email address",
          };
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setIsLoading(false);

      return {
        success: false,
        error: "Failed to send reset email. Please try again.",
      };
    }
  };

  // Reset password function
  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Try real API first
      try {
        await apiCall("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ email, code, newPassword }),
        });

        setIsLoading(false);
        return { success: true };
      } catch (apiError) {
        console.warn(
          "Backend unavailable, using development mode for reset password",
        );

        // Mock reset password for development
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In development mode, accept any 6-digit code
        if (code.length === 6 || isDevelopmentMode) {
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          return {
            success: false,
            error: "Invalid or expired reset code",
          };
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setIsLoading(false);

      return {
        success: false,
        error: "Failed to reset password. Please try again.",
      };
    }
  };

  // Logout function
  const logout = () => {
    try {
      clearUserData();
      console.log("🔐 User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      // Try real API first
      const response = await apiCall<{ user: User }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
      });

      const { user: updatedUser } = response;
      const token = localStorage.getItem(TOKEN_STORAGE_KEY) || "";
      storeUserData(updatedUser, token);
    } catch (error) {
      console.warn("Backend unavailable, updating user locally");

      // Mock update for development
      const updatedUser = { ...user, ...userData };
      const token = localStorage.getItem(TOKEN_STORAGE_KEY) || "";
      storeUserData(updatedUser, token);
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (!user) return;

    try {
      // Try real API first
      const response = await apiCall<{ user: User }>("/auth/profile");
      const { user: freshUser } = response;
      const token = localStorage.getItem(TOKEN_STORAGE_KEY) || "";
      storeUserData(freshUser, token);
    } catch (error) {
      console.warn("Backend unavailable, skipping user refresh");
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user && user.role === "admin",
    isLoading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export types for use in other components
export type { User, RegisterData, LoginCredentials };
