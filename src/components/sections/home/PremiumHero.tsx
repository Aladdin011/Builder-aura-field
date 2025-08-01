import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Sparkles,
  Play,
  ChevronRight,
  ArrowRight,
  Building2,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";

// Enhanced animated counter with smooth easing
const AnimatedCounter = ({ 
  value, 
  suffix = "", 
  prefix = "",
  duration = 2.5 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Smooth easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-2xl lg:text-3xl font-bold text-white font-mono">
      {prefix}{count}{suffix}
    </div>
  );
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const PremiumHero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8
      }
    }
  };

  const glassVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      backdropFilter: "blur(0px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      backdropFilter: "blur(24px)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 1.2
      }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F0fdaa5fa3aa8442bb410972edd69093b?format=webp&width=1920')`,
            filter: "brightness(0.8) contrast(1.2) saturate(1.1)"
          }}
        />
      </div>

      {/* Minimal Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-cyan-900/25 z-10" />

      {/* Subtle depth gradient */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent" />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Centered content with minimal footprint */}
            <div className="col-span-12 flex justify-center lg:justify-end">
              <div className="w-full lg:max-w-xl xl:max-w-2xl">
                <motion.div
                  variants={glassVariants}
                  initial="hidden"
                  animate="visible"
                  className="glass-hero-card p-6 lg:p-8 rounded-2xl border border-blue-400/15 bg-blue-500/3 backdrop-blur-md w-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(6, 182, 212, 0.02) 100%)",
                    boxShadow: "0 15px 30px -12px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.03)"
                  }}
                >
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {/* Compact Badge */}
                    <motion.div variants={itemVariants}>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-blue-300" />
                        <span className="text-blue-100 text-xs font-medium">
                          Since 2007
                        </span>
                      </div>
                    </motion.div>

                    {/* Compressed Heading */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                        Building{" "}
                        <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                          Tomorrow's Cities
                        </span>
                      </h1>

                      <p className="text-lg text-blue-100/80 leading-relaxed max-w-md">
                        Intelligent construction solutions for Africa's urban transformation.
                      </p>
                    </motion.div>

                    {/* Compact CTA */}
                    <motion.div variants={itemVariants}>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2">
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.button>

                        <motion.button
                          className="group px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-blue-400/30 hover:bg-white/15 transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                              <Play className="w-2 h-2 text-white ml-0.5" />
                            </div>
                            <span>View Projects</span>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Minimal Stats */}
                    <motion.div variants={itemVariants}>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-400/15">
                        <div className="text-center">
                          <AnimatedCounter value={500} suffix="+" />
                          <div className="text-blue-200/60 text-xs font-medium mt-0.5">
                            Projects
                          </div>
                        </div>
                        <div className="text-center">
                          <AnimatedCounter value={15} suffix="+" />
                          <div className="text-blue-200/60 text-xs font-medium mt-0.5">
                            Years
                          </div>
                        </div>
                        <div className="text-center">
                          <AnimatedCounter value={50} prefix="$" suffix="M+" />
                          <div className="text-blue-200/60 text-xs font-medium mt-0.5">
                            Value
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950 to-transparent z-15" />
    </section>
  );
};

export default PremiumHero;
