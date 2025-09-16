// src/components/SurveyComplete.jsx
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function SurveyComplete({
  onTakeSurveyAgain,
  onViewResponses,
  score = 0,
  xp = 0,
  achievements = [],
}) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    function onResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", onResize);

    // stop confetti after a bit
    const t = setTimeout(() => setShowConfetti(false), 8000);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  // Map known achievement ids to nicer label or short forms if needed
  const labelFor = (a) => {
    if (!a) return "";
    if (a.name) return a.name;
    if (a.id) {
      switch (a.id) {
        case "gold":
          return "Gold Contributor";
        case "silver":
          return "Silver Contributor";
        case "bronze":
          return "Bronze Contributor";
        default:
          return a.id;
      }
    }
    return String(a);
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={220}
        />
      )}

      <div className="min-h-screen w-full flex items-center justify-center px-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Survey Complete!
          </h2>

          <p className="text-gray-600 mb-4">
            Thank you for your feedback. You earned{" "}
            <strong className="text-gray-800">{score}</strong> points and{" "}
            <strong className="text-gray-800">{xp}</strong> XP.
          </p>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Achievements</h4>

            {/* Achievement area: responsive, wrapped pills */}
            <div
              className="mx-auto"
              style={{ maxWidth: 520 }}
            >
              {achievements.length === 0 ? (
                <div className="text-sm text-gray-400">No badges yet — keep going!</div>
              ) : (
                <div
                  className="flex flex-wrap justify-center gap-3"
                  style={{ maxHeight: 160, overflowY: "auto", padding: 6 }}
                >
                  {achievements.map((a, idx) => {
                    const label = labelFor(a);
                    return (
                      <div
                        key={a.id || idx}
                        title={label}
                        className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))",
                          color: "#02171A",
                          minWidth: 88,
                          maxWidth: 220,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {/* small icon circle */}
                        <div
                          style={{
                            minWidth: 28,
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(90deg, #06B6D4, #8B5CF6)",
                            color: "#02171A",
                            fontWeight: 900,
                            fontSize: 12,
                          }}
                        >
                          ✓
                        </div>

                        <div className="truncate" style={{ textAlign: "left" }}>
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onViewResponses}
              className="border border-blue-500 text-blue-500 rounded-full px-5 py-3 hover:bg-blue-50 transition"
            >
              View My Responses
            </button>

            <button
              onClick={onTakeSurveyAgain}
              className="bg-blue-500 text-white rounded-full px-5 py-3 hover:bg-blue-600 transition"
            >
              Take Survey Again
            </button>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Your responses are anonymous and will be used to improve our services.
          </p>
        </div>
      </div>
    </>
  );
}

