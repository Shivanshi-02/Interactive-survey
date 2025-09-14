import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function SurveyComplete({ onTakeSurveyAgain, onViewResponses }) {
  const [showConfetti, setShowConfetti] = useState(true);

  // hide confetti
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleViewResponses = () => {
 
    onViewResponses();
  };

  return (
    <div className="text-center p-8 flex flex-col items-center">
      {showConfetti && <Confetti />}
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Survey Complete!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for taking the time to share your valuable feedback with us. Your responses help us improve our services.
      </p>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={handleViewResponses}
          className="flex items-center space-x-2 py-3 px-6 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
          </svg>
          <span>View My Responses</span>
        </button>
        <button
          onClick={onTakeSurveyAgain}
          className="flex items-center space-x-2 py-3 px-6 rounded-lg text-white font-semibold bg-gradient-to-r from-teal-500 to-orange-500 hover:opacity-90 transition-opacity duration-200"
        >
          <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.42 2a4.49 4.49 0 00-2.31 1.34L16 16.5m-8-8l-2 2-2-2m2 0V4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 00-2 2v2"></path>
          </svg>
          <span>Take Survey Again</span>
        </button>
      </div>
      <p className="text-gray-500 text-sm mt-4">
        Your responses are anonymous and will be used to improve our services.
      </p>
    </div>
  );
}