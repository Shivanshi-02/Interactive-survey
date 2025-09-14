import React from 'react';

export default function ResponsesPage({ questions, answers, onGoBack, onStartNewSurvey }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Survey Responses</h2>
        <button
          onClick={onGoBack}
          className="flex items-center space-x-2 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>
      <p className="text-gray-500 mb-6">Review your answers from {currentDate}</p>

      {/* List of responses */}
      <div className="space-y-6">
        {questions.map((question) => {
          const userAnswer = answers[question.id] || "No answer provided";
          const isMultipleChoice = question.type === "multiple-choice";
          const responseLabel = isMultipleChoice ? "Multiple Choice" : "Text Response";

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
              <p className="text-gray-700 border-l-4 border-cyan-400 pl-4 py-1">
                {userAnswer}
              </p>
            </div>
          );
        })}
      </div>

      {/* End of Responses section */}
      <div className="mt-10 p-8 rounded-lg text-center" style={{ background: "linear-gradient(135deg, #fce38a 0%, #f38181 100%)" }}>
        <h3 className="text-2xl font-bold text-white mb-2">Thank You For Your Feedback!</h3>
        <p className="text-white text-sm opacity-90 mb-6">
          Your {questions.length} responses have been recorded and will help us improve our services. We appreciate the time you took to complete this survey.
        </p>
        <button
          onClick={onStartNewSurvey}
          className="flex items-center justify-center mx-auto space-x-2 py-3 px-6 rounded-lg text-white font-semibold bg-gradient-to-r from-teal-500 to-orange-500 hover:opacity-90 transition-opacity duration-200"
        >
          <span>Start New Survey</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

