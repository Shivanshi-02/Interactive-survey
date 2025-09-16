import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, when: "beforeChildren", staggerChildren: 0.2 },
  },
};

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-full items-center justify-center font-sans relative bg-[#130E26] overflow-hidden">
      {/* Background bricks effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* ... (your brick animation code) */}
      </div>
      
      {/* The Glow dot animation that you want to persist */}
      <motion.div
        className="absolute top-8 left-8 w-4 h-4 rounded-full bg-white shadow-lg z-10"
        animate={{
          x: [0, window.innerWidth - 64, 0],
          y: [0, window.innerHeight - 64, 0],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      ></motion.div>

      {/* This is where your screen content will be rendered */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center p-4 h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}