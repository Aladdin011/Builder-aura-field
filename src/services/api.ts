import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5003/api'  // Development mode - local backend
  : 'https://jdmarc-backend-api.onrender.com/api'; // Production mode - deployed backend
// Use https for production backend to avoid mixed content issues
const TOKEN_STORAGE_KEY =
  import.meta.env.VITE_TOKEN_STORAGE_KEY || "jdmarc_auth_token";
const REFRESH_TOKEN_STORAGE_KEY =
  import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || "jdmarc_refresh_token";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              refreshToken,
            },
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          setTokens(accessToken, newRefreshToken);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
  code?: string;
}

// Generic API request function
const apiRequest = async <T>(
  method: string,
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    if (response.data.success) {
      return response.data.data as T;
    } else {
      throw new Error(response.data.error || "API request failed");
    }
  } catch (error: any) {
    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      throw new Error(
        "Network connection failed. Please check your internet connection.",
      );
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // Handle API errors
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
    role?: string;
  }) => {
    return apiRequest("POST", "/auth/register", userData);
  },

  login: async (credentials: {
    email: string;
    password: string;
    deviceInfo?: string;
    rememberMe?: boolean;
  }) => {
    const response = await apiRequest<{
      user: any;
      tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
      };
    }>("POST", "/auth/login", credentials);

    // Store tokens
    setTokens(response.tokens.accessToken, response.tokens.refreshToken);

    return response;
  },

  logout: async () => {
    try {
      await apiRequest("POST", "/auth/logout");
    } finally {
      clearTokens();
    }
  },

  verifyOTP: async (otpData: {
    email: string;
    otp: string;
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "LOGIN_VERIFICATION";
  }) => {
    return apiRequest("POST", "/auth/verify-otp", otpData);
  },

  forgotPassword: async (email: string) => {
    return apiRequest("POST", "/auth/forgot-password", { email });
  },

  resetPassword: async (resetData: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    return apiRequest("POST", "/auth/reset-password", resetData);
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiRequest("POST", "/auth/change-password", passwordData);
  },

  getCurrentUser: async () => {
    return apiRequest("GET", "/auth/me");
  },

  resendVerification: async (email: string) => {
    return apiRequest("POST", "/auth/resend-verification", { email });
  },
};

// Contact Form API
export const contactAPI = {
  submit: async (formData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
    location?: string;
    source?: string;
  }) => {
    return apiRequest("POST", "/contact/submit", formData);
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    projectType?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return apiRequest("GET", "/contact", null, { params });
  },

  getById: async (id: string) => {
    return apiRequest("GET", `/contact/${id}`);
  },

  update: async (
    id: string,
    updateData: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      notes?: string;
      followUpDate?: string;
    },
  ) => {
    return apiRequest("PATCH", `/contact/${id}`, updateData);
  },

  getStats: async () => {
    return apiRequest("GET", "/contact/stats/overview");
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/contact/${id}`);
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return apiRequest("GET", "/projects", null, { params });
  },

  getById: async (id: string) => {
    return apiRequest("GET", `/projects/${id}`);
  },

  create: async (projectData: {
    title: string;
    description: string;
    category: string;
    location: string;
    budget?: number;
    startDate?: string;
    estimatedEndDate?: string;
    features?: string[];
    tags?: string[];
  }) => {
    return apiRequest("POST", "/projects", projectData);
  },

  update: async (id: string, updateData: any) => {
    return apiRequest("PUT", `/projects/${id}`, updateData);
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/projects/${id}`);
  },

  uploadImages: async (projectId: string, images: File[]) => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    return apiRequest("POST", `/projects/${projectId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return apiRequest("GET", "/users/profile");
  },

  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    position?: string;
    bio?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    linkedIn?: string;
    twitter?: string;
  }) => {
    return apiRequest("PUT", "/users/profile", profileData);
  },

  uploadAvatar: async (avatar: File) => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    return apiRequest("POST", "/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return apiRequest("GET", "/users", null, { params });
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (timeframe?: "day" | "week" | "month") => {
    return apiRequest("GET", "/analytics/overview", null, {
      params: { timeframe },
    });
  },

  getUserJourney: async (userId: string) => {
    return apiRequest("GET", `/analytics/user/${userId}`);
  },

  trackEvent: async (eventData: {
    event: string;
    data?: any;
    userId?: string;
  }) => {
    return apiRequest("POST", "/analytics/track", eventData);
  },

  getLeadScoring: async () => {
    return apiRequest("GET", "/analytics/lead-scoring");
  },
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    approved?: boolean;
    featured?: boolean;
    rating?: number;
  }) => {
    return apiRequest("GET", "/testimonials", null, { params });
  },

  getById: async (id: string) => {
    return apiRequest("GET", `/testimonials/${id}`);
  },

  create: async (testimonialData: {
    name: string;
    email: string;
    company?: string;
    position?: string;
    location?: string;
    rating: number;
    testimonial: string;
    projectName?: string;
    projectValue?: string;
    projectDuration?: string;
  }) => {
    return apiRequest("POST", "/testimonials", testimonialData);
  },

  update: async (id: string, updateData: any) => {
    return apiRequest("PUT", `/testimonials/${id}`, updateData);
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/testimonials/${id}`);
  },
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file: File, type: "avatar" | "project" | "document") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return apiRequest("POST", "/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadMultiple: async (files: File[], type: "project" | "document") => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("type", type);

    return apiRequest("POST", "/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  }) => {
    return apiRequest("GET", "/notifications", null, { params });
  },

  markAsRead: async (id: string) => {
    return apiRequest("PATCH", `/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return apiRequest("PATCH", "/notifications/read-all");
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/notifications/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    return apiRequest("GET", "/admin/dashboard");
  },

  getSystemHealth: async () => {
    return apiRequest("GET", "/admin/health");
  },

  getSystemSettings: async () => {
    return apiRequest("GET", "/admin/settings");
  },

  updateSystemSettings: async (settings: Record<string, any>) => {
    return apiRequest("PUT", "/admin/settings", settings);
  },

  getUserAnalytics: async (timeframe?: string) => {
    return apiRequest("GET", "/admin/analytics/users", null, {
      params: { timeframe },
    });
  },

  getProjectAnalytics: async (timeframe?: string) => {
    return apiRequest("GET", "/admin/analytics/projects", null, {
      params: { timeframe },
    });
  },
};

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getAuthToken = (): string | null => {
  return getToken();
};

export const clearAuthentication = (): void => {
  clearTokens();
};

// Generic API call function for compatibility
export const apiCall = async <T>(
  endpoint: string,
  options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  }
): Promise<T> => {
  try {
    const method = options?.method || 'GET';
    const data = options?.body ? JSON.parse(options.body) : undefined;
    const config: AxiosRequestConfig = {
      headers: options?.headers,
    };

    const response: AxiosResponse<ApiResponse<T>> = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    if (response.data.success) {
      return response.data.data as T;
    } else {
      throw new Error(response.data.error || "API request failed");
    }
  } catch (error: any) {
    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      throw new Error(
        "Network connection failed. Please check your internet connection.",
      );
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // Handle API errors
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw error;
  }
};

// Export the configured axios instance for direct use if needed
export { apiClient };

// Default export
// Export individual APIs for backward compatibility
export const projectAPI = projectsAPI;
export const activityAPI = analyticsAPI;
export const userAPI = usersAPI;

export default {
  authAPI,
  contactAPI,
  projectsAPI,
  usersAPI,
  analyticsAPI,
  testimonialsAPI,
  uploadAPI,
  notificationsAPI,
  adminAPI,
  isAuthenticated,
  getAuthToken,
  clearAuthentication,
};
