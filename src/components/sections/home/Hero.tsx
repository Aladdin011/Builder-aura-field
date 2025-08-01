import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for background
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("services-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreProjects = () => {
    navigate("/projects");
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Enhanced Background with Gradient Overlay */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50 z-10" />

        {/* Background image with slow ken burns effect */}
        <motion.div
          animate={{
            scale: [1, 1.05],
            translateX: [0, -5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2Fa99cd57b1b98496ca25fa02ed32b5108')",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-5xl"
        >
          {/* Updated heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.span
              className="text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Building Africa's Future Cities
            </motion.span>
          </motion.h1>

          {/* Main description with expandable content */}
          <motion.div
            className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Updated subtext */}
            <p className="mb-6">
              JD Marc is a proudly Nigerian construction company delivering
              innovative infrastructure projects across Nigeria and beyond since
              2007. With offices in Abuja, London, and New York, we deliver
              smarter, greener, and more resilient urban solutions.
            </p>

            {/* Read More button with slide-up animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center justify-center gap-4 mb-4"
            >
              <motion.button
                onClick={toggleExpanded}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center text-[#F97316] hover:text-[#F97316]/80 transition-colors duration-300 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:border-[#F97316]/50"
              >
                {isExpanded ? "Read Less" : "Read More"}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Expandable About section content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-base md:text-lg border-t border-white/20 pt-6 mt-4 space-y-4"
                  >
                    <p>
                      <strong>Our Mission:</strong> To transform Africa's urban
                      landscape through innovative construction and
                      infrastructure solutions that are sustainable,
                      intelligent, and community-focused.
                    </p>
                    <p>
                      <strong>Our Expertise:</strong> From power infrastructure
                      and smart cities to residential developments and
                      commercial complexes, we bring international standards to
                      every project while supporting local communities and
                      economies.
                    </p>
                    <p>
                      <strong>Global Reach, Local Impact:</strong> Our
                      Pan-African presence, combined with offices in London and
                      New York, enables us to deliver world-class projects that
                      truly understand and serve African needs.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Updated CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Button
              onClick={handleExploreProjects}
              className="bg-[#F7931E] hover:bg-[#F7931E]/90 text-white py-6 px-8 rounded-md text-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Explore Our Projects
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center"
          >
            <motion.span
              className="text-white/60 text-sm mb-2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Discover More
            </motion.span>
            <ChevronDown
              size={32}
              className="text-white/70 hover:text-white transition-colors"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
