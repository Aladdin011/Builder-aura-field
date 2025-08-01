import React, { useState, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Star,
  Quote,
  Play,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Award,
  MapPin,
  Calendar,
  Video,
  MessageSquare,
  Heart,
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Dr. Amina Ibrahim",
    role: "Managing Director",
    company: "Lagos Development Authority",
    location: "Lagos, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&q=80",
    rating: 5,
    project: "Lagos Smart City Complex",
    testimonial:
      "JD Marc Limited exceeded all our expectations. Their innovative approach to smart city development and attention to sustainability has set a new standard for urban planning in Nigeria. The project was delivered on time and within budget.",
    videoThumbnail:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
    hasVideo: true,
    metrics: {
      projectValue: "$45M",
      timeline: "24 months",
      satisfaction: "98%",
    },
    tags: ["Smart Cities", "Sustainability", "Innovation"],
  },
  {
    id: 2,
    name: "Chief Williams Okafor",
    role: "Chairman",
    company: "Okafor Holdings Ltd",
    location: "Abuja, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    rating: 5,
    project: "Abuja Financial District",
    testimonial:
      "Working with JD Marc was a game-changer for our business expansion. Their expertise in commercial construction and understanding of modern business needs resulted in a world-class facility that attracts top-tier tenants.",
    videoThumbnail:
      "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&q=80",
    hasVideo: true,
    metrics: {
      projectValue: "$32M",
      timeline: "18 months",
      satisfaction: "96%",
    },
    tags: ["Commercial", "Business", "Quality"],
  },
  {
    id: 3,
    name: "Mrs. Sarah Adebayo",
    role: "Community Leader",
    company: "Kano Residents Association",
    location: "Kano, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 5,
    project: "Kano Residential Estate",
    testimonial:
      "The residential estate built by JD Marc has transformed our community. The quality of construction, modern amenities, and focus on family-friendly design has created a wonderful place to call home.",
    videoThumbnail:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
    hasVideo: false,
    metrics: {
      projectValue: "$28M",
      timeline: "20 months",
      satisfaction: "99%",
    },
    tags: ["Residential", "Community", "Family"],
  },
  {
    id: 4,
    name: "Engr. Femi Ogundipe",
    role: "State Commissioner",
    company: "Cross River State Government",
    location: "Cross River, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
    project: "Cross River Bridge",
    testimonial:
      "The Cross River Bridge project demonstrates JD Marc's exceptional capability in complex infrastructure development. Their innovative engineering solutions and commitment to safety standards are unmatched.",
    videoThumbnail:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
    hasVideo: true,
    metrics: {
      projectValue: "$55M",
      timeline: "30 months",
      satisfaction: "100%",
    },
    tags: ["Infrastructure", "Engineering", "Safety"],
  },
  {
    id: 5,
    name: "Mr. Chidi Okwu",
    role: "CEO",
    company: "Port Harcourt Development Corp",
    location: "Port Harcourt, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    rating: 5,
    project: "Port Harcourt Mall",
    testimonial:
      "JD Marc delivered a retail complex that has become the heart of our city's commercial activity. Their understanding of modern retail needs and architectural excellence is truly impressive.",
    videoThumbnail:
      "https://images.unsplash.com/photo-1519642055093-45c8770d0e8e?w=400&q=80",
    hasVideo: false,
    metrics: {
      projectValue: "$22M",
      timeline: "15 months",
      satisfaction: "97%",
    },
    tags: ["Retail", "Commercial", "Architecture"],
  },
];

// Company stats for credibility
const companyStats = [
  {
    label: "Projects Completed",
    value: "500+",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    label: "Happy Clients",
    value: "450+",
    icon: <Users className="w-6 h-6" />,
  },
  {
    label: "Industry Awards",
    value: "25+",
    icon: <Award className="w-6 h-6" />,
  },
  {
    label: "Client Satisfaction",
    value: "98%",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

// Individual testimonial card
const TestimonialCard = ({
  testimonial,
  isActive,
}: {
  testimonial: (typeof testimonials)[0];
  isActive: boolean;
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { trackUserInteraction } = useAppStore();

  const handleVideoClick = () => {
    trackUserInteraction(`testimonial-video-${testimonial.id}`);
    setIsVideoModalOpen(true);
  };

  return (
    <>
      <motion.div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden ${
          isActive ? "ring-2 ring-orange-200" : ""
        }`}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
      >
        {/* Quote Icon */}
        <motion.div
          className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center"
          animate={{ rotate: isActive ? 360 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <Quote className="w-6 h-6 text-orange-500" />
        </motion.div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Star
                className={`w-5 h-5 ${
                  i < testimonial.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Testimonial Text */}
        <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 relative">
          "{testimonial.testimonial}"
        </blockquote>

        {/* Project Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Project Value</div>
            <div className="font-semibold text-gray-800">
              {testimonial.metrics.projectValue}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Timeline</div>
            <div className="font-semibold text-gray-800">
              {testimonial.metrics.timeline}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Satisfaction</div>
            <div className="font-semibold text-green-600">
              {testimonial.metrics.satisfaction}
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-lg">
              {testimonial.name}
            </h4>
            <p className="text-gray-600">{testimonial.role}</p>
            <p className="text-sm text-gray-500">{testimonial.company}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {testimonial.location}
              </span>
            </div>
          </div>

          {/* Video Button */}
          {testimonial.hasVideo && (
            <motion.button
              onClick={handleVideoClick}
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 ml-0.5" />
            </motion.button>
          )}
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-6">
          {testimonial.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Project Reference */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Project:{" "}
            <span className="font-medium text-gray-800">
              {testimonial.project}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={testimonial.videoThumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg">Video Testimonial</p>
                  <p className="text-sm opacity-60">Coming Soon</p>
                </div>
              </div>

              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Testimonial carousel component
const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setAutoPlay(false);
  };

  return (
    <div className="relative">
      {/* Main Testimonial */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <TestimonialCard
            key={currentIndex}
            testimonial={testimonials[currentIndex]}
            isActive={true}
          />
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={goToPrevious}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats component
const StatsGrid = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
    {companyStats.map((stat, index) => (
      <motion.div
        key={stat.label}
        className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white mx-auto mb-4"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {stat.icon}
        </motion.div>
        <div className="text-3xl font-bold text-gray-800 mb-2">
          {stat.value}
        </div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </motion.div>
    ))}
  </div>
);

export default function PremiumTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        style={{ y: y.get() * -0.5 }}
      />

      <div className="container-fluid relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <MessageSquare className="w-4 h-4" />
            Client Testimonials
          </motion.div>

          <h2 className="text-heading-xl text-white mb-6">
            What Our Clients
            <br />
            <span className="gradient-text">Say About Us</span>
          </h2>

          <p className="text-body-lg text-gray-300 max-w-3xl mx-auto">
            Discover why industry leaders, government officials, and community
            stakeholders choose JD Marc Limited for their most important
            construction projects.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <StatsGrid />
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <TestimonialCarousel />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20 p-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Heart className="w-12 h-12 text-orange-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Join Our Growing Family of Satisfied Clients
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the same level of excellence that has made us Nigeria's
            most trusted construction partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary-premium">
              <span>Start Your Project</span>
              <Building2 className="btn-icon" />
            </button>
            <button className="btn-ghost border border-white/20 text-white hover:bg-white/10">
              <span>Read More Reviews</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
