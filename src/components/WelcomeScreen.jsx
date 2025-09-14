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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4 font-sans w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center mb-6"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold mb-4 text-gray-800"
        >
          Welcome to Our Survey
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-6 text-gray-600 leading-relaxed"
        >
          Your feedback matters to us. This survey will take about 5 minutes and
          help us improve our services.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center space-x-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-sm text-gray-500">11 Questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-sm text-gray-500">5 Minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-sm text-gray-500">Anonymous</span>
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          onClick={onStart}
          className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2 w-full max-w-xs mx-auto"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Start Survey</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}


