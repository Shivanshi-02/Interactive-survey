import React from 'react';

export default function ResponsesPage({ questions, answers, onGoBack, onStartNewSurvey, score=0, xp=0, achievements=[] }) {
  const currentDate = new Date().toLocaleDateString('en-US', { month:'numeric', day:'numeric', year:'numeric' });

  const getAnswerText = (question, answer) => {
    if (!answer) return "No answer provided";
    if (question.type === "multiple-choice" && question.options) {
      const selectedOption = question.options.find(opt => opt.value === answer || opt === answer);
      return selectedOption ? (selectedOption.text || selectedOption) : answer;
    }
    return answer;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Survey Responses</h2>
        <div className="text-right text-sm text-gray-300">
          <div>Score: <strong>{score}</strong></div>
          <div>XP: <strong>{xp}</strong></div>
        </div>
      </div>

      <p className="text-white mb-6">Review your answers from {currentDate}</p>

      <div className="space-y-6">
        {questions.map((question) => {
          const userAnswer = answers[question.id];
          const displayedAnswer = getAnswerText(question, userAnswer);
          const responseLabel = question.type === "multiple-choice" ? "Multiple Choice" : "Text Response";

          return (
            <div key={question.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {question.id}
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    {responseLabel}
                  </span>
                  <span className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">{question.text}</h3>
              <p className="text-gray-700 border-l-4 border-cyan-400 pl-4 py-1">{displayedAnswer}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-8 rounded-lg text-center" style={{ background: "linear-gradient(135deg, #fce38a 0%, #f38181 100%)" }}>
        <h3 className="text-2xl font-bold text-white mb-2">Thanks — you scored {score} points</h3>
        <p className="text-white text-sm opacity-90 mb-6">Your {questions.length} responses were recorded.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onStartNewSurvey} className="py-3 px-6 rounded-lg text-white font-semibold bg-gradient-to-r from-teal-500 to-orange-500">Start New Survey</button>
          <button onClick={onGoBack} className="py-3 px-6 rounded-lg text-black font-semibold bg-white/90">Back</button>
        </div>
      </div>
    </div>
  );
}
