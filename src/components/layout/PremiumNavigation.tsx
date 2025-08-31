import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Building2,
  Home,
  Settings,
  Users,
  Briefcase,
  Target,
  Zap,
  Shield,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Menu,
  X,
  Construction,
  MapPin,
  Phone,
  Mail,
  Award,
  Sparkles,
  Globe,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import SmartLogo from "@/components/ui/SmartLogo";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  subItems?: {
    label: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
}

const navItems: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    subItems: [
      {
        label: "Residential Construction",
        href: "/services/residential",
        description: "Modern homes and residential communities",
        icon: <Home className="w-5 h-5" />,
      },
      {
        label: "Commercial Buildings",
        href: "/services/commercial",
        description: "Office complexes and commercial spaces",
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        label: "Infrastructure Development",
        href: "/services/infrastructure",
        description: "Roads, bridges, and public utilities",
        icon: <Settings className="w-5 h-5" />,
      },
      {
        label: "Smart Cities & Urban Planning",
        href: "/services/smart-cities",
        description: "Technology-integrated urban development",
        icon: <Zap className="w-5 h-5" />,
      },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    subItems: [
      {
        label: "Industry Insights",
        href: "/blog/industry",
        description: "Latest construction & infrastructure trends",
        icon: <Target className="w-5 h-5" />,
      },
      {
        label: "Project Updates",
        href: "/blog/projects",
        description: "Behind-the-scenes project coverage",
        icon: <Building2 className="w-5 h-5" />,
      },
      {
        label: "Technology & Innovation",
        href: "/blog/technology",
        description: "Smart construction & sustainable building",
        icon: <Zap className="w-5 h-5" />,
      },
      {
        label: "Company News",
        href: "/blog/news",
        description: "JD Marc Limited updates & announcements",
        icon: <Award className="w-5 h-5" />,
      },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
];

// Enhanced Premium Dropdown Component
const PremiumDropdown = ({
  item,
  isOpen,
  onToggle,
  onClose,
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubItemClick = (href: string, label: string) => {
    trackUserInteraction(`dropdown-nav-${label.toLowerCase()}`);
    navigate(href);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={onToggle}
        className="nav-item dropdown flex items-center gap-2 px-4 py-3 text-white/90 hover:text-white transition-all duration-300 relative group font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{item.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>

        {/* Enhanced hover underline */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#AA7452] to-[#7C5841] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && item.subItems && (
          <motion.div
            className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-96 bg-white/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
          >
            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-[#051822] mb-2">
                  {item.label}
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-full" />
              </div>

              {/* Menu items */}
              <div className="space-y-2">
                {item.subItems.map((subItem, index) => (
                  <motion.button
                    key={subItem.label}
                    onClick={() =>
                      handleSubItemClick(subItem.href, subItem.label)
                    }
                    className="w-full text-left p-4 rounded-2xl hover:bg-gradient-to-r hover:from-[#AA7452]/10 hover:to-[#7C5841]/10 transition-all duration-300 group border border-transparent hover:border-[#AA7452]/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-[#AA7452]/20 to-[#7C5841]/20 rounded-xl flex items-center justify-center text-[#AA7452] group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {subItem.icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[#051822] font-bold group-hover:text-[#AA7452] transition-colors">
                            {subItem.label}
                          </h4>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#AA7452] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                        {subItem.description && (
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer CTA */}
              <motion.div
                className="mt-6 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Need consultation?
                  </div>
                  <motion.button
                    onClick={() => handleSubItemClick("/contact", "Contact")}
                    className="text-[#AA7452] font-semibold text-sm hover:text-[#7C5841] transition-colors flex items-center gap-1"
                    whileHover={{ x: 3 }}
                  >
                    Contact Us
                    <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Mobile Menu Component
const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();
  const { theme, setTheme } = useTheme();

  const handleNavClick = (href: string, label: string) => {
    trackUserInteraction(`mobile-nav-${label.toLowerCase()}`);
    navigate(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-[#051822]/80 to-[#2D383E]/80 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Enhanced Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-white to-gray-50 z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="p-8">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 rounded-2xl flex items-center justify-center border border-[#AA7452]/20">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fbd53220f2be44e7b823f6284706cc662%2F74072840a2e04ede8037ff70b072ee1d?format=webp&width=200"
                      alt="JD Marc Limited Professional Logo"
                      className="w-10 h-10 object-contain drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#051822]">
                      JD Marc
                    </div>
                    <div className="text-sm text-gray-600">
                      Construction Excellence
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-[#051822]" />
                </motion.button>
              </div>

              {/* Enhanced Navigation Items */}
              <nav className="space-y-3 mb-12">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <motion.button
                      onClick={() => handleNavClick(item.href, item.label)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-300",
                        location.pathname === item.href
                          ? "bg-gradient-to-r from-[#AA7452]/20 to-[#7C5841]/20 text-[#051822] border border-[#AA7452]/30"
                          : "text-[#051822] hover:bg-gray-100",
                      )}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            location.pathname === item.href
                              ? "bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white"
                              : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {item.label === "Services" && (
                            <Construction className="w-5 h-5" />
                          )}
                          {item.label === "Blog" && (
                            <Award className="w-5 h-5" />
                          )}
                          {item.label === "Projects" && (
                            <Building2 className="w-5 h-5" />
                          )}
                          {item.label === "About" && (
                            <Users className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      {item.subItems && (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </nav>

              {/* Enhanced Contact Info */}
              <motion.div
                className="mb-8 p-6 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 rounded-3xl border border-[#AA7452]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-black text-[#051822] mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#AA7452]" />
                  Quick Contact
                </h4>
                <div className="space-y-3">
                  <a
                    href="tel:+2348037065497"
                    className="flex items-center gap-3 text-gray-700 hover:text-[#AA7452] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+234 803 706 5497</span>
                  </a>
                  <a
                    href="mailto:info@jdmarcng.com"
                    className="flex items-center gap-3 text-gray-700 hover:text-[#AA7452] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">info@jdmarcng.com</span>
                  </a>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Abuja, Nigeria</span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Theme Toggle */}
              <motion.div
                className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[#051822] text-sm font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#AA7452]" />
                  Appearance
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: Building2, label: "Auto" },
                  ].map(({ value, icon: Icon, label }) => (
                    <motion.button
                      key={value}
                      onClick={() => setTheme(value as any)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300",
                        theme === value
                          ? "border-[#AA7452] bg-[#AA7452]/10 text-[#051822]"
                          : "border-gray-200 hover:border-gray-300 text-gray-600",
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="text-xs font-medium">{label}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Auth Buttons */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {!isAuthenticated && (
                  <>
                    <motion.button
                      onClick={() => handleNavClick("/login", "Login")}
                      className="w-full flex items-center justify-center gap-3 p-4 border-2 border-[#AA7452] rounded-2xl text-[#AA7452] hover:bg-[#AA7452] hover:text-white font-bold transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavClick("/register", "Register")}
                      className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white rounded-2xl hover:shadow-lg hover:shadow-[#AA7452]/30 font-bold transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Get Started</span>
                    </motion.button>
                  </>
                )}
                {isAuthenticated && (
                  <motion.button
                    onClick={() => handleNavClick("/dashboard", "Dashboard")}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:shadow-lg hover:shadow-green-600/30 font-bold transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function PremiumNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();
  const { theme, setTheme, actualTheme } = useTheme();
  const { login, isAuthenticated } = useAuth();

  // Apply construction color system
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-dark", "#051822");
    root.style.setProperty("--secondary-dark", "#2D383E");
    root.style.setProperty("--accent-warm", "#7C5841");
    root.style.setProperty("--accent-light", "#AA7452");
    root.style.setProperty("--neutral-mid", "#969A9E");
    root.style.setProperty("--neutral-light", "#D4C9C7");
  }, []);

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, label: string) => {
    trackUserInteraction(`nav-${label.toLowerCase()}`);
    navigate(href);
  };

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleLogoClick = () => {
    trackUserInteraction("nav-logo");
    navigate("/");
  };

  return (
    <>
      <motion.header
        className={cn(
          "header-premium fixed top-0 w-full z-50 transition-all duration-500",
          isScrolled
            ? "bg-gradient-to-r from-[#051822]/95 to-[#2D383E]/95 backdrop-blur-2xl shadow-2xl border-b border-white/10"
            : "bg-gradient-to-r from-[#051822]/90 to-[#2D383E]/90 backdrop-blur-xl border-b border-white/5",
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <nav className="nav-container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Enhanced Logo */}
          <motion.button
            onClick={handleLogoClick}
            className="logo flex items-center gap-4 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-white/20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <SmartLogo
                size="md"
                variant="light"
                alt="JD Marc Limited Professional Logo"
                className="drop-shadow-lg"
              />
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-white font-black text-2xl group-hover:text-[#D4C9C7] transition-colors">
                JD Marc
              </div>
              <div className="text-[#AA7452] text-xs font-medium uppercase tracking-wider">
                Construction Excellence
              </div>
            </div>
          </motion.button>

          {/* Enhanced Desktop Navigation */}
          <div className="nav-desktop hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.subItems ? (
                  <PremiumDropdown
                    item={item}
                    isOpen={activeDropdown === item.label}
                    onToggle={() => handleDropdownToggle(item.label)}
                    onClose={() => setActiveDropdown(null)}
                  />
                ) : (
                  <motion.button
                    onClick={() => handleNavClick(item.href, item.label)}
                    className={cn(
                      "nav-item px-4 py-3 rounded-2xl transition-all duration-300 relative group font-medium",
                      location.pathname === item.href
                        ? "text-white bg-white/10"
                        : "text-white/90 hover:text-white hover:bg-white/5",
                    )}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{item.label}</span>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#AA7452] to-[#7C5841] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"
                      initial={{
                        scaleX: location.pathname === item.href ? 1 : 0,
                      }}
                      whileHover={{ scaleX: 1 }}
                    />
                  </motion.button>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Desktop CTA & Theme Toggle */}
          <div className="nav-cta hidden lg:flex items-center gap-6">
            {/* Enhanced Theme Toggle */}
            <motion.div
              className="relative w-16 h-8 bg-black/40 border border-white/30 rounded-full p-1 cursor-pointer backdrop-blur-sm"
              onClick={() =>
                setTheme(actualTheme === "light" ? "dark" : "light")
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative w-6 h-6 bg-gradient-to-r from-white to-gray-100 rounded-full shadow-lg flex items-center justify-center"
                animate={{ x: actualTheme === "dark" ? 0 : 32 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {actualTheme === "dark" ? (
                  <Moon className="w-3 h-3 text-blue-600" />
                ) : (
                  <Sun className="w-3 h-3 text-orange-500" />
                )}
              </motion.div>
            </motion.div>

            {/* Enhanced Auth Buttons */}
            {!isAuthenticated && (
              <>
                <motion.button
                  onClick={() => handleNavClick("/login", "Login")}
                  className="btn-secondary px-6 py-3 bg-transparent border-2 border-white/30 rounded-2xl text-white hover:text-[#051822] hover:bg-white hover:border-white transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => handleNavClick("/register", "Register")}
                  className="btn-primary px-6 py-3 bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white rounded-2xl hover:shadow-lg hover:shadow-[#AA7452]/30 transition-all duration-300 font-bold"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </>
            )}
            {isAuthenticated && (
              <motion.button
                onClick={() => handleNavClick("/dashboard", "Dashboard")}
                className="btn-primary px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:shadow-lg hover:shadow-green-600/30 transition-all duration-300 font-bold"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Dashboard
              </motion.button>
            )}
          </div>

          {/* Enhanced Mobile Menu Toggle */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mobile-toggle lg:hidden p-3 rounded-xl hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="space-y-2">
              <motion.span
                className="block w-6 h-0.5 bg-white transition-all duration-300"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 8 : 0,
                }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-white transition-all duration-300"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-white transition-all duration-300"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -8 : 0,
                }}
              />
            </div>
          </motion.button>
        </nav>
      </motion.header>

      {/* Enhanced Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
