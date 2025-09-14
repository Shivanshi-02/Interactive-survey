import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import QuestionCard from "./components/QuestionCard.jsx"; 
import SurveyComplete from "./components/SurveyComplete.jsx"; 
import ResponsesPage from "./components/ResponsesPage.jsx";


const surveyQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    text: "How would you rate your overall experience with our product?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
  },
  {
    id: 2,
    type: "multiple-choice",
    text: "How likely are you to recommend our service to a friend or colleague?",
    options: ["Extremely likely", "Very likely", "Somewhat likely", "Not very likely", "Not at all likely"]
  },
  {
    id: 3,
    type: "multiple-choice",
    text: "Which feature do you find most valuable?",
    options: [
      "User-friendly interface",
      "Fast performance",
      "Comprehensive features",
      "Reliable customer support",
      "Competitive pricing"
    ]
  },
  {
    id: 4,
    type: "multiple-choice",
    text: "How often do you use our product?",
    options: ["Daily", "Several times a week", "Weekly", "Monthly", "Rarely"]
  },
  {
    id: 5,
    type: "multiple-choice",
    text: "What is your primary use case for our product?",
    options: [
      "Personal projects",
      "Small business",
      "Enterprise solutions",
      "Educational purposes",
      "Research and development"
    ]
  },
  {
    id: 6,
    type: "multiple-choice",
    text: "How satisfied are you with our customer support?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]
  },
  {
    id: 7,
    type: "multiple-choice",
    text: "Which improvement would you prioritize?",
    options: [
      "Better mobile experience",
      "More integrations",
      "Enhanced security",
      "Faster loading times",
      "More customization options"
    ]
  },
  {
    id: 8,
    type: "multiple-choice",
    text: "How did you first hear about our product?",
    options: ["Search engine", "Social media", "Word of mouth", "Online advertisement", "Industry publication"]
  },
  {
    id: 9,
    type: "multiple-choice",
    text: "What is your role in your organization?",
    options: ["Executive/C-level", "Manager/Director", "Individual contributor", "Student", "Consultant/Freelancer"]
  },
  {
    id: 10,
    type: "multiple-choice",
    text: "How would you describe the value for money of our product?",
    options: ["Excellent value", "Good value", "Fair value", "Poor value", "Very poor value"]
  },
  {
    id: 11,
    type: "text",
    text: "Please share any additional feedback or suggestions for improvement:",
    placeholder: "Your thoughts and suggestions are valuable to us..."
  }
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  // Function to start the survey from the welcome screen
  const handleStart = () => {
    setStarted(true);
    setSurveyCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResponses(false);
  };
  
  // This function will be passed to QuestionCard to handle user input
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
      setStarted(false); // To go back to welcome/complete screen
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

  // Conditional rendering for the entire app flow
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


