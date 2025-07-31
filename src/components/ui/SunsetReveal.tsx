import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface SunsetRevealProps {
  children: React.ReactNode;
  panels?: {
    id: string;
    content: React.ReactNode;
    backgroundColor: string;
    height: string;
  }[];
}

const defaultPanels = [
  {
    id: 'panel-1',
    content: 'PREMIUM',
    backgroundColor: 'linear-gradient(135deg, #7C5841 0%, #AA7452 100%)',
    height: '150px',
  },
  {
    id: 'panel-2', 
    content: 'SERVICES',
    backgroundColor: 'linear-gradient(135deg, #051822 0%, #2D383E 100%)',
    height: '200px',
  },
  {
    id: 'panel-3',
    content: 'EXPERIENCE',
    backgroundColor: 'linear-gradient(135deg, #AA7452 0%, #D4C9C7 100%)',
    height: '120px',
  },
  {
    id: 'panel-4',
    content: 'INNOVATION',
    backgroundColor: 'linear-gradient(135deg, #2D383E 0%, #7C5841 100%)',
    height: '180px',
  },
  {
    id: 'panel-5',
    content: 'EXCELLENCE',
    backgroundColor: 'linear-gradient(135deg, #051822 0%, #AA7452 100%)',
    height: '140px',
  },
];

export default function SunsetReveal({ children, panels = defaultPanels }: SunsetRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const isInView = useInView(containerRef, { 
    once: true, 
    margin: "-20%" 
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end start"],
  });

  // Transform values for the reveal animation
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)", 
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    ]
  );

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const panelVariants = {
    hidden: { 
      y: 100,
      opacity: 0,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
    },
    visible: { 
      y: 0,
      opacity: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        clipPath: {
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }
      }
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Layered Panels */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        variants={containerVariants}
        initial="hidden"
        animate={isRevealed ? "visible" : "hidden"}
      >
        {panels.map((panel, index) => {
          const isEven = index % 2 === 0;
          const offsetX = isEven ? '-10%' : '10%';
          const width = isEven ? '60%' : '50%';
          const left = isEven ? '0%' : '50%';
          
          return (
            <motion.div
              key={panel.id}
              variants={panelVariants}
              className="absolute flex items-center justify-center text-white font-bold overflow-hidden sunset-panel"
              style={{
                background: panel.backgroundColor,
                height: panel.height,
                width,
                left,
                top: `${index * 12 + 10}%`,
                borderRadius: isEven ? '0 16px 16px 0' : '16px 0 0 16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transform: `translateX(${offsetX})`,
                willChange: 'transform, opacity',
              }}
            >
              <motion.div
                className="text-2xl md:text-4xl lg:text-5xl font-black tracking-wider sunset-content"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  fontFamily: "'Inter', sans-serif",
                  userSelect: 'none',
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isRevealed ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ 
                  delay: index * 0.15 + 0.5,
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                {panel.content}
              </motion.div>
              
              {/* Subtle overlay gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                initial={{ x: '-100%', opacity: 0 }}
                animate={isRevealed ? { x: '100%', opacity: 0.1 } : { x: '-100%', opacity: 0 }}
                transition={{
                  delay: index * 0.15 + 1,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Content Behind Panels */}
      <motion.div
        className="relative z-0"
        style={{ clipPath }}
      >
        {children}
      </motion.div>

      {/* Background overlay that provides depth */}
      <motion.div
        className="absolute inset-0 z-5 bg-gradient-to-b from-transparent via-black/10 to-black/20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2 }}
      />
    </div>
  );
}