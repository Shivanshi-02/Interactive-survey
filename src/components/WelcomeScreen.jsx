import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.12 } },
};
const itemVariants = { hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export default function WelcomeScreen({ onStart, score = 0, xp = 0, achievements = [] }) {
  return (
    <div className="flex w-full items-center justify-center font-sans relative overflow-hidden">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-20 flex flex-col items-center gap-8 p-6 w-full">
        <div className="bg-black/50 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center text-white border border-purple-500/20">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-3 text-cyan-300">Welcome to our Survey!</motion.h1>
          <motion.p variants={itemVariants} className="text-gray-300 mb-6">
            Quick, slick, and a little competitive — earn points and unlock badges as you complete the survey.
          </motion.p>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-xl font-extrabold text-white">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">XP</div>
              <div className="text-xl font-extrabold text-white">{xp}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Badges</div>
              <div className="text-xl font-extrabold text-white">{achievements.length}</div>
            </div>
          </div>

          <motion.button
            variants={itemVariants}
            onClick={onStart}
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-[#03131a] font-bold py-3 px-8 rounded-full shadow-lg hover:opacity-95"
            whileTap={{ scale: 0.98 }}
          >
            Start Survey — Earn Points
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

