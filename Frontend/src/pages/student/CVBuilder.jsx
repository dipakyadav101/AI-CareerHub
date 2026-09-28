import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Plus, Trash2, X, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Sidebar from "../../components/Sidebar";
import "./CVBuilder.css";

const CV_DATA_KEY = "aiCareerHubCVData";
const CV_TEMPLATE_KEY = "aiCareerHubCVTemplate";

const loadSavedCVData = () => {
  const saved = localStorage.getItem(CV_DATA_KEY);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
};

function CVBuilder() {
  const savedData = loadSavedCVData();

  const [selectedTemplate, setSelectedTemplate] = useState(
    () => localStorage.getItem(CV_TEMPLATE_KEY) || "modern"
  );
      const cvPreviewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const handleDownloadPDF = async () => {
    if (!cvPreviewRef.current) {
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cvPreviewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = personalInfo.fullName
        ? `${personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
        : "My_CV.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Something went wrong while generating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // -----------------------------
  // PERSONAL INFORMATION
  // -----------------------------
   const [personalInfo, setPersonalInfo] = useState(
    savedData?.personalInfo || {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      summary: "",
    }
  );

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // -----------------------------
  // EDUCATION
  // -----------------------------
  const [education, setEducation] = useState(savedData?.education || []);
  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: Date.now(),
        degree: "",
        institution: "",
        startYear: "",
        endYear: "",
        gpa: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (id, field, value) => {
    setEducation((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeEducation = (id) => {
    setEducation((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // -----------------------------
  // SKILLS
  // -----------------------------
  const [skills, setSkills] = useState(savedData?.skills || []);  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();

    if (!trimmed) {
      return;
    }

    if (skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }

    setSkills((prev) => [
      ...prev,
      trimmed,
    ]);

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev.filter(
        (skill) => skill !== skillToRemove
      )
    );
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  // -----------------------------
  // EXPERIENCE
  // -----------------------------
  const [experience, setExperience] = useState(savedData?.experience || []);
  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        id: Date.now(),
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
      },
    ]);
  };

  const updateExperience = (
    id,
    field,
    value
  ) => {
    setExperience((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeExperience = (id) => {
    setExperience((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // -----------------------------
  // PROJECTS
  // -----------------------------
  const [projects, setProjects] = useState(savedData?.projects || []);
  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        technologies: "",
        description: "",
        githubLink: "",
        liveLink: "",
      },
    ]);
  };

  const updateProject = (
    id,
    field,
    value
  ) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeProject = (id) => {
    setProjects((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // -----------------------------
  // CERTIFICATIONS
  // -----------------------------
    const [certifications, setCertifications] = useState(
    savedData?.certifications || []
  );

  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        organization: "",
        year: "",
      },
    ]);
  };

  const updateCertification = (
    id,
    field,
    value
  ) => {
    setCertifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeCertification = (id) => {
    setCertifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // -----------------------------
  // LANGUAGES
  // -----------------------------
   const [languages, setLanguages] = useState(savedData?.languages || []);

  const addLanguage = () => {
    setLanguages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        proficiency: "",
      },
    ]);
  };

  const updateLanguage = (
    id,
    field,
    value
  ) => {
    setLanguages((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };
  const removeLanguage = (id) => {
    setLanguages((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };
  const handleUseResumeData = () => {
    try {
      const savedAnalysis = localStorage.getItem("aiCareerHubResumeAnalysis");
      const savedResumeText = localStorage.getItem("aiCareerHubResumeText");

      if (!savedAnalysis && !savedResumeText) {
        alert(
          "No analyzed resume found. Please upload and analyze a resume first."
        );
        return;
      }

      let analysis = null;

      if (savedAnalysis) {
        try {
          analysis = JSON.parse(savedAnalysis);
        } catch (error) {
          analysis = null;
        }
      }

      // Prefill skills from resume analysis (found skills), without
      // overwriting skills the user already typed in manually.
      if (analysis?.foundSkills && analysis.foundSkills.length > 0) {
        setSkills((prev) => {
          const merged = [...prev];

          analysis.foundSkills.forEach((skill) => {
            if (!merged.includes(skill)) {
              merged.push(skill);
            }
          });

          return merged;
        });
      }

      // Try to prefill the professional summary from the resume text,
      // only if the summary field is currently empty.
      if (savedResumeText && !personalInfo.summary) {
        const cleanText = savedResumeText.replace(/\s+/g, " ").trim();
        const firstSentence = cleanText.split(/[.!?]/)[0];

        if (firstSentence && firstSentence.length > 20) {
          setPersonalInfo((prev) => ({
            ...prev,
            summary: firstSentence.slice(0, 300),
          }));
        }
      }

      alert(
        "Your resume data has been used to fill in what we could find (skills and summary). Please review and complete the rest manually."
      );
    } catch (error) {
      console.error("Failed to use resume data:", error);
      alert(
        "Something went wrong while reading your resume data. Please fill in the CV manually."
      );
    }
  };
  useEffect(() => {
    const dataToSave = {
      personalInfo,
      education,
      skills,
      experience,
      projects,
      certifications,
      languages,
    };

    localStorage.setItem(CV_DATA_KEY, JSON.stringify(dataToSave));
  }, [personalInfo, education, skills, experience, projects, certifications, languages]);
  const calculateCompletion = () => {
    let completed = 0;
    const totalSections = 6;

    // Personal Information
    if (personalInfo.fullName && personalInfo.email) {
      completed += 1;
    }

    // Contact Information
    if (personalInfo.phone && personalInfo.location) {
      completed += 1;
    }

    // Summary
    if (personalInfo.summary) {
      completed += 1;
    }

    // Education
    if (education.length > 0) {
      completed += 1;
    }

    // Skills
    if (skills.length > 0) {
      completed += 1;
    }

    // Experience or Projects
    if (experience.length > 0 || projects.length > 0) {
      completed += 1;
    }

    return Math.round((completed / totalSections) * 100);
  };

  const completionPercent = calculateCompletion();

  const handleDownloadClick = () => {
    const errors = [];

    if (!personalInfo.fullName.trim()) {
      errors.push("Full Name is required.");
    }

    if (!personalInfo.email.trim()) {
      errors.push("Email is required.");
    }

    if (education.length === 0) {
      errors.push("Please add at least one Education entry.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    handleDownloadPDF();
  };

  return (
    <div className="cv-builder-wrapper">
      <Sidebar />

      <div className="cv-builder-page">
        <div className="cv-builder-container">

          {/* BACK */}
          <Link
            to="/student/dashboard"
            className="cv-back-link"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          {/* HEADER */}
          <div className="cv-builder-header">
            <div className="cv-builder-header-icon">
              <FileText size={26} />
            </div>

            <div>
              <span className="cv-builder-label">
                CV BUILDER
              </span>

              <h1>
                Build Your Professional CV
              </h1>

              <p>
                Fill in your details on the left and
                see your CV update live on the right.
              </p>
            </div>
          </div>

          <div className="cv-builder-layout">

            {/* ========================= */}
            {/* LEFT FORM */}
            {/* ========================= */}
            <div className="cv-form-panel">

              {/* PERSONAL INFORMATION */}
                            <div className="cv-form-section">
                <div className="cv-form-section-heading">
                  <h2>
                    Personal Information
                  </h2>

                  <button
                    type="button"
                    className="cv-use-resume-btn"
                    onClick={handleUseResumeData}
                  >
                    Use My Resume Data
                  </button>
                </div>

                <div className="cv-form-grid">

                  <div className="cv-form-group">
                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={personalInfo.fullName}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "fullName",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="cv-form-group">
                    <label>
                      Professional Title
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Frontend Developer"
                      value={personalInfo.title}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "title",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="cv-form-group">
                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={personalInfo.email}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "email",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="cv-form-group">
                    <label>
                      Phone Number
                    </label>

                    <input
                      type="text"
                      placeholder="+977 98XXXXXXXX"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "phone",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="cv-form-group">
                    <label>
                      Address / Location
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Kathmandu, Nepal"
                      value={personalInfo.location}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "location",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="cv-form-group">
                    <label>
                      LinkedIn URL
                    </label>

                    <input
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={personalInfo.linkedin}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "linkedin",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="cv-form-group">
                    <label>
                      GitHub URL
                    </label>

                    <input
                      type="text"
                      placeholder="github.com/username"
                      value={personalInfo.github}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "github",
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>

                <div className="cv-form-group cv-form-group-full">
                  <label>
                    Professional Summary
                  </label>

                  <textarea
                    rows={4}
                    placeholder="A short summary about yourself..."
                    value={personalInfo.summary}
                    onChange={(e) =>
                      handlePersonalInfoChange(
                        "summary",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* EDUCATION */}
              <div className="cv-form-section">

                <div className="cv-form-section-heading">
                  <h2>
                    Education
                  </h2>

                  <button
                    type="button"
                    className="cv-add-btn"
                    onClick={addEducation}
                  >
                    <Plus size={16} />
                    Add Education
                  </button>
                </div>

                {education.length === 0 && (
                  <p className="cv-empty-hint">
                    No education added yet. Click
                    "Add Education" to start.
                  </p>
                )}

                {education.map((item) => (
                  <div
                    className="cv-entry-card"
                    key={item.id}
                  >
                    <button
                      type="button"
                      className="cv-remove-btn"
                      onClick={() =>
                        removeEducation(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="cv-form-grid">

                      <div className="cv-form-group">
                        <label>
                          Degree / Program
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Bachelor of Information Technology"
                          value={item.degree}
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "degree",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Institution
                        </label>

                        <input
                          type="text"
                          placeholder="College / University"
                          value={item.institution}
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "institution",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Start Year
                        </label>

                        <input
                          type="text"
                          placeholder="2022"
                          value={item.startYear}
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "startYear",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          End Year
                        </label>

                        <input
                          type="text"
                          placeholder="2026"
                          value={item.endYear}
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "endYear",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          GPA
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. 3.50"
                          value={item.gpa}
                          onChange={(e) =>
                            updateEducation(
                              item.id,
                              "gpa",
                              e.target.value
                            )
                          }
                        />
                      </div>

                    </div>

                    <div className="cv-form-group cv-form-group-full">
                      <label>
                        Description
                      </label>

                      <textarea
                        rows={3}
                        placeholder="Relevant education details..."
                        value={item.description}
                        onChange={(e) =>
                          updateEducation(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* SKILLS */}
              <div className="cv-form-section">

                <div className="cv-form-section-heading">
                  <h2>
                    Skills
                  </h2>
                </div>

                <div className="cv-skill-input-row">
                  <input
                    type="text"
                    placeholder="e.g. React"
                    value={skillInput}
                    onChange={(e) =>
                      setSkillInput(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleSkillKeyDown
                    }
                  />

                  <button
                    type="button"
                    className="cv-add-btn"
                    onClick={addSkill}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="cv-skill-tags">

                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="cv-skill-tag"
                    >
                      <span>
                        {skill}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(skill)
                        }
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                </div>
              </div>

              {/* EXPERIENCE */}
              <div className="cv-form-section">

                <div className="cv-form-section-heading">
                  <h2>
                    Work Experience
                  </h2>

                  <button
                    type="button"
                    className="cv-add-btn"
                    onClick={addExperience}
                  >
                    <Plus size={16} />
                    Add Experience
                  </button>
                </div>

                {experience.length === 0 && (
                  <p className="cv-empty-hint">
                    No work experience added yet.
                  </p>
                )}

                {experience.map((item) => (
                  <div
                    className="cv-entry-card"
                    key={item.id}
                  >
                    <button
                      type="button"
                      className="cv-remove-btn"
                      onClick={() =>
                        removeExperience(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="cv-form-grid">

                      <div className="cv-form-group">
                        <label>
                          Job Title
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Frontend Developer"
                          value={item.jobTitle}
                          onChange={(e) =>
                            updateExperience(
                              item.id,
                              "jobTitle",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Company Name
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Tech Solutions"
                          value={item.company}
                          onChange={(e) =>
                            updateExperience(
                              item.id,
                              "company",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Location
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Kathmandu, Nepal"
                          value={item.location}
                          onChange={(e) =>
                            updateExperience(
                              item.id,
                              "location",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Start Date
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Jan 2023"
                          value={item.startDate}
                          onChange={(e) =>
                            updateExperience(
                              item.id,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          End Date
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Dec 2024"
                          value={item.endDate}
                          disabled={
                            item.currentlyWorking
                          }
                          onChange={(e) =>
                            updateExperience(
                              item.id,
                              "endDate",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group cv-checkbox-group">
                        <label className="cv-checkbox-label">
                          <input
                            type="checkbox"
                            checked={
                              item.currentlyWorking
                            }
                            onChange={(e) =>
                              updateExperience(
                                item.id,
                                "currentlyWorking",
                                e.target.checked
                              )
                            }
                          />

                          Currently Working Here
                        </label>
                      </div>

                    </div>

                    <div className="cv-form-group cv-form-group-full">
                      <label>
                        Description
                      </label>

                      <textarea
                        rows={3}
                        placeholder="Key responsibilities and achievements..."
                        value={item.description}
                        onChange={(e) =>
                          updateExperience(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* PROJECTS */}
              <div className="cv-form-section">

                <div className="cv-form-section-heading">
                  <h2>
                    Projects
                  </h2>

                  <button
                    type="button"
                    className="cv-add-btn"
                    onClick={addProject}
                  >
                    <Plus size={16} />
                    Add Project
                  </button>
                </div>

                {projects.length === 0 && (
                  <p className="cv-empty-hint">
                    No projects added yet. Click
                    "Add Project" to start.
                  </p>
                )}

                {projects.map((item) => (
                  <div
                    className="cv-entry-card"
                    key={item.id}
                  >
                    <button
                      type="button"
                      className="cv-remove-btn"
                      onClick={() =>
                        removeProject(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="cv-form-grid">

                      <div className="cv-form-group">
                        <label>
                          Project Name
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. AI CareerHub"
                          value={item.name}
                          onChange={(e) =>
                            updateProject(
                              item.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Technologies Used
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. React, Django, MySQL"
                          value={item.technologies}
                          onChange={(e) =>
                            updateProject(
                              item.id,
                              "technologies",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          GitHub Link
                        </label>

                        <input
                          type="text"
                          placeholder="github.com/username/project"
                          value={item.githubLink}
                          onChange={(e) =>
                            updateProject(
                              item.id,
                              "githubLink",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Live Demo Link
                        </label>

                        <input
                          type="text"
                          placeholder="myproject.com"
                          value={item.liveLink}
                          onChange={(e) =>
                            updateProject(
                              item.id,
                              "liveLink",
                              e.target.value
                            )
                          }
                        />
                      </div>

                    </div>

                    <div className="cv-form-group cv-form-group-full">
                      <label>
                        Project Description
                      </label>

                      <textarea
                        rows={3}
                        placeholder="What the project does, your role..."
                        value={item.description}
                        onChange={(e) =>
                          updateProject(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* CERTIFICATIONS */}
              <div className="cv-form-section">

                <div className="cv-form-section-heading">
                  <h2>
                    Certifications
                  </h2>

                  <button
                    type="button"
                    className="cv-add-btn"
                    onClick={addCertification}
                  >
                    <Plus size={16} />
                    Add Certification
                  </button>
                </div>

                {certifications.length === 0 && (
                  <p className="cv-empty-hint">
                    No certifications added yet.
                  </p>
                )}

                {certifications.map((item) => (
                  <div
                    className="cv-entry-card"
                    key={item.id}
                  >
                    <button
                      type="button"
                      className="cv-remove-btn"
                      onClick={() =>
                        removeCertification(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="cv-form-grid">

                      <div className="cv-form-group">
                        <label>
                          Certificate Name
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. AWS Certified Developer"
                          value={item.name}
                          onChange={(e) =>
                            updateCertification(
                              item.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Organization
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Amazon Web Services"
                          value={item.organization}
                          onChange={(e) =>
                            updateCertification(
                              item.id,
                              "organization",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Year
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. 2024"
                          value={item.year}
                          onChange={(e) =>
                            updateCertification(
                              item.id,
                              "year",
                              e.target.value
                            )
                          }
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* LANGUAGES */}
              <div className="cv-form-section">

                <div className="cv-form-section-heading">
                  <h2>
                    Languages
                  </h2>

                  <button
                    type="button"
                    className="cv-add-btn"
                    onClick={addLanguage}
                  >
                    <Plus size={16} />
                    Add Language
                  </button>
                </div>

                {languages.length === 0 && (
                  <p className="cv-empty-hint">
                    No languages added yet.
                  </p>
                )}

                {languages.map((item) => (
                  <div
                    className="cv-entry-card"
                    key={item.id}
                  >
                    <button
                      type="button"
                      className="cv-remove-btn"
                      onClick={() =>
                        removeLanguage(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="cv-form-grid">

                      <div className="cv-form-group">
                        <label>
                          Language
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. English"
                          value={item.name}
                          onChange={(e) =>
                            updateLanguage(
                              item.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="cv-form-group">
                        <label>
                          Proficiency
                        </label>

                        <select
                          value={item.proficiency}
                          onChange={(e) =>
                            updateLanguage(
                              item.id,
                              "proficiency",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select level
                          </option>

                          <option value="Native">
                            Native
                          </option>

                          <option value="Professional">
                            Professional
                          </option>

                          <option value="Intermediate">
                            Intermediate
                          </option>

                          <option value="Basic">
                            Basic
                          </option>
                        </select>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* ========================= */}
            {/* RIGHT LIVE PREVIEW */}
            {/* ========================= */}
            <div className="cv-preview-panel">

              {/* TEMPLATE SELECTOR */}
                                       {validationErrors.length > 0 && (
                <div className="cv-validation-box">
                  {validationErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              <div className="cv-completion-box">
                <div className="cv-completion-top">
                  <span>CV Completion</span>
                  <strong>{completionPercent}%</strong>
                </div>

                <div className="cv-completion-bar">
                  <div
                    className="cv-completion-fill"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="cv-download-btn"
                onClick={handleDownloadClick}
                disabled={isDownloading}
              >
                <Download size={16} />
                {isDownloading ? "Generating PDF..." : "Download CV as PDF"}
              </button>
              <div className="cv-template-selector">

                <button
                  type="button"
                  className={
                    selectedTemplate === "modern"
                      ? "cv-template-btn active"
                      : "cv-template-btn"
                  }
                  onClick={() =>
                    setSelectedTemplate("modern")
                  }
                >
                  Modern Professional
                </button>

                                <button
                  type="button"
                  className={
                    selectedTemplate === "minimal"
                      ? "cv-template-btn active"
                      : "cv-template-btn"
                  }
                  onClick={() => setSelectedTemplate("minimal")}
                >
                  Sidebar Professional
                </button>

                <button
                  type="button"
                  className={
                    selectedTemplate === "creative"
                      ? "cv-template-btn active"
                      : "cv-template-btn"
                  }
                  onClick={() =>
                    setSelectedTemplate("creative")
                  }
                >
                  Creative Professional
                </button>

              </div>

              {/* CV PREVIEW */}
                           <div
                className={`cv-preview-page cv-template-${selectedTemplate}`}
                ref={cvPreviewRef}
              >

                {/* HEADER */}
                <div className="cv-preview-header">

                  <h1>
                    {personalInfo.fullName ||
                      "Your Name"}
                  </h1>

                  {personalInfo.title && (
                    <p className="cv-preview-title">
                      {personalInfo.title}
                    </p>
                  )}

                  <div className="cv-preview-contact">

                    {personalInfo.email && (
                      <span>
                        {personalInfo.email}
                      </span>
                    )}

                    {personalInfo.phone && (
                      <span>
                        {personalInfo.phone}
                      </span>
                    )}

                    {personalInfo.location && (
                      <span>
                        {personalInfo.location}
                      </span>
                    )}

                    {personalInfo.linkedin && (
                      <span>
                        {personalInfo.linkedin}
                      </span>
                    )}

                    {personalInfo.github && (
                      <span>
                        {personalInfo.github}
                      </span>
                    )}

                  </div>
                </div>

                {/* SUMMARY */}
                {personalInfo.summary && (
                  <div className="cv-preview-section">
                    <h3>
                      Professional Summary
                    </h3>

                    <p>
                      {personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* EDUCATION PREVIEW */}
                {education.length > 0 && (
                  <div className="cv-preview-section">

                    <h3>
                      Education
                    </h3>

                    {education.map((item) => (
                      <div
                        className="cv-preview-entry"
                        key={item.id}
                      >
                        <div className="cv-preview-entry-top">

                          <strong>
                            {item.degree ||
                              "Degree"}
                          </strong>

                          <span>
                            {item.startYear}

                            {item.startYear ||
                            item.endYear
                              ? " - "
                              : ""}

                            {item.endYear}
                          </span>

                        </div>

                        <p className="cv-preview-entry-sub">
                          {item.institution}

                          {item.gpa
                            ? ` • GPA: ${item.gpa}`
                            : ""}
                        </p>

                        {item.description && (
                          <p className="cv-preview-entry-desc">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* SKILLS PREVIEW */}
                {skills.length > 0 && (
                  <div className="cv-preview-section">

                    <h3>
                      Skills
                    </h3>

                    <div className="cv-preview-skill-list">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="cv-preview-skill-item"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXPERIENCE PREVIEW */}
                {experience.length > 0 && (
                  <div className="cv-preview-section">

                    <h3>
                      Work Experience
                    </h3>

                    {experience.map((item) => (
                      <div
                        className="cv-preview-entry"
                        key={item.id}
                      >

                        <div className="cv-preview-entry-top">

                          <strong>
                            {item.jobTitle ||
                              "Job Title"}
                          </strong>

                          <span>
                            {item.startDate}

                            {item.startDate
                              ? " - "
                              : ""}

                            {item.currentlyWorking
                              ? "Present"
                              : item.endDate}
                          </span>

                        </div>

                        <p className="cv-preview-entry-sub">
                          {item.company}

                          {item.location
                            ? ` • ${item.location}`
                            : ""}
                        </p>

                        {item.description && (
                          <p className="cv-preview-entry-desc">
                            {item.description}
                          </p>
                        )}

                      </div>
                    ))}
                  </div>
                )}

                {/* PROJECTS PREVIEW */}
                {projects.length > 0 && (
                  <div className="cv-preview-section">

                    <h3>
                      Projects
                    </h3>

                    {projects.map((item) => (
                      <div
                        className="cv-preview-entry"
                        key={item.id}
                      >

                        <div className="cv-preview-entry-top">
                          <strong>
                            {item.name ||
                              "Project Name"}
                          </strong>
                        </div>

                        {item.technologies && (
                          <p className="cv-preview-entry-sub">
                            {item.technologies}
                          </p>
                        )}

                        {item.description && (
                          <p className="cv-preview-entry-desc">
                            {item.description}
                          </p>
                        )}

                        {(item.githubLink ||
                          item.liveLink) && (
                          <p className="cv-preview-entry-links">

                            {item.githubLink && (
                              <span>
                                {item.githubLink}
                              </span>
                            )}

                            {item.liveLink && (
                              <span>
                                {item.liveLink}
                              </span>
                            )}

                          </p>
                        )}

                      </div>
                    ))}
                  </div>
                )}

                {/* CERTIFICATIONS PREVIEW */}
                {certifications.length > 0 && (
                  <div className="cv-preview-section">

                    <h3>
                      Certifications
                    </h3>

                    {certifications.map((item) => (
                      <div
                        className="cv-preview-entry"
                        key={item.id}
                      >

                        <div className="cv-preview-entry-top">

                          <strong>
                            {item.name ||
                              "Certificate"}
                          </strong>

                          <span>
                            {item.year}
                          </span>

                        </div>

                        {item.organization && (
                          <p className="cv-preview-entry-sub">
                            {item.organization}
                          </p>
                        )}

                      </div>
                    ))}
                  </div>
                )}

                {/* LANGUAGES PREVIEW */}
                {languages.length > 0 && (
                  <div className="cv-preview-section">

                    <h3>
                      Languages
                    </h3>

                    <div className="cv-preview-skill-list">

                      {languages.map((item) => (
                        <span
                          key={item.id}
                          className="cv-preview-skill-item"
                        >
                          {item.name}

                          {item.proficiency
                            ? ` - ${item.proficiency}`
                            : ""}
                        </span>
                      ))}

                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CVBuilder;