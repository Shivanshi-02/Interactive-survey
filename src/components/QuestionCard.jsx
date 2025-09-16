import React, { useState, useEffect } from "react";

export default function QuestionCard({
  question,
  questionsLength,
  currentQuestionIndex,
  answers,
  handleAnswer,
  questionStartTime // optional prop used elsewhere
}) {
  const [textAnswer, setTextAnswer] = useState(answers[question.id] || "");
  const [selectedAnswer, setSelectedAnswer] = useState(answers[question.id] || null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setTextAnswer(answers[question.id] || "");
    setSelectedAnswer(answers[question.id] || null);
    // timer for UI hints
    setElapsed(0);
    const iv = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - (questionStartTime || Date.now())) / 1000)));
    }, 500);
    return () => clearInterval(iv);
  }, [question.id, answers, questionStartTime]);

  const handleMultipleChoiceClick = (option) => {
    setSelectedAnswer(option);
    handleAnswer(option);
  };

  const isQ11 = question.id === "q11" || currentQuestionIndex === 10;

  const renderQuestion = () => {
    if (question.type === "multiple-choice" || question.type === "mcq") {
      return (
        <div className="space-y-4">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleMultipleChoiceClick(option)}
              className={`w-full text-left py-3 px-6 rounded-lg border-2 transition-colors duration-200 flex items-center ${
                selectedAnswer === option ? "bg-cyan-100 border-cyan-400" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <span
                className={`flex items-center justify-center h-8 w-8 rounded-full border-2 text-sm mr-4 ${
                  selectedAnswer === option ? "border-cyan-400 text-cyan-800 font-semibold" : "border-gray-400 text-gray-600 font-semibold"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={`font-medium ${selectedAnswer === option ? "text-cyan-800" : "text-gray-800"}`}>
                {option}
              </span>
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
            placeholder={question.placeholder || "Type your answer..."}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
          />
          {/* If this is Q11 (by id or index) make the submit button full width like the textarea */}
          {isQ11 ? (
            <button
              onClick={() => handleAnswer(textAnswer)}
              className="w-full py-3 px-6 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors duration-200"
            >
              Submit
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(textAnswer)}
                className="flex-1 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors duration-200"
              >
                Submit
              </button>
              <button
                onClick={() => setTextAnswer("")}
                className="py-3 px-4 bg-white/10 text-white rounded-lg"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // small quick-answer hint
  const showQuickHint = (elapsedSec) =>
    elapsedSec < 10 ? <div className="text-sm text-green-500">Quick bonus active — answer within 10s for +5 pts</div> : <div className="text-sm text-gray-400">Answer normally</div>;

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center text-gray-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questionsLength}</span>
          <span className="font-semibold text-gray-700">{Math.round(((currentQuestionIndex + 1) / questionsLength) * 100)}%</span>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded-full">Q {currentQuestionIndex + 1}</span>
            <div className="text-right">
              <div className="text-xs text-gray-400">Time</div>
              <div className="text-sm font-semibold">{elapsed}s</div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">{question.text}</h2>

          <div className="mb-4">{showQuickHint(elapsed)}</div>

          {renderQuestion()}
        </div>
      </div>
    </>
  );
}



