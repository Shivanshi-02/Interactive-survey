import React, { useState, useEffect } from "react";

export default function QuestionScreen({
  question,
  questionsLength,
  currentQuestionIndex,
  answers,
  handleAnswer,
  questionStartTime
}) {
  const progress = Math.round(((currentQuestionIndex + 1) / questionsLength) * 100);
  const [selectedAnswer, setSelectedAnswer] = useState(answers[question.id] || null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setSelectedAnswer(answers[question.id] || null);
    setElapsed(0);
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - (questionStartTime || Date.now())) / 1000)), 400);
    return () => clearInterval(iv);
  }, [question.id, answers, questionStartTime]);

  const handleMultipleChoiceClick = (option) => {
    setSelectedAnswer(option);
    handleAnswer(option);
  };

  const isQ11 = question.id === "q11" || currentQuestionIndex === 10;
  const quickHint = elapsed < 10 ? <div className="text-sm text-green-500">Quick bonus active (+5 pts)</div> : <div className="text-sm text-gray-400">No bonus</div>;

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center text-gray-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questionsLength}</span>
          <span className="font-semibold text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-cyan-400 to-orange-400 h-2.5 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded-full">Question {currentQuestionIndex + 1}</span>
            <div className="text-right">
              <div className="text-xs text-gray-400">Quick time</div>
              <div className="text-sm font-semibold">{elapsed}s</div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6">{question.text}</h2>

          {quickHint}

          {question.type === "multiple-choice" && (
            <div className="space-y-4 mt-4">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMultipleChoiceClick(option)}
                  className={`w-full text-left py-3 px-6 rounded-lg border-2 transition-colors duration-200 flex items-center ${selectedAnswer === option ? 'bg-cyan-100 border-cyan-400' : 'border-gray-300 hover:bg-gray-100'}`}
                >
                  <span className={`flex items-center justify-center h-8 w-8 rounded-full border-2 text-sm mr-4 ${selectedAnswer === option ? 'border-cyan-400 text-cyan-800 font-semibold' : 'border-gray-400 text-gray-600 font-semibold'}`}>{String.fromCharCode(65 + idx)}</span>
                  <span className={`font-medium ${selectedAnswer === option ? 'text-cyan-800' : 'text-gray-800'}`}>{option}</span>
                </button>
              ))}
            </div>
          )}

          {question.type === "text" && (
            <div className="mt-4">
              <textarea
                className="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-cyan-400 transition-colors duration-200"
                rows="4"
                placeholder={question.placeholder || 'Your answer...'}
                value={answers[question.id] || ''}
                onChange={(e) => {
                  const v = e.target.value;
                  // keep parent answers updated locally only when needed — pass on submit below
                  // but we keep local update for UI here (if you prefer saving every keystroke, call a handler)
                  // we will call handleAnswer on submit below
                }}
              />
              <div className="flex justify-end mt-3">
                {/* If Q11 -> make the submit full-width like textarea */}
                {isQ11 ? (
                  <button
                    onClick={() => handleAnswer(answers[question.id] || '')}
                    className="w-full py-3 px-4 bg-cyan-500 text-white rounded-lg font-semibold"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={() => handleAnswer(answers[question.id] || '')}
                    className="bg-cyan-500 text-white py-2 px-4 rounded-lg"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
