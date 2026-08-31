import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  X,
} from "lucide-react";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

import "./ResumeAnalyzer.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/* ============================================================
 * Skill Keyword Banks (domain detection + missing skill suggestion)
 * ============================================================ */
const SKILL_BANKS = {
  IT: [
    "JavaScript", "Python", "Java", "React", "Node.js", "HTML", "CSS",
    "SQL", "Git", "GitHub", "REST API", "AWS", "Cloud", "Docker",
    "Machine Learning", "Data Structures", "Algorithms", "C++",
    "MongoDB", "TypeScript", "Testing", "CI/CD", "Agile", "API",
    "Django", "Express", "Next.js", "Kubernetes",
  ],
  Business: [
    "Leadership", "Project Management", "Communication",
    "Team Management", "Strategic Planning", "Marketing", "Sales",
    "Negotiation", "MS Excel", "Budgeting", "Analytics",
    "Stakeholder Management", "Business Development", "CRM",
  ],
  Finance: [
    "Accounting", "Bookkeeping", "Tally", "QuickBooks",
    "Financial Analysis", "Auditing", "Taxation", "Excel",
    "Reconciliation", "Budgeting", "GAAP", "Financial Reporting",
    "Cost Accounting", "Payroll",
  ],
  Health: [
    "Patient Care", "Clinical Skills", "Nursing", "First Aid",
    "Medical Records", "CPR", "Healthcare Management",
    "Pharmacology", "Vital Signs", "Diagnosis", "Medical Terminology",
  ],
  Civil: [
    "AutoCAD", "Civil 3D", "Structural Design", "Site Supervision",
    "Construction Management", "Surveying", "Project Estimation",
    "SAP2000", "Revit", "Quantity Surveying", "Building Codes",
  ],
};

const SOFT_SKILLS = [
  "Communication", "Leadership", "Teamwork", "Problem Solving",
  "Time Management", "Critical Thinking", "Adaptability",
  "Collaboration", "Creativity",
];

/* ============================================================
 * Section detection regex
 * ============================================================ */
