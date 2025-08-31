import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Globe,
  Construction,
  Building2,
  Users,
  Award,
  Shield,
  Zap,
  ArrowRight,
  ExternalLink,
  Calendar,
  Clock,
  Send,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Floating background elements
const FloatingElement = ({ 
  className, 
  delay = 0, 
  duration = 20 
}: { 
  className: string; 
  delay?: number; 
  duration?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
    animate={{ 
      opacity: [0.03, 0.08, 0.03], 
      scale: [0.8, 1.2, 0.8], 
      rotate: [0, 180, 360],
      x: [0, 30, -30, 0],
      y: [0, -20, 20, 0] 
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={cn("absolute rounded-full", className)}
  />
);

// Enhanced newsletter component
const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        <h4 className="text-lg font-bold text-green-800 mb-2">
          Successfully Subscribed! 🎉
        </h4>
        <p className="text-green-700 text-sm">
          Thank you for joining our newsletter. You'll receive updates about our latest projects and industry insights.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-14 pl-12 pr-4 bg-white/5 border-white/20 text-white placeholder:text-white/60 rounded-2xl focus:border-[#AA7452] focus:ring-1 focus:ring-[#AA7452]"
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
        </div>
        <motion.button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "h-14 px-8 bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white rounded-2xl font-bold transition-all duration-300 flex items-center gap-2",
            status === "submitting" && "opacity-70 cursor-not-allowed"
          )}
          whileHover={{ scale: status === "submitting" ? 1 : 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {status === "submitting" ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Joining...
            </>
          ) : (
            <>
              Subscribe
              <Send className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
      <p className="text-white/70 text-sm">
        Join 5,000+ construction professionals who trust our insights. No spam, unsubscribe anytime.
      </p>
    </form>
  );
};

// Enhanced office card component
const OfficeCard = ({ 
  office, 
  index 
}: { 
  office: any; 
  index: number; 
}) => {
  const flagEmojis = {
    "Nigeria": "🇳🇬",
    "United Kingdom": "🇬🇧", 
    "United States": "🇺🇸"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <motion.div 
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">
            {flagEmojis[office.country as keyof typeof flagEmojis]}
          </div>
          <div>
            <h4 className="font-bold text-white group-hover:text-[#AA7452] transition-colors">
              {office.name}
            </h4>
            <p className="text-white/70 text-sm">{office.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#AA7452] mt-0.5 flex-shrink-0" />
            <span className="text-white/90 text-sm leading-relaxed">{office.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#AA7452] flex-shrink-0" />
            <a
              href={`tel:${office.phone.replace(/\s/g, "")}`}
              className="text-white/90 text-sm hover:text-[#AA7452] transition-colors"
            >
              {office.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#AA7452] flex-shrink-0" />
            <a
              href={`mailto:${office.email}`}
              className="text-white/90 text-sm hover:text-[#AA7452] transition-colors"
            >
              {office.email}
            </a>
          </div>
          {office.website !== "Coming Soon" && (
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#AA7452] flex-shrink-0" />
              <a
                href={`https://${office.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 text-sm hover:text-[#AA7452] transition-colors flex items-center gap-1"
              >
                {office.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#AA7452] mt-0.5 flex-shrink-0" />
            <span className="text-white/90 text-sm">{office.hours}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Apply construction color system
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-dark', '#051822');
    root.style.setProperty('--secondary-dark', '#2D383E');
    root.style.setProperty('--accent-warm', '#7C5841');
    root.style.setProperty('--accent-light', '#AA7452');
    root.style.setProperty('--neutral-mid', '#969A9E');
    root.style.setProperty('--neutral-light', '#D4C9C7');
  }, []);

  const offices = [
    {
      name: "Nigeria (Headquarters)",
      country: "Nigeria",
      address: "Plot 107, Ahmadu Bello Way, Abuja",
      phone: "+234 (0)8037 065497",
      email: "info@jdmarcng.com",
      website: "www.jdmarcng.com",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      description: "Main operations center",
    },
    {
      name: "United Kingdom",
      country: "United Kingdom",
      address: "71-75 Shelton Street, London WC2H 9RQ",
      phone: "+44 (0)7760954844",
      email: "info@jdmarc.co.uk",
      website: "www.jdmarc.co.uk",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM GMT",
      description: "International partnerships hub",
    },
    {
      name: "United States",
      country: "United States",
      address: "125 Park Avenue, New York, NY 10017",
      phone: "+1 (212) 456-7890",
      email: "usa@jdmarc.com",
      website: "Coming Soon",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM EST",
      description: "Global procurement center",
    },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ];

  const services = [
    { label: "Residential Construction", href: "/services/residential" },
    { label: "Commercial Buildings", href: "/services/commercial" },
    { label: "Infrastructure Development", href: "/services/infrastructure" },
    { label: "Smart Cities & Urban Planning", href: "/services/smart-cities" },
    { label: "Global Procurement", href: "/services/procurement" },
    { label: "Project Consultation", href: "/services/consultation" },
  ];

  const resources = [
    { label: "Industry Insights", href: "/blog" },
    { label: "Project Case Studies", href: "/case-studies" },
    { label: "Construction Guidelines", href: "/guidelines" },
    { label: "Safety Standards", href: "/safety" },
    { label: "Sustainability Reports", href: "/sustainability" },
    { label: "Press Releases", href: "/press" },
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://facebook.com/jdmarc", 
      label: "Facebook",
      color: "hover:text-blue-400"
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/jdmarc", 
      label: "Twitter",
      color: "hover:text-sky-400"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/jdmarc", 
      label: "Instagram",
      color: "hover:text-pink-400"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/jdmarc", 
      label: "LinkedIn",
      color: "hover:text-blue-400"
    },
  ];

  const stats = [
    { number: "500+", label: "Projects Completed", icon: Building2 },
    { number: "15+", label: "Years Experience", icon: Calendar },
    { number: "50+", label: "Expert Team", icon: Users },
    { number: "98%", label: "Client Satisfaction", icon: Award },
  ];

  return (
    <footer 
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)"
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(212,201,199,0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(170,116,82,0.2) 0%, transparent 50%)
          `
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement 
          className="top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#AA7452]/5 to-transparent blur-3xl" 
          delay={0}
          duration={40}
        />
        <FloatingElement 
          className="bottom-40 right-40 w-80 h-80 bg-gradient-to-l from-[#D4C9C7]/5 to-transparent blur-3xl" 
          delay={20}
          duration={50}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 pt-20 pb-12">
          {/* Company Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/brand/logo.jpg"
                  alt="JD Marc Limited Logo"
                  className="w-14 h-14 object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F8c27ff3f82824383bd700bc3410cfa09?format=webp&width=200";
                  }}
                />
              </motion.div>
              <div>
                <h2 className="text-3xl font-black text-white">JD Marc Limited</h2>
                <p className="text-[#AA7452] font-semibold">Building Africa's Future</p>
              </div>
            </div>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
              Since 2007, we've been at the forefront of African construction and infrastructure development, 
              delivering innovative solutions that transform communities and drive economic growth across the continent.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1), type: "spring", bounce: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <motion.div 
                    className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <IconComponent className="w-8 h-8 text-[#AA7452]" />
                  </motion.div>
                  <div className="text-3xl font-black text-white mb-2 group-hover:text-[#AA7452] transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm font-medium tracking-wide uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">
                      Industry Newsletter
                    </h3>
                    <p className="text-white/70 text-sm">
                      Stay updated with latest insights
                    </p>
                  </div>
                </div>
                <NewsletterSignup />
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#AA7452]" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.href}
                      className="text-white/80 hover:text-[#AA7452] transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#AA7452]" />
                Our Services
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={service.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={service.href}
                      className="text-white/80 hover:text-[#AA7452] transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {service.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#AA7452]" />
                Resources
              </h3>
              <ul className="space-y-3">
                {resources.map((resource, index) => (
                  <motion.li
                    key={resource.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={resource.href}
                      className="text-white/80 hover:text-[#AA7452] transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {resource.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Global Offices */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-black text-white text-center mb-8 flex items-center justify-center gap-3">
              <Globe className="w-6 h-6 text-[#AA7452]" />
              Global Offices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <OfficeCard key={office.name} office={office} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Social Links & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Social Links */}
              <div className="flex items-center gap-6">
                <span className="text-white/80 text-sm font-medium">Follow Us:</span>
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/80 transition-all duration-300",
                        social.color
                      )}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + (index * 0.1) }}
                    >
                      <IconComponent size={20} />
                    </motion.a>
                  );
                })}
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-white/70 text-sm mb-2">
                  &copy; {currentYear} JD Marc Limited. All rights reserved.
                </p>
                <p className="text-white/60 text-xs">
                  Building Africa's Future Cities | Est. 2007
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Accent Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          viewport={{ once: true }}
          className="h-1 bg-gradient-to-r from-[#AA7452] via-[#7C5841] to-[#AA7452]"
        />
      </div>
    </footer>
  );
}
