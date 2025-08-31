import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Building2,
  Users,
  MessageSquare,
  Send,
  Calendar,
  Award,
  Target,
  Sparkles,
  ArrowRight,
  Upload,
  FileText,
  X,
  ChevronDown,
  Zap,
  Shield,
  Construction
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      opacity: [0.05, 0.15, 0.05], 
      scale: [0.8, 1.2, 0.8], 
      rotate: [0, 180, 360],
      x: [0, 50, -50, 0],
      y: [0, -30, 30, 0] 
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

// Enhanced office card component
const OfficeCard = ({ 
  office, 
  index,
  isActive,
  onClick 
}: { 
  office: any; 
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const flagEmojis = {
    "Nigeria (Headquarters)": "🇳🇬",
    "United Kingdom": "🇬🇧", 
    "United States": "🇺🇸"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.2, type: "spring", bounce: 0.3 }}
      viewport={{ once: true }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className={cn(
          "bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full cursor-pointer",
          isActive && "ring-2 ring-[#AA7452] border-[#AA7452]/30"
        )}
        whileHover={{ y: -10, scale: 1.02 }}
        onClick={onClick}
      >
        {/* Header */}
        <div className={cn(
          "p-8 text-white relative overflow-hidden",
          office.name.includes("Nigeria") 
            ? "bg-gradient-to-r from-green-600 to-green-700"
            : office.name.includes("Kingdom")
            ? "bg-gradient-to-r from-blue-600 to-blue-700"
            : "bg-gradient-to-r from-[#AA7452] to-[#7C5841]"
        )}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full" />
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-4xl mb-3">
                {flagEmojis[office.name as keyof typeof flagEmojis]}
              </div>
              <h3 className="text-2xl font-black mb-2">{office.name}</h3>
              <p className="text-white/90 text-sm">{office.description}</p>
            </div>
            
            {office.name.includes("Headquarters") && (
              <motion.div
                className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                HQ
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Address */}
            <motion.div 
              className="flex items-start gap-4 p-4 bg-gradient-to-r from-[#AA7452]/5 to-[#7C5841]/5 rounded-2xl"
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#AA7452]/20 to-[#7C5841]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#AA7452]" />
              </div>
              <div>
                <div className="font-semibold text-[#051822] mb-1">Address</div>
                <div className="text-gray-600 text-sm leading-relaxed">{office.address}</div>
              </div>
            </motion.div>

            {/* Contact grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Phone */}
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Phone</div>
                  <a 
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="font-medium text-[#051822] hover:text-[#AA7452] transition-colors"
                  >
                    {office.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                  <a 
                    href={`mailto:${office.email}`}
                    className="font-medium text-[#051822] hover:text-[#AA7452] transition-colors"
                  >
                    {office.email}
                  </a>
                </div>
              </div>

              {/* Website */}
              {office.website !== "Coming Soon" && (
                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Website</div>
                    <a 
                      href={`https://${office.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#051822] hover:text-[#AA7452] transition-colors"
                    >
                      {office.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Hours */}
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
                  <div className="font-medium text-[#051822]">{office.hours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced form component
const ContactForm = () => {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      // Extract form data
      const submitData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        company: formData.get('company') as string,
        projectType: formData.get('project-type') as string,
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        files: uploadedFiles
      };

      // Validate required fields
      if (!submitData.name || !submitData.email || !submitData.phone || !submitData.description) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Submitting contact form:', submitData);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submitData)
      // });

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      setFormStatus("success");

      // Reset form after successful submission
      setTimeout(() => {
        (e.target as HTMLFormElement).reset();
        setUploadedFiles([]);
        setFormStatus("idle");
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus("error");

      // Reset error status after 5 seconds
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (formStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        
        <h3 className="text-3xl font-black text-green-800 mb-4">
          Message Sent Successfully! 🎉
        </h3>
        <p className="text-green-700 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Thank you for contacting JD Marc. Our construction experts will review your project details 
          and get back to you within 24 hours with a personalized consultation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: MessageSquare, title: "Response Time", desc: "Within 24 hours" },
            { icon: Users, title: "Expert Team", desc: "Dedicated project manager" },
            { icon: Calendar, title: "Next Steps", desc: "Schedule consultation" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-green-800 mb-1">{item.title}</h4>
              <p className="text-green-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={() => setFormStatus("idle")}
          className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Another Message
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-black text-[#051822]">Contact Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: "name", label: "Full Name", placeholder: "John Doe", type: "text", required: true },
            { id: "email", label: "Email Address", placeholder: "john@company.com", type: "email", required: true },
            { id: "phone", label: "Phone Number", placeholder: "+234 803 000 0000", type: "tel", required: true },
            { id: "company", label: "Company/Organization", placeholder: "Your Company Ltd", type: "text", required: false }
          ].map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
              <Label htmlFor={field.id} className="text-[#051822] font-semibold">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="h-14 rounded-2xl border-2 border-gray-200 focus:border-[#AA7452] text-lg"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Project Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-[#051822] to-[#2D383E] rounded-2xl flex items-center justify-center">
            <Construction className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-black text-[#051822]">Project Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <Label htmlFor="project-type" className="text-[#051822] font-semibold">
              Project Type <span className="text-red-500">*</span>
            </Label>
            <Select name="project-type">
              <SelectTrigger className="h-14 rounded-2xl border-2 border-gray-200 focus:border-[#AA7452] text-lg">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential Construction</SelectItem>
                <SelectItem value="commercial">Commercial Buildings</SelectItem>
                <SelectItem value="infrastructure">Infrastructure Development</SelectItem>
                <SelectItem value="urban-planning">Urban Planning & Smart Cities</SelectItem>
                <SelectItem value="procurement">Global Procurement</SelectItem>
                <SelectItem value="consultation">Consultation Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="location" className="text-[#051822] font-semibold">
              Project Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="Lagos, Nigeria"
              required
              className="h-14 rounded-2xl border-2 border-gray-200 focus:border-[#AA7452] text-lg"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-[#051822] font-semibold">
            Project Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Please describe your project requirements, timeline, budget range, and any specific needs. The more details you provide, the better we can assist you..."
            rows={6}
            required
            className="rounded-2xl border-2 border-gray-200 focus:border-[#AA7452] text-lg resize-none"
          />
        </div>
      </motion.div>

      {/* File Upload */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-black text-[#051822]">Project Documents</h4>
            <p className="text-gray-600 text-sm">Upload sketches, blueprints, or specifications (Optional)</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#AA7452] transition-colors">
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            multiple
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PDF, JPG, PNG, DOC (Max 10MB each)
            </p>
          </label>
        </div>

        {/* Uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-semibold text-[#051822]">Uploaded Files:</h5>
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="pt-6"
      >
        <motion.button
          type="submit"
          disabled={formStatus === "submitting"}
          className={cn(
            "w-full py-6 rounded-2xl font-black text-xl transition-all duration-300 flex items-center justify-center gap-3",
            formStatus === "submitting" && "opacity-70 cursor-not-allowed",
            formStatus === "success" && "bg-gradient-to-r from-green-600 to-green-700 text-white",
            formStatus === "error" && "bg-gradient-to-r from-red-600 to-red-700 text-white",
            formStatus === "idle" && "bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white"
          )}
          whileHover={{ scale: formStatus === "submitting" ? 1 : 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {formStatus === "submitting" ? (
            <>
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Submitting Your Project...
            </>
          ) : formStatus === "success" ? (
            <>
              <CheckCircle className="w-6 h-6" />
              Message Sent Successfully!
            </>
          ) : formStatus === "error" ? (
            <>
              <AlertCircle className="w-6 h-6" />
              Failed to Send - Please Try Again
            </>
          ) : (
            <>
              Send Project Inquiry
              <Send className="w-6 h-6" />
            </>
          )}
        </motion.button>

        <p className="text-center text-gray-600 text-sm mt-4">
          By submitting this form, you agree to our terms of service and privacy policy.
        </p>
      </motion.div>
    </form>
  );
};

export default function Contact() {
  const [activeOffice, setActiveOffice] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

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
      address: "Plot 107, Ahmadu Bello Way, Abuja",
      phone: "+234 (0)8037 065497",
      email: "info@jdmarcng.com",
      website: "www.jdmarcng.com",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      description: "Main operations and project management center",
    },
    {
      name: "United Kingdom",
      address: "71-75 Shelton Street, London WC2H 9RQ",
      phone: "+44 (0)7760954844",
      email: "info@jdmarc.co.uk",
      website: "www.jdmarc.co.uk",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM GMT",
      description: "International partnerships and technology hub",
    },
    {
      name: "United States",
      address: "125 Park Avenue, New York, NY 10017",
      phone: "+1 (212) 456-7890",
      email: "usa@jdmarc.com",
      website: "Coming Soon",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM EST",
      description: "Global procurement and investment operations",
    },
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          y: heroY,
          opacity: heroOpacity,
          background: "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)"
        }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(212,201,199,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(170,116,82,0.2) 0%, transparent 50%)
            `
          }}
        />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement 
            className="top-20 left-20 w-48 h-48 bg-gradient-to-r from-[#D4C9C7]/5 to-[#AA7452]/3 blur-3xl" 
            delay={0}
            duration={25}
          />
          <FloatingElement 
            className="bottom-32 right-32 w-40 h-40 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/5 blur-2xl" 
            delay={10}
            duration={30}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#AA7452]/20 to-[#7C5841]/10 backdrop-blur-xl border border-[#AA7452]/30 rounded-full text-[#D4C9C7] font-semibold mb-8 shadow-2xl"
            >
              <MessageSquare className="w-6 h-6 text-[#AA7452]" />
              <span className="text-lg">Let's Build Together</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tight"
            >
              <span className="block">Get In</span>
              <motion.span 
                className="block bg-gradient-to-r from-[#AA7452] via-[#7C5841] to-[#D4C9C7] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Touch
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl md:text-2xl text-[#D4C9C7] mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Ready to build <span className="text-[#AA7452] font-semibold">Africa's future</span> together? 
              Connect with JD Marc across our global offices and discover how we can 
              <span className="text-[#D4C9C7] font-semibold"> transform your vision</span> into reality.
            </motion.p>

            {/* Contact methods */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                { icon: Phone, title: "Call Us", desc: "+234 803 706 5497", action: "tel:+2348037065497" },
                { icon: Mail, title: "Email Us", desc: "info@jdmarcng.com", action: "mailto:info@jdmarcng.com" },
                { icon: MessageSquare, title: "Chat Support", desc: "24/7 Available", action: "#form" }
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  href={contact.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + (i * 0.1) }}
                  className="group p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <contact.icon className="w-8 h-8 text-[#AA7452] mx-auto mb-3" />
                  <h3 className="font-bold text-white mb-1">{contact.title}</h3>
                  <p className="text-[#D4C9C7] text-sm">{contact.desc}</p>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Global Offices */}
      <section className="py-32 bg-gradient-to-b from-white via-[#D4C9C7]/5 to-gray-50/50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 rounded-full text-[#7C5841] font-semibold mb-8"
            >
              <Globe className="w-5 h-5" />
              <span>Global Presence</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-[#051822] mb-8 leading-tight">
              Our <span className="text-[#AA7452]">Global Offices</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              With offices across three continents, JD Marc brings international
              expertise to African infrastructure challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {offices.map((office, index) => (
              <OfficeCard
                key={office.name}
                office={office}
                index={index}
                isActive={activeOffice === index}
                onClick={() => setActiveOffice(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Form */}
      <section id="form" className="py-32 bg-gradient-to-b from-gray-50/50 via-white to-[#D4C9C7]/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#051822]/10 to-[#2D383E]/10 rounded-full text-[#051822] font-semibold mb-8"
            >
              <Send className="w-5 h-5" />
              <span>Start Your Project</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-[#051822] mb-8 leading-tight">
              Tell Us About Your <span className="text-[#AA7452]">Vision</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Share your construction or infrastructure project details. Our expert team 
              will provide a personalized consultation within 24 hours.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#051822] mb-4">
              Visit Our Nigeria Headquarters
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Located in the heart of Abuja, our headquarters serves as the central hub 
              for all African operations and project management.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.665479486816!2d7.491302314770478!3d9.084792393498456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0ba9f4f1c5c7%3A0x4a4b5b4b5b4b5b4b!2sAhmadu%20Bello%20Way%2C%20Abuja%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1611344619302!5m2!1sen!2sus"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
                title="JD Marc Nigeria Office Location"
              />
            </div>
            
            {/* Map overlay card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute bottom-8 left-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-200 max-w-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-[#051822]">Nigeria HQ</h4>
                  <p className="text-sm text-gray-600">Main Operations Center</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Plot 107, Ahmadu Bello Way, Abuja, Nigeria
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-black text-[#AA7452]">24/7</div>
                  <div className="text-xs text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-[#AA7452]">50+</div>
                  <div className="text-xs text-gray-600">Team</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-[#AA7452]">15+</div>
                  <div className="text-xs text-gray-600">Years</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
