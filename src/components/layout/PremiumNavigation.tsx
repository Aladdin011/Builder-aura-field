import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  Building2,
  Users,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';

interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    subItems: [
      { label: 'Residential', href: '/services/residential', description: 'Modern homes and communities' },
      { label: 'Commercial', href: '/services/commercial', description: 'Office buildings and complexes' },
      { label: 'Infrastructure', href: '/services/infrastructure', description: 'Roads, bridges, and utilities' },
      { label: 'Smart Cities', href: '/services/smart-cities', description: 'Technology-integrated urban planning' },
    ]
  },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Mobile menu component
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();

  const handleNavClick = (href: string, label: string) => {
    trackUserInteraction(`mobile-nav-${label.toLowerCase()}`);
    navigate(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-800">JD Marc</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => handleNavClick(item.href, item.label)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        location.pathname === item.href
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.subItems && <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {/* Sub Items */}
                    {item.subItems && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.label}
                            onClick={() => handleNavClick(subItem.href, subItem.label)}
                            className="w-full p-3 text-left text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <div className="font-medium">{subItem.label}</div>
                            {subItem.description && (
                              <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>+234 (0) 9 291 3991</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>info@jdmarc.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>Abuja, Nigeria</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <button 
                  onClick={() => handleNavClick('/contact', 'Get Quote')}
                  className="w-full btn-primary-premium justify-center"
                >
                  <span>Get Quote</span>
                  <ArrowRight className="btn-icon" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Desktop dropdown menu
const DropdownMenu = ({ item, isOpen, onToggle }: { 
  item: NavItem; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => {
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();

  const handleSubItemClick = (href: string, label: string) => {
    trackUserInteraction(`dropdown-nav-${label.toLowerCase()}`);
    navigate(href);
    onToggle();
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-white transition-colors"
      >
        <span>{item.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && item.subItems && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-72 glass-dark rounded-xl border border-white/10 p-2 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {item.subItems.map((subItem, index) => (
              <motion.button
                key={subItem.label}
                onClick={() => handleSubItemClick(subItem.href, subItem.label)}
                className="w-full p-3 text-left rounded-lg hover:bg-white/10 transition-colors group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium group-hover:text-orange-300 transition-colors">
                    {subItem.label}
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-orange-300 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                {subItem.description && (
                  <div className="text-sm text-white/60 mt-1">{subItem.description}</div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PremiumNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNavClick = (href: string, label: string) => {
    trackUserInteraction(`nav-${label.toLowerCase()}`);
    navigate(href);
  };

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleLogoClick = () => {
    trackUserInteraction('nav-logo');
    navigate('/');
  };

  const handleGetQuote = () => {
    trackUserInteraction('nav-get-quote');
    navigate('/contact');
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'glass-dark shadow-xl' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-fluid">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.button
              onClick={handleLogoClick}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Building2 className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-white font-bold text-xl group-hover:text-orange-300 transition-colors">
                JD Marc Limited
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <div key={item.label} onClick={(e) => e.stopPropagation()}>
                  {item.subItems ? (
                    <DropdownMenu
                      item={item}
                      isOpen={activeDropdown === item.label}
                      onToggle={() => handleDropdownToggle(item.label)}
                    />
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.href, item.label)}
                      className={`px-4 py-2 rounded-lg transition-colors relative ${
                        location.pathname === item.href
                          ? 'text-orange-300'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {location.pathname === item.href && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 w-1 h-1 bg-orange-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          layoutId="activeIndicator"
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Get Quote Button - Desktop */}
              <motion.button
                onClick={handleGetQuote}
                className="hidden lg:flex btn-primary-premium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Quote</span>
                <ArrowRight className="btn-icon" />
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg glass text-white border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </nav>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
          style={{
            width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%`,
            transformOrigin: "left"
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
        />
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