const SECTION_PATTERNS = {
  summary: /\b(summary|objective|profile)\b/i,
  education: /\b(education|academic|qualification)\b/i,
  experience: /\b(experience|internship|work history|employment)\b/i,
  skills: /\b(skills|technical skills|competenc)\b/i,
  projects: /\b(project)\b/i,
  certifications: /\b(certificat|training|course)\b/i,
  contact: /[\w.+-]+@[\w-]+\.[\w.-]+/,
  phone: /(\+?\d[\d\s-]{7,}\d)/,
  numbers: /\b\d+%|\b\d{2,}\b/,
};

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  /* ---------------------------------------------------------
   * Extract text from a normal (text-based) PDF
   * --------------------------------------------------------- */
  const extractPdfText = async (selectedFile) => {
    const arrayBuffer = await selectedFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str || "")
        .join(" ");

      fullText += pageText + "\n";
    }

    return { text: fullText.trim(), pdf };
  };

  /* ---------------------------------------------------------
   * OCR fallback: render each PDF page to canvas and OCR it
   * (used when the PDF has no real text layer - scanned resume)
   * --------------------------------------------------------- */
  const extractPdfTextWithOcr = async (pdf) => {
    const worker = await createWorker("eng");

    let fullText = "";

    try {
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        setStatusText(
          `Reading scanned page ${pageNumber} of ${pdf.numPages}...`
        );

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");

        await page.render({ canvasContext: context, viewport }).promise;

        const dataUrl = canvas.toDataURL("image/png");

        const { data } = await worker.recognize(dataUrl);

        fullText += (data?.text || "") + "\n";
      }
    } finally {
      await worker.terminate();
    }

    return fullText.trim();
  };

  /* ---------------------------------------------------------
   * Extract text from DOCX
   * --------------------------------------------------------- */
  const extractDocxText = async (selectedFile) => {
    const arrayBuffer = await selectedFile.arrayBuffer();

    const result = await mammoth.extractRawText({ arrayBuffer });

    return result.value.trim();
  };

  /* ---------------------------------------------------------
   * Master extraction: picks the right method,
   * falls back to OCR automatically for scanned PDFs
   * --------------------------------------------------------- */
  const extractResumeText = async (selectedFile) => {
    const fileName = selectedFile.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      setStatusText("Reading PDF text...");

      const { text, pdf } = await extractPdfText(selectedFile);

      if (text && text.length >= 30) {
        return text;
      }

      // No usable text layer found -> likely a scanned/image PDF
      setStatusText("No text layer found. Running OCR...");
      const ocrText = await extractPdfTextWithOcr(pdf);
      return ocrText;
    }

    if (fileName.endsWith(".docx")) {
      setStatusText("Reading DOCX text...");
      return await extractDocxText(selectedFile);
    }

    if (fileName.endsWith(".doc")) {
      throw new Error(
        "Old .doc files are not supported directly. Please save the resume as .docx or PDF."
      );
    }

    throw new Error("Unsupported resume format.");
  };

  /* ---------------------------------------------------------
   * Analyze resume text -> ATS score, strengths,
   * missing skills, suggestions (dynamic, not hard-coded)
   * --------------------------------------------------------- */
  const analyzeResumeText = (resumeText) => {
    const text = resumeText.toLowerCase();
    const wordCount = resumeText.trim().split(/\s+/).length;

    // 1. Detect which domain this resume belongs to
    let bestDomain = "IT";
    let bestMatchCount = -1;
    const foundSkillsByDomain = {};

    Object.entries(SKILL_BANKS).forEach(([domain, skills]) => {
      const found = skills.filter((skill) =>
        text.includes(skill.toLowerCase())
      );
      foundSkillsByDomain[domain] = found;

      if (found.length > bestMatchCount) {
        bestMatchCount = found.length;
        bestDomain = domain;
      }
    });

    const domainSkills = SKILL_BANKS[bestDomain];
    const foundSkills = foundSkillsByDomain[bestDomain];
    const missingSkills = domainSkills.filter(
      (skill) => !foundSkills.includes(skill)
    );

    const foundSoftSkills = SOFT_SKILLS.filter((skill) =>
      text.includes(skill.toLowerCase())
    );
    const missingSoftSkills = SOFT_SKILLS.filter(
      (skill) => !foundSoftSkills.includes(skill)
    );

    // 2. Section presence checks
    const hasSummary = SECTION_PATTERNS.summary.test(resumeText);
    const hasEducation = SECTION_PATTERNS.education.test(resumeText);
    const hasExperience = SECTION_PATTERNS.experience.test(resumeText);
    const hasSkillsSection = SECTION_PATTERNS.skills.test(resumeText);
    const hasProjects = SECTION_PATTERNS.projects.test(resumeText);
    const hasCertifications = SECTION_PATTERNS.certifications.test(
      resumeText
    );
    const hasContact = SECTION_PATTERNS.contact.test(resumeText);
    const hasPhone = SECTION_PATTERNS.phone.test(resumeText);
    const hasQuantifiedResults = SECTION_PATTERNS.numbers.test(resumeText);

    // 3. Build ATS score (out of 100)
    let score = 0;
    if (hasContact) score += 8;
    if (hasPhone) score += 7;
    if (hasSummary) score += 10;
    if (hasEducation) score += 10;
    if (hasExperience) score += 15;
    if (hasSkillsSection) score += 10;
    if (hasProjects) score += 10;
    if (hasCertifications) score += 5;
    if (hasQuantifiedResults) score += 10;
    if (wordCount >= 150 && wordCount <= 1200) score += 5;

    score += Math.min(foundSkills.length * 2, 15); // up to 15 pts for skills
    score += Math.min(foundSoftSkills.length, 5); // up to 5 pts for soft skills

    score = Math.max(0, Math.min(100, Math.round(score)));

    let scoreLabel = "Needs Improvement";
    if (score >= 85) scoreLabel = "Excellent Resume";
    else if (score >= 70) scoreLabel = "Good Resume";
    else if (score >= 50) scoreLabel = "Average Resume";

    // 4. Strengths (dynamic)
    const strengths = [];
    if (hasSummary) strengths.push("Clear professional summary/objective");
    if (hasEducation) strengths.push("Education section is well included");
    if (hasExperience) strengths.push("Relevant work/internship experience present");
    if (hasProjects) strengths.push("Good project experience listed");
    if (hasCertifications) strengths.push("Certifications/training mentioned");
    if (hasQuantifiedResults) strengths.push("Uses measurable/quantified results");
    if (foundSkills.length > 0) {
      strengths.push(
        `Relevant ${bestDomain} skills found: ${foundSkills
          .slice(0, 5)
          .join(", ")}`
      );
    }
    if (strengths.length === 0) {
      strengths.push("Resume text was readable and processed successfully");
    }

    // 5. Missing skills (top 4-6 from detected domain + soft skills)
    const missingSkillsList = [
      ...missingSkills.slice(0, 4),
      ...missingSoftSkills.slice(0, 2),
    ];

    // 6. Suggestions (dynamic)
    const suggestions = [];
    if (!hasSummary)
      suggestions.push("Add a short professional summary at the top of your resume.");
    if (!hasContact)
      suggestions.push("Include a valid email address so recruiters can reach you.");
    if (!hasPhone)
      suggestions.push("Add a phone number for contact details.");
    if (!hasSkillsSection)
      suggestions.push("Add a dedicated Skills section listing your key skills.");
    if (!hasQuantifiedResults)
      suggestions.push("Add measurable achievements (numbers, %, results) to your experience/projects.");
    if (!hasProjects)
      suggestions.push("Include relevant projects to strengthen your resume.");
    if (wordCount < 150)
      suggestions.push("Your resume looks short — add more detail about your experience and skills.");
    if (wordCount > 1200)
      suggestions.push("Your resume is quite long — try to keep it concise and focused.");
    if (missingSkills.length > 0)
      suggestions.push(
        `Consider adding relevant ${bestDomain} keywords like ${missingSkills
          .slice(0, 3)
          .join(", ")} if applicable.`
      );
    if (suggestions.length === 0)
      suggestions.push("Your resume looks well-structured. Keep it updated with your latest experience.");

    return {
      score,
      scoreLabel,
      domain: bestDomain,
      strengths: strengths.slice(0, 5),
      missingSkills: missingSkillsList,
      suggestions: suggestions.slice(0, 5),
      wordCount,
    };
  };

  /* ---------------------------------------------------------
   * Save resume + analysis to localStorage
   * --------------------------------------------------------- */
   const saveResumeToStorage = async (selectedFile, resumeText, analysisResult) => {
    const resumeData = {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
      resumeText: resumeText,
      uploadedAt: new Date().toISOString(),
    };

    localStorage.setItem("aiCareerHubResume", JSON.stringify(resumeData));
    localStorage.setItem("aiCareerHubResumeText", resumeText);
    localStorage.setItem(
      "aiCareerHubResumeAnalysis",
      JSON.stringify(analysisResult)
    );

    // Also send to backend (best-effort — don't block the UI if it fails)
      // Also send to backend (best-effort — don't block the UI if it fails)
    try {
      const token = localStorage.getItem("aiCareerHubToken");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("resume_text", resumeText);
      formData.append("score", analysisResult.score);
      formData.append("score_label", analysisResult.scoreLabel);
      formData.append("domain", analysisResult.domain);
      formData.append("strengths", JSON.stringify(analysisResult.strengths));
      formData.append("missing_skills", JSON.stringify(analysisResult.missingSkills));
      formData.append("suggestions", JSON.stringify(analysisResult.suggestions));
      formData.append("found_skills", JSON.stringify(analysisResult.foundSkills || []));
      formData.append("word_count", analysisResult.wordCount);

      await fetch("http://127.0.0.1:8000/api/resume/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });
    } catch (error) {
      console.error("Failed to save resume to backend:", error);
    }
  };

  /* ---------------------------------------------------------
   * Handle file selection
   * --------------------------------------------------------- */
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsAnalyzed(false);
  };

  /* ---------------------------------------------------------
   * Handle drag and drop
   * --------------------------------------------------------- */
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setIsAnalyzed(false);
    }
  };

  /* ---------------------------------------------------------
   * Analyze resume
   * --------------------------------------------------------- */
  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    try {
      setIsExtracting(true);
      setStatusText("Starting...");

      const resumeText = await extractResumeText(file);

      if (!resumeText || resumeText.trim().length < 30) {
        alert(
          "Could not extract enough text from this resume, even after OCR. Please upload a clearer resume file."
        );
        setIsExtracting(false);
        setStatusText("");
        return;
      }

      setStatusText("Analyzing resume...");
      const analysisResult = analyzeResumeText(resumeText);

         await saveResumeToStorage(file, resumeText, analysisResult);

      setAnalysis(analysisResult);
      setIsAnalyzed(true);
      setIsExtracting(false);
      setStatusText("");
    } catch (error) {
      console.error("RESUME EXTRACTION ERROR:", error);

      setIsExtracting(false);
      setStatusText("");

      alert("Resume reading failed: " + (error?.message || "Unknown error"));
    }
  };

  /* ---------------------------------------------------------
   * Remove current resume
   * --------------------------------------------------------- */
  const removeFile = () => {
    setFile(null);
    setIsAnalyzed(false);
    setAnalysis(null);

    localStorage.removeItem("aiCareerHubResume");
    localStorage.removeItem("aiCareerHubResumeText");
    localStorage.removeItem("aiCareerHubResumeAnalysis");
  };

  return (
    <div className="resume-page">
      <div className="resume-container">
        <Link to="/student/dashboard" className="back-link">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="resume-header">
          <div>
            <span className="resume-label">AI CAREER TOOL</span>
            <h1>AI Resume Analyzer</h1>
            <p>
              Upload your resume and get an AI-powered ATS score, skill
              analysis, and personalized improvement suggestions.
            </p>
          </div>
        </div>

        {!isAnalyzed ? (
          <div className="resume-upload-card">
            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <Upload size={30} />
              </div>

              <h2>Upload Your Resume</h2>

              <p>
                Drag and drop your resume here, or choose a file from your
                computer.
              </p>

              <label className="choose-file-button">
                <Upload size={17} />
                Choose Resume
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              <span className="file-support">
                Supported formats: PDF, DOCX (scanned PDFs supported via OCR)
              </span>
            </div>

            {file && (
              <div className="selected-file">
                <div className="selected-file-info">
                  <div className="file-icon">
                    <FileText size={22} />
                  </div>

                  <div>
                    <strong>{file.name}</strong>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="remove-file"
                  onClick={removeFile}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <button
              className="analyze-button"
              onClick={analyzeResume}
              disabled={!file || isExtracting}
            >
              <TrendingUp size={19} />
              {isExtracting ? statusText || "Reading Resume..." : "Analyze Resume"}
            </button>
          </div>
        ) : (
          <div className="analysis-section">
            <div className="score-card">
              <div className="score-circle">
                <span>{analysis.score}%</span>
              </div>

              <div>
                <span className="score-label">ATS RESUME SCORE</span>
                <h2>{analysis.scoreLabel}</h2>
                <p>
                  Detected profile type:{" "}
                  <strong>{analysis.domain}</strong>. Based on your resume
                  content, here is your personalized breakdown.
                </p>
              </div>
            </div>

            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-card-heading">
                  <CheckCircle size={22} />
                  <h2>Strengths</h2>
                </div>

                <ul>
                  {analysis.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="analysis-card">
                <div className="analysis-card-heading warning">
                  <AlertCircle size={22} />
                  <h2>Missing Skills</h2>
                </div>

                <ul>
                  {analysis.missingSkills.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="analysis-card suggestions-card">
                <div className="analysis-card-heading">
                  <Lightbulb size={22} />
                  <h2>AI Suggestions</h2>
                </div>

                <ul>
                  {analysis.suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="analysis-actions">
              <button className="secondary-action" onClick={removeFile}>
                Analyze Another Resume
              </button>

              <Link to="/student/interview" className="primary-action">
                Start AI Interview
              </Link>

              <Link to="/student/dashboard" className="primary-action">
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;