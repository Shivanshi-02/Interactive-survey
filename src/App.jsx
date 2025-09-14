import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import SurveyComplete from "./components/SurveyComplete.jsx";
import ResponsesPage from "./components/ResponsesPage.jsx";
import surveyQuestions from "./data/questions.json";

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showResponses, setShowResponses] = useState(false);


  const handleStart = () => {
    setStarted(true);
    setSurveyCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResponses(false);
  };
  
 
  const handleAnswer = (answer) => {
    const question = surveyQuestions[currentQuestionIndex];
    const updatedAnswers = {
      ...answers,
      [question.id]: answer
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStarted(false); 
      setSurveyCompleted(true);
      console.log("Survey Completed! Answers:", updatedAnswers);
    }
  };

  const handleTakeSurveyAgain = () => {
    setSurveyCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResponses(false);
  };

  const handleViewResponses = () => {
    setShowResponses(true);
  };

  const handleGoBackFromResponses = () => {
    setShowResponses(false);
  };


  const renderContent = () => {
    if (!started) {
      if (surveyCompleted) {
        if (showResponses) {
          return (
            <ResponsesPage
              questions={surveyQuestions}
              answers={answers}
              onGoBack={handleGoBackFromResponses}
              onStartNewSurvey={handleTakeSurveyAgain}
            />
          );
        } else {
          return (
            <SurveyComplete
              onTakeSurveyAgain={handleTakeSurveyAgain}
              onViewResponses={handleViewResponses}
            />
          );
        }
      } else {
        return <WelcomeScreen onStart={handleStart} />;
      }
    } else {
      const question = surveyQuestions[currentQuestionIndex];
      return (
        <QuestionCard
          question={question}
          questionsLength={surveyQuestions.length}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          handleAnswer={handleAnswer}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
