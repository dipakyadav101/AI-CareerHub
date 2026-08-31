import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  MicOff,
  Volume2,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  FileText,
} from "lucide-react";
import "./VoiceInterview.css";

function VoiceInterview() {
  const [interviewType, setInterviewType] = useState("Technical");
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const finalTranscriptRef = useRef("");

  const currentQuestion = questions[questionIndex];

  // =========================================================
  // LOAD SAVED RESUME
  // =========================================================

  useEffect(() => {
    const savedResume = localStorage.getItem("aiCareerHubResume");

    if (savedResume) {
      try {
        const parsedResume = JSON.parse(savedResume);
        setResumeInfo(parsedResume);
      } catch (error) {
        console.error("Unable to read saved resume:", error);
      }
    }
  }, []);

  // =========================================================
  // GENERATE RESUME-BASED QUESTIONS
  // =========================================================

   const generateResumeQuestions = (resumeText, type, analysisInfo) => {
    const text = resumeText || "";
    const cleanText = text.replace(/\s+/g, " ").trim();

    if (!cleanText) {
      return [
        "Please introduce yourself and explain your educational and professional background.",
      ];
    }

    const lowerText = cleanText.toLowerCase();

    // -------------------------------------------------------
    // Break resume into meaningful sentences/lines
    // (actual content, not just keyword flags)
    // -------------------------------------------------------
    const sentences = cleanText
      .split(/[.!?\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25 && s.length < 250);

    const findSentenceWithKeyword = (keywords) => {
      return sentences.find((sentence) =>
        keywords.some((keyword) =>
          sentence.toLowerCase().includes(keyword)
        )
      );
    };

    const questions = [];

    // 1. Introduction (always)
    questions.push(
      "Please introduce yourself and briefly explain your background based on your resume."
    );

    // 2. EDUCATION - use actual line if found
    const educationLine = findSentenceWithKeyword([
      "bachelor", "master", "diploma", "b.ed", "m.ed", "bsc", "msc",
      "bba", "mba", "bca", "mca", "college", "university", "school",
    ]);

    if (educationLine) {
      questions.push(
        `Your resume mentions: "${educationLine.slice(0, 160)}". Can you elaborate on this part of your education?`
      );
    }

    // 3. EXPERIENCE - use actual line if found
    const experienceLine = findSentenceWithKeyword([
      "worked", "responsible for", "employment", "job", "role",
      "position", "company", "organization",
    ]);

    if (experienceLine) {
      questions.push(
        `You mentioned: "${experienceLine.slice(0, 160)}". Can you describe this experience in more detail, including what you achieved?`
      );
    }

    // 4. INTERNSHIP
    const internshipLine = findSentenceWithKeyword(["internship", "intern"]);
    if (internshipLine) {
      questions.push(
        `Regarding your internship — "${internshipLine.slice(0, 160)}" — what were your key responsibilities and takeaways?`
      );
    }

    // 5. PROJECTS - use actual project line(s), up to 2 different ones
    const projectSentences = sentences.filter((sentence) =>
      ["project", "developed", "built", "designed", "implemented"].some(
        (keyword) => sentence.toLowerCase().includes(keyword)
      )
    );

    if (projectSentences[0]) {
      questions.push(
        `Your resume states: "${projectSentences[0].slice(0, 160)}". Can you walk me through this project — your role, challenges, and outcome?`
      );
    }

    if (projectSentences[1] && projectSentences[1] !== projectSentences[0]) {
      questions.push(
        `You also mention: "${projectSentences[1].slice(0, 160)}". What was different or challenging about this one?`
      );
    }

    // 6. SKILLS - use ACTUAL detected skills, not generic
    const foundSkills = analysisInfo?.foundSkills || [];

    if (foundSkills.length > 0) {
      const skillList = foundSkills.slice(0, 4).join(", ");
      questions.push(
        `Your resume shows experience with ${skillList}. Which of these are you most confident in, and can you give a real example of using it?`
      );

      if (foundSkills.length > 1) {
        const skillA = foundSkills[0];
        const skillB = foundSkills[Math.min(1, foundSkills.length - 1)];
        questions.push(
          `How have you used ${skillA} and ${skillB} together in any project or work you've done?`
        );
      }
    }

    // 7. CERTIFICATIONS - actual line
    const certLine = findSentenceWithKeyword([
      "certification", "certificate", "training", "workshop",
    ]);
    if (certLine) {
      questions.push(
        `You listed: "${certLine.slice(0, 160)}". How has this certification/training helped you in practice?`
      );
    }

    // 8. ACHIEVEMENTS - actual line
    const achievementLine = findSentenceWithKeyword([
      "award", "achievement", "honor", "scholarship", "winner", "competition",
    ]);
    if (achievementLine) {
      questions.push(
        `Your resume mentions: "${achievementLine.slice(0, 160)}". Can you tell me more about this achievement?`
      );
    }

    // 9. Career goals (always, but tie to domain if known)
    const domain = analysisInfo?.domain;
    if (domain) {
      questions.push(
        `Based on your background in ${domain}, where do you see your career heading in the next few years?`
      );
    } else {
      questions.push(
        "What are your career goals, and how does your background in the resume support those goals?"
      );
    }

    // 10. Strength / challenge / teamwork (always, kept general)
    questions.push(
      "What is your greatest professional strength, based on the experience and skills shown in your resume?"
    );

    questions.push(
      "Tell me about a difficult problem or challenge you faced during your studies, work, or project and how you solved it."
    );

    questions.push(
      "Tell me about a time when you worked with a team. What was your role and what did you contribute?"
    );

    // 11. Interview-type specific
    if (type === "Technical") {
      questions.push(
        foundSkills.length > 0
          ? `Explain a technical problem you solved using ${foundSkills[0]}.`
          : "Explain a technical problem you solved related to your field."
      );
    }

    if (type === "HR") {
      questions.push(
        "Why should an employer select you based on your education, skills, and experience?"
      );
    }

    if (type === "Behavioral") {
      questions.push(
        "Tell me about a time when you made a mistake and explain what you learned from it."
      );
    }

    // 12. Fallback resume-content question if nothing specific was found above
    if (questions.length <= 5 && sentences.length > 0) {
      questions.push(
        `Your resume states: "${sentences[0].slice(0, 180)}". Can you explain this in more detail?`
      );
    }

    return [...new Set(questions)];
  };

  // =========================================================
  // SPEECH RECOGNITION
  // =========================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = function (event) {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
      }

      const combinedText =
        finalTranscriptRef.current + interimTranscript;

      setAnswer(combinedText.trim());
    };

    recognition.onend = function () {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.log("Recognition restart skipped.");
        }
      }
    };

    recognition.onerror = function (event) {
      console.log(
        "Speech recognition error:",
        event.error
      );

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        isListeningRef.current = false;
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return function () {
      isListeningRef.current = false;

      try {
        recognition.stop();
      } catch (error) {
        console.log("Recognition already stopped.");
      }
    };
  }, []);

  // =========================================================
  // SPEAK QUESTION
  // =========================================================

  const speakQuestion = (question) => {
    if (!question) {
      return;
    }

    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(question);

    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // =========================================================
  // START INTERVIEW
  // =========================================================

  const startInterview = () => {
    const savedResume =
      localStorage.getItem("aiCareerHubResume");

    let resumeText = "";

    if (savedResume) {
      try {
        const parsedResume = JSON.parse(savedResume);

        resumeText = parsedResume.resumeText || "";

        setResumeInfo(parsedResume);
      } catch (error) {
        console.error(
          "Unable to read resume:",
          error
        );
      }
    }

    if (!resumeText.trim()) {
      const savedText =
        localStorage.getItem(
          "aiCareerHubResumeText"
        );

      resumeText = savedText || "";
    }

    if (!resumeText.trim()) {
      alert(
        "Please upload and analyze your resume first."
      );
      return;
    }

        const savedAnalysis = localStorage.getItem("aiCareerHubResumeAnalysis");
    let analysisInfo = null;

    if (savedAnalysis) {
      try {
        analysisInfo = JSON.parse(savedAnalysis);
      } catch (error) {
        console.error("Unable to read resume analysis:", error);
      }
    }

    const generatedQuestions =
      generateResumeQuestions(
        resumeText,
        interviewType,
        analysisInfo
      );

    if (generatedQuestions.length === 0) {
      alert(
        "Unable to generate interview questions from this resume."
      );
      return;
    }

    setQuestions(generatedQuestions);
    setQuestionIndex(0);
    setAnswer("");
    setAnswers([]);
    setIsFinished(false);
    setIsInterviewStarted(true);

    finalTranscriptRef.current = "";

    setTimeout(function () {
      speakQuestion(generatedQuestions[0]);
    }, 500);
  };

  // =========================================================
  // START MICROPHONE
  // =========================================================

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    finalTranscriptRef.current = "";
    setAnswer("");

    isListeningRef.current = true;
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log(
        "Speech recognition already running."
      );
    }
  };

  // =========================================================
  // STOP MICROPHONE
  // =========================================================

  const stopListening = () => {
    isListeningRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(
          "Recognition already stopped."
        );
      }
    }

    setIsListening(false);
  };

  // =========================================================
  // ANSWER SCORE
  // =========================================================

  const calculateAnswerScore = (
    question,
    answerText
  ) => {
    const answerTextLower =
      answerText.toLowerCase().trim();

    if (!answerTextLower) {
      return 0;
    }

    let score = 0;

    // Answer length
    if (answerTextLower.length >= 40) {
      score += 15;
    }

    if (answerTextLower.length >= 80) {
      score += 10;
    }

    if (answerTextLower.length >= 150) {
      score += 10;
    }

    // General quality words
    const qualityWords = [
      "because",
      "experience",
      "project",
      "used",
      "developed",
      "implemented",
      "created",
      "worked",
      "learned",
      "solved",
      "problem",
      "solution",
      "result",
      "responsibility",
      "knowledge",
      "skill",
      "team",
      "improved",
      "managed",
      "achieved",
    ];

    const matchedWords =
      qualityWords.filter((word) =>
        answerTextLower.includes(word)
      ).length;

    score += Math.min(
      matchedWords * 3,
      25
    );

    // Question relevance
    const questionWords = question
      .toLowerCase()
      .split(/\s+/)
      .map((word) =>
        word.replace(/[^a-z0-9]/g, "")
      )
      .filter((word) => word.length > 4);

    const relevantWords =
      questionWords.filter((word) =>
        answerTextLower.includes(word)
      ).length;

    if (relevantWords >= 1) {
      score += 10;
    }

    if (relevantWords >= 2) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const nextQuestion = () => {
    if (!answer.trim()) {
      alert(
        "Please answer the question before continuing."
      );
      return;
    }

    if (isListeningRef.current) {
      stopListening();
    }

    const updatedAnswers = [
      ...answers,
      {
        question: currentQuestion,
        answer: answer.trim(),
      },
    ];

    setAnswers(updatedAnswers);

    if (
      questionIndex <
      questions.length - 1
    ) {
      const nextIndex =
        questionIndex + 1;

      setQuestionIndex(nextIndex);
      setAnswer("");

      finalTranscriptRef.current = "";

      setTimeout(function () {
        speakQuestion(
          questions[nextIndex]
        );
      }, 400);
    } else {
      const finalAnswers =
        updatedAnswers;

      const answerScores =
        finalAnswers.map((item) =>
          calculateAnswerScore(
            item.question,
            item.answer
          )
        );

      const overallScore =
        answerScores.length > 0
          ? Math.round(
              answerScores.reduce(
                (total, score) =>
                  total + score,
                0
              ) /
                answerScores.length
            )
          : 0;
      localStorage.setItem(
        "aiCareerHubInterviewScore",
        String(overallScore)
      );

      // Also send to backend (best-effort — don't block the UI if it fails)
      (async () => {
        try {
          const token = localStorage.getItem("aiCareerHubToken");

          await fetch("http://127.0.0.1:8000/api/interview/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              interview_type: interviewType,
              questions_and_answers: finalAnswers,
              overall_score: overallScore,
              total_questions: questions.length,
              answered_questions: finalAnswers.length,
            }),
          });
        } catch (error) {
          console.error("Failed to save interview to backend:", error);
        }
      })();

      setAnswers(finalAnswers);
      setIsFinished(true);

      window.speechSynthesis.cancel();
    }
  };
  // =========================================================
  // RESTART INTERVIEW
  // =========================================================

  const restartInterview = () => {
    window.speechSynthesis.cancel();

    isListeningRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(
          "Recognition already stopped."
        );
      }
    }

    setQuestionIndex(0);
    setAnswer("");
    setAnswers([]);
    setQuestions([]);
    setIsFinished(false);
    setIsInterviewStarted(false);
    setIsListening(false);

    finalTranscriptRef.current = "";
  };

  // =========================================================
  // SETUP SCREEN
  // =========================================================

  if (!isInterviewStarted) {
    return (
      <div className="voice-interview-page">
        <div className="voice-interview-card setup-card">

          <Link
            to="/student/dashboard"
            className="back-link"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="voice-icon">
            <Volume2 size={32} />
          </div>

          <h1>AI Voice Interview</h1>

          {resumeInfo ? (
            <div
              style={{
                margin: "15px auto",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "#f0edff",
                color: "#5b4bdb",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <FileText size={17} />

              Resume loaded:{" "}
              {resumeInfo.fileName ||
                "Resume"}
            </div>
          ) : (
            <p>
              Please upload and analyze your
              resume before starting the AI
              interview.
            </p>
          )}

          <p>
            The AI interviewer will read your
            resume and ask questions based on
            your education, experience, projects,
            skills, achievements, and background.
          </p>

          <div className="interview-type-section">
            <h3>
              Select Interview Type
            </h3>

            <div className="interview-type-options">
              {[
                "Technical",
                "HR",
                "Behavioral",
              ].map(function (type) {
                return (
                  <button
                    key={type}
                    className={
                      interviewType === type
                        ? "type-button active"
                        : "type-button"
                    }
                    onClick={function () {
                      setInterviewType(
                        type
                      );
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="start-interview-button"
            onClick={startInterview}
          >
            <Mic size={20} />
            Start AI Interview
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // FINISHED SCREEN
  // =========================================================

  if (isFinished) {
    const totalQuestions =
      questions.length;

    const answeredQuestions =
      answers.length;

    const averageAnswerLength =
      answeredQuestions > 0
        ? Math.round(
            answers.reduce(
              (total, item) =>
                total +
                item.answer.length,
              0
            ) /
              answeredQuestions
          )
        : 0;

    const savedInterviewScore =
      localStorage.getItem(
        "aiCareerHubInterviewScore"
      );

    const overallScore =
      savedInterviewScore
        ? Number(
            savedInterviewScore
          )
        : 0;

    const getScoreMessage = () => {
      if (overallScore >= 85) {
        return "Excellent Interview";
      }

      if (overallScore >= 70) {
        return "Good Interview";
      }

      if (overallScore >= 50) {
        return "Average Interview";
      }

      return "Needs Improvement";
    };

    const getFeedback = () => {
      if (overallScore >= 85) {
        return "Excellent effort. Your answers were detailed and relevant to the interview questions.";
      }

      if (overallScore >= 70) {
        return "Good performance. Try to make your answers more detailed and include practical examples.";
      }

      if (overallScore >= 50) {
        return "You completed the interview, but your answers could be more specific and detailed.";
      }

      return "Keep practicing. Focus on giving clear, structured, and relevant answers.";
    };

    return (
      <div className="voice-interview-page">
        <div className="voice-interview-card result-card">

          <CheckCircle
            size={60}
            className="success-icon"
          />

          <span className="question-label">
            AI INTERVIEW RESULT
          </span>

          <h1>
            Interview Completed
          </h1>

          <p>
            You completed your{" "}
            <strong>
              {interviewType}
            </strong>{" "}
            interview successfully.
          </p>

          {/* Overall Score */}

          <div className="result-score-box">

            <div className="result-score-circle">
              <strong>
                {overallScore}%
              </strong>

              <span>
                Score
              </span>
            </div>

            <div className="result-score-info">

              <span className="score-label">
                OVERALL PERFORMANCE
              </span>

              <h2>
                {getScoreMessage()}
              </h2>

              <p>
                {getFeedback()}
              </p>

            </div>
          </div>

          {/* Result Summary */}

          <div className="result-summary">

            <div>
              <strong>
                {answeredQuestions}
              </strong>

              <span>
                Questions Answered
              </span>
            </div>

            <div>
              <strong>
                {totalQuestions}
              </strong>

              <span>
                Total Questions
              </span>
            </div>

            <div>
              <strong>
                {interviewType}
              </strong>

              <span>
                Interview Type
              </span>
            </div>

          </div>

          {/* Performance Areas */}

          <div className="result-feedback-grid">

            <div className="result-feedback-card">

              <CheckCircle size={22} />

              <h3>
                Strength
              </h3>

              <p>
                You completed the interview
                and provided answers based
                on your uploaded resume.
              </p>

            </div>

            <div className="result-feedback-card">

              <FileText size={22} />

              <h3>
                Answer Quality
              </h3>

              <p>
                Average answer length:
                <strong>
                  {" "}
                  {averageAnswerLength}
                  {" "}characters
                </strong>
              </p>

            </div>

            <div className="result-feedback-card">

              <Mic size={22} />

              <h3>
                Communication
              </h3>

              <p>
                Continue practicing clear,
                confident, and structured
                answers during interviews.
              </p>

            </div>

          </div>

          <p className="result-note">
            Questions were generated from
            your uploaded resume and your
            selected{" "}
            {interviewType} interview type.
          </p>

          {/* Actions */}

          <div className="result-actions">

            <button
              className="start-interview-button"
              onClick={
                restartInterview
              }
            >
              <RotateCcw size={18} />

              Start Again
            </button>

            <Link
              to="/student/dashboard"
              className="dashboard-link"
            >
              Back to Dashboard
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // INTERVIEW SCREEN
  // =========================================================

  return (
    <div className="voice-interview-page">

      <div className="voice-interview-card interview-card">

        <div className="interview-topbar">

          <Link
            to="/student/dashboard"
            className="back-link"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <span className="interview-progress">
            Question{" "}
            {questionIndex + 1}
            {" "} / {" "}
            {questions.length}
          </span>

        </div>

        <div className="question-section">

          <span className="question-label">
            AI Interviewer
          </span>

          <h1>
            {currentQuestion}
          </h1>

          <button
            className="speak-question-button"
            onClick={function () {
              speakQuestion(
                currentQuestion
              );
            }}
          >
            <Volume2 size={18} />

            Hear Question
          </button>

        </div>

        <div className="answer-section">

          <label>
            Your Answer
          </label>

          <textarea
            value={answer}
            onChange={function (
              event
            ) {
              setAnswer(
                event.target.value
              );

              finalTranscriptRef.current =
                event.target.value;
            }}
            placeholder="Your spoken answer will appear here..."
            rows={6}
          />

          <div className="voice-controls">

            {!isListening ? (
              <button
                className="mic-button"
                onClick={
                  startListening
                }
              >
                <Mic size={22} />

                Start Speaking
              </button>
            ) : (
              <button
                className="mic-button listening"
                onClick={
                  stopListening
                }
              >
                <MicOff size={22} />

                Stop Speaking
              </button>
            )}

            <span className="voice-status">
              {isListening
                ? " Listening... Speak your answer."
                : "Click the microphone and speak your answer."}
            </span>

          </div>

        </div>

        <div className="interview-footer">

          <span>
            {answer.trim().length >
            0
              ? "Answer recorded ✓"
              : "Waiting for your answer"}
          </span>

          <button
            className="next-question-button"
            onClick={
              nextQuestion
            }
          >
            {questionIndex ===
            questions.length - 1
              ? "Finish Interview"
              : "Next Question"}

            <ArrowRight size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default VoiceInterview;