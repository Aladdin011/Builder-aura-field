import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronRight, ArrowDown, Building, MapPin, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useAdvancedAnimations } from '@/lib/advancedAnimations';

// Floating elements for visual interest
const FloatingElement = ({ delay, duration, x, y, color }: { 
  delay: number; 
  duration: number; 
  x: number; 
  y: number; 
  color: string;
}) => (
  <motion.div
    className={`absolute w-3 h-3 ${color} rounded-full opacity-30 blur-sm`}
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.5, 1],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Stats counter component
const StatCounter = ({ value, label, suffix = "", prefix = "" }: { 
  value: number; 
  label: string; 
  suffix?: string; 
  prefix?: string; 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev >= value) {
            clearInterval(timer);
            return value;
          }
          return prev + Math.ceil(value / 40);
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="text-3xl md:text-4xl font-bold text-amber-200 mb-2 font-mono">
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-300 text-sm font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

export default function PremiumHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const animations = useAdvancedAnimations();
  const { trackUserInteraction } = useAppStore();
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Enhanced parallax effects for smooth upward transition
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Mouse tracking for subtle interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleContactClick = () => {
    trackUserInteraction('hero-contact-cta');
    navigate('/contact');
  };

  const handleProjectsClick = () => {
    trackUserInteraction('hero-projects-cta');
    navigate('/projects');
  };

  const scrollToNext = () => {
    trackUserInteraction('hero-scroll-indicator');
    const nextSection = document.getElementById('services');
    if (nextSection) {
      animations.smoothScroll(nextSection.offsetTop - 100);
    }
  };

  // Generate floating elements
  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: i % 3 === 0 ? 'bg-amber-400' : i % 3 === 1 ? 'bg-orange-500' : 'bg-yellow-300',
  }));

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, scale }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-background.jpg)',
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60" />
        {/* Additional overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {floatingElements.map(element => (
          <FloatingElement key={element.id} {...element} />
        ))}
      </div>

      {/* Interactive Mouse Effect */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none z-20"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(251, 191, 36, 0.15), transparent 50%)`,
        }}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-30">
        <motion.div
          className="min-h-screen flex items-center"
          style={{ y: contentY, opacity }}
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center w-full">
            
            {/* Left Content - Company Information */}
            <motion.div
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Company Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Building className="w-5 h-5 text-amber-400" />
                <span className="text-amber-200 text-sm font-semibold tracking-wide">
                  EST. 2007 • BUILDING EXCELLENCE
                </span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-6">
                <motion.h1
                  className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  <span className="text-white font-extrabold">JD Marc</span>
                  <br />
                  <span className="text-white font-extrabold">Limited</span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent font-black">
                    Building
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent font-black">
                    Africa's
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent font-black">
                    Future Cities
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-light"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                >
                  Pioneering sustainable urban development across Africa with innovative 
                  construction solutions, intelligent infrastructure, and visionary architecture 
                  that shapes tomorrow's cities today.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 items-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
              >
                <button
                  onClick={handleProjectsClick}
                  className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:shadow-amber-500/25 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
                  <span className="relative flex items-center gap-3">
                    View Our Projects
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>

                <button
                  onClick={handleContactClick}
                  className="group px-8 py-4 border-2 border-amber-400 text-amber-400 font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-amber-400 hover:text-black hover:shadow-lg hover:shadow-amber-400/25"
                >
                  <span className="flex items-center gap-3">
                    Start Your Project
                    <Phone className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  </span>
                </button>
              </motion.div>

              {/* Quick Contact Info */}
              <motion.div
                className="flex flex-wrap gap-6 pt-6 border-t border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.3 }}
              >
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">+234 (0) 123 456 7890</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">info@jdmarclimited.com</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Stats */}
            <motion.div
              className="lg:col-span-5 flex items-center justify-center"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl">
                <motion.h3
                  className="text-2xl font-bold text-amber-400 mb-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Our Impact
                </motion.h3>
                
                <div className="grid grid-cols-1 gap-8">
                  <StatCounter value={500} label="Projects Completed" suffix="+" />
                  <StatCounter value={17} label="Years of Excellence" suffix="+" />
                  <StatCounter value={85} label="Investment Value" suffix="M+" prefix="$" />
                  <StatCounter value={12} label="African Countries" suffix="+" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={scrollToNext}
      >
        <motion.div
          className="flex flex-col items-center group"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <span className="text-amber-400 text-sm mb-4 group-hover:text-amber-300 transition-colors font-medium tracking-wider">
            EXPLORE OUR SERVICES
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-amber-400/60 to-transparent mb-3" />
          <motion.div
            className="w-12 h-12 border-2 border-amber-400/60 rounded-full flex items-center justify-center group-hover:border-amber-400 transition-colors group-hover:bg-amber-400/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowDown className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
