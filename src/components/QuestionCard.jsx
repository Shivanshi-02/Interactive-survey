import React, { useState } from "react";

export default function QuestionCard({
  question,
  questionsLength,
  currentQuestionIndex,
  answers,
  handleAnswer,
}) {
  const progress = Math.round(((currentQuestionIndex + 1) / questionsLength) * 100);
  const [textAnswer, setTextAnswer] = useState(answers[question.id] || '');

  const renderQuestion = () => {
    if (question.type === "multiple-choice") {
      return (
        <div className="space-y-4">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="w-full text-left py-3 px-6 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-200 flex items-center"
            >
              <span className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-400 text-gray-600 font-semibold text-sm mr-4">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-gray-800 font-medium">{option}</span>
            </button>
          ))}
        </div>
      );
    } else if (question.type === "text") {
      return (
        <div className="space-y-4">
          <textarea
            className="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
            rows="5"
            placeholder={question.placeholder}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
          ></textarea>
          <button
            onClick={() => handleAnswer(textAnswer)}
            className="w-full py-3 px-6 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors duration-200"
          >
            Submit
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center text-gray-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questionsLength}</span>
          <span className="font-semibold text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-cyan-400 to-orange-400 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between -mt-1.5">
          {Array.from({ length: questionsLength }).map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border-2 transform -translate-y-1 transition-all duration-300 ${
                i <= currentQuestionIndex ? "border-cyan-400" : "border-gray-200"
              } ${i === currentQuestionIndex ? "bg-cyan-400" : "bg-white"}`}
            ></div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-6 pt-4">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded-full">Question {currentQuestionIndex + 1}</span>
            <button onClick={() => alert("Close button clicked!")} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">{question.text}</h2>
          {renderQuestion()}
        </div>
      </div>
    </>
  );
}