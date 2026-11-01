"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import {
  PortfolioData,
  Project,
  SkillItem,
  ExperienceItem,
} from "@/types/portfolio";
import Toast, { ToastMessage } from "@/components/Toast";
import {
  Sliders,
  FolderGit2,
  Cpu,
  Briefcase,
  User,
  FileCode2,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  ArrowLeft,
  AlertTriangle,
  X,
  Info,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "projects" | "skills" | "experience" | "profile" | "raw"
  >("projects");

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals for CRUD operations
  const [projectModalMode, setProjectModalMode] = useState<"add" | "edit" | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Skill modal state
  const [skillModalMode, setSkillModalMode] = useState<"add" | "edit" | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem>>({});

  // Experience modal state
  const [expModalMode, setExpModalMode] = useState<"add" | "edit" | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem>>({});

  // Raw JSON state
  const [rawJsonText, setRawJsonText] = useState("");

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setRawJsonText(JSON.stringify(json.data, null, 2));
          setHasUnsavedChanges(false);
        } else {
          addToast(json.error || "Failed to load portfolio data", "error");
        }
      } catch {
        addToast("Failed to fetch data from /api/portfolio", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  // Save changes to disk via PUT /api/portfolio
  const saveAllChanges = async (overrideData?: PortfolioData) => {
    const dataToSave = overrideData || data;
    if (!dataToSave) return;

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      const json = await res.json();
      if (json.success) {
        addToast("Saved successfully to src/data/portfolio.json!", "success");
        setHasUnsavedChanges(false);
        setRawJsonText(JSON.stringify(dataToSave, null, 2));
      } else {
        addToast(json.error || "Failed to save portfolio data", "error");
      }
    } catch {
      addToast("Server error while saving to portfolio.json", "error");
    }
  };

  // Reset to seed data via POST /api/portfolio/reset
  const handleResetData = async () => {
    if (!confirm("Are you sure you want to reset all portfolio data back to the default seed? Any unsaved edits will be lost.")) {
      return;
    }

    try {
      const res = await fetch("/api/portfolio/reset", { method: "POST" });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setRawJsonText(JSON.stringify(json.data, null, 2));
        setHasUnsavedChanges(false);
        addToast("Portfolio data reset to default seed!", "success");
      } else {
        addToast(json.error || "Failed to reset portfolio data", "error");
      }
    } catch {
      addToast("Failed to reset data", "error");
    }
  };

  // --- PROJECT CRUD HANDLERS ---
  const openAddProjectModal = () => {
    setEditingProject({
      id: `p-${Date.now()}`,
      title: "",
      tagline: "",
      description: "",
      fullDescription: "",
      category: "Full-Stack",
      featured: false,
      tags: ["TypeScript", "Next.js"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      metrics: ["Sub-20ms latency"],
      highlights: ["Engineered scalable architecture"],
      image: "/images/projects/cloud-canvas.png",
      architecture: "Client: Next.js | Server: Node.js | Database: PostgreSQL",
    });
    setProjectModalMode("add");
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProject({ ...proj });
    setProjectModalMode("edit");
  };

  const handleSaveProject = () => {
    if (!data || !editingProject.title) {
      addToast("Project title is required", "error");
      return;
    }

    const updatedProjects = [...data.projects];
    if (projectModalMode === "add") {
      updatedProjects.unshift(editingProject as Project);
      addToast(`Added project "${editingProject.title}"`, "success");
    } else {
      const idx = updatedProjects.findIndex((p) => p.id === editingProject.id);
      if (idx !== -1) {
        updatedProjects[idx] = editingProject as Project;
        addToast(`Updated project "${editingProject.title}"`, "success");
      }
    }

    const newData: PortfolioData = { ...data, projects: updatedProjects };
    setData(newData);
    setHasUnsavedChanges(true);
    setProjectModalMode(null);
  };

  const handleDeleteProject = (id: string) => {
    if (!data) return;
    const proj = data.projects.find((p) => p.id === id);
    const updated = data.projects.filter((p) => p.id !== id);
    const newData = { ...data, projects: updated };
    setData(newData);
    setHasUnsavedChanges(true);
    setProjectToDelete(null);
    addToast(`Deleted project "${proj?.title || id}"`, "info");
  };

  // --- SKILL CRUD HANDLERS ---
  const openAddSkillModal = () => {
    setEditingSkill({
      id: `s-${Date.now()}`,
      name: "",
      level: 85,
      category: data?.skillCategories[0]?.id || "frontend",
      featured: false,
      years: 3,
    });
    setSkillModalMode("add");
  };

  const openEditSkillModal = (skill: SkillItem) => {
    setEditingSkill({ ...skill });
    setSkillModalMode("edit");
  };

  const handleSaveSkill = () => {
    if (!data || !editingSkill.name) {
      addToast("Skill name is required", "error");
      return;
    }

    const updatedSkills = [...data.skills];
    if (skillModalMode === "add") {
      updatedSkills.push(editingSkill as SkillItem);
      addToast(`Added skill "${editingSkill.name}"`, "success");
    } else {
      const idx = updatedSkills.findIndex((s) => s.id === editingSkill.id);
      if (idx !== -1) {
        updatedSkills[idx] = editingSkill as SkillItem;
        addToast(`Updated skill "${editingSkill.name}"`, "success");
      }
    }

    setData({ ...data, skills: updatedSkills });
    setHasUnsavedChanges(true);
    setSkillModalMode(null);
  };

  const handleDeleteSkill = (id: string) => {
    if (!data) return;
    const updated = data.skills.filter((s) => s.id !== id);
    setData({ ...data, skills: updated });
    setHasUnsavedChanges(true);
    addToast("Skill removed", "info");
  };

  // --- EXPERIENCE CRUD HANDLERS ---
  const openAddExpModal = () => {
    setEditingExp({
      id: `e-${Date.now()}`,
      role: "",
      company: "",
      companyUrl: "https://example.com",
      location: "San Francisco, CA",
      period: "2024 - Present",
      type: "Full-Time",
      isCurrent: true,
      achievements: ["Engineered core microservices architecture."],
      technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    });
    setExpModalMode("add");
  };

  const openEditExpModal = (exp: ExperienceItem) => {
    setEditingExp({ ...exp });
    setExpModalMode("edit");
  };

  const handleSaveExp = () => {
    if (!data || !editingExp.role || !editingExp.company) {
      addToast("Role and company are required", "error");
      return;
    }

    const updated = [...data.experience];
    if (expModalMode === "add") {
      updated.unshift(editingExp as ExperienceItem);
      addToast(`Added experience at ${editingExp.company}`, "success");
    } else {
      const idx = updated.findIndex((e) => e.id === editingExp.id);
      if (idx !== -1) {
        updated[idx] = editingExp as ExperienceItem;
        addToast(`Updated experience at ${editingExp.company}`, "success");
      }
    }

    setData({ ...data, experience: updated });
    setHasUnsavedChanges(true);
    setExpModalMode(null);
  };

  const handleDeleteExp = (id: string) => {
    if (!data) return;
    const updated = data.experience.filter((e) => e.id !== id);
    setData({ ...data, experience: updated });
    setHasUnsavedChanges(true);
    addToast("Experience entry deleted", "info");
  };

  // --- RAW JSON HANDLER ---
  const handleSaveRawJson = () => {
    try {
      const parsed: PortfolioData = JSON.parse(rawJsonText);
      if (!parsed.personal || !Array.isArray(parsed.projects)) {
        throw new Error("Missing required root fields: personal, projects");
      }
      setData(parsed);
      saveAllChanges(parsed);
    } catch (err) {
      addToast(
        err instanceof Error ? `JSON syntax error: ${err.message}` : "Invalid JSON",
        "error"
      );
    }
  };

  if (loading || !data) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading portfolio data store...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Top Header / Bar */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Public Portfolio</span>
          </Link>
          <div className={styles.divider} />
          <div className={styles.brandTitle}>
            <Sliders size={20} className={styles.brandIcon} />
            <span>Portfolio CRUD Dashboard</span>
          </div>
          <span className={styles.dbSourceBadge}>src/data/portfolio.json</span>
        </div>

        <div className={styles.headerRight}>
          {hasUnsavedChanges && (
            <div className={styles.unsavedPill}>
              <span className={styles.unsavedDot} />
              <span>Unsaved changes in memory</span>
            </div>
          )}

          <button
            onClick={handleResetData}
            className={styles.resetBtn}
            title="Reset to portfolio.seed.json"
          >
            <RotateCcw size={15} />
            <span>Reset Seed</span>
          </button>

          <button
            onClick={() => saveAllChanges()}
            className="btn-primary btn-sm"
            title="Write current data back to portfolio.json"
          >
            <Save size={16} />
            <span>Save to portfolio.json</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className={styles.mainLayout}>
        {/* Sidebar Nav Tabs */}
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav}>
            <button
              onClick={() => setActiveTab("projects")}
              className={`${styles.navItem} ${
                activeTab === "projects" ? styles.activeNavItem : ""
              }`}
            >
              <FolderGit2 size={18} />
              <span>Projects CRUD ({data.projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`${styles.navItem} ${
                activeTab === "skills" ? styles.activeNavItem : ""
              }`}
            >
              <Cpu size={18} />
              <span>Skills CRUD ({data.skills.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("experience")}
              className={`${styles.navItem} ${
                activeTab === "experience" ? styles.activeNavItem : ""
              }`}
            >
              <Briefcase size={18} />
              <span>Experience & Edu</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`${styles.navItem} ${
                activeTab === "profile" ? styles.activeNavItem : ""
              }`}
            >
              <User size={18} />
              <span>Profile & Socials</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("raw");
                setRawJsonText(JSON.stringify(data, null, 2));
              }}
              className={`${styles.navItem} ${
                activeTab === "raw" ? styles.activeNavItem : ""
              }`}
            >
              <FileCode2 size={18} />
              <span>Raw JSON Editor</span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.tipBox}>
              <Info size={14} className={styles.tipIcon} />
              <p>
                All edits directly persist to <code>src/data/portfolio.json</code> and instantly update the live website.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className={styles.contentPane}>
          {/* TAB 1: PROJECTS CRUD */}
          {activeTab === "projects" && (
            <div className={styles.tabContent}>
              <div className={styles.paneHeader}>
                <div>
                  <h2 className={styles.paneTitle}>Projects Management</h2>
                  <p className={styles.paneSubtitle}>
                    Create, update, or remove projects displayed on the portfolio.
                  </p>
                </div>
                <button onClick={openAddProjectModal} className="btn-primary">
                  <Plus size={16} />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className={`glass-panel ${styles.tableCard}`}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Project Title</th>
                      <th>Category</th>
                      <th>Featured</th>
                      <th>Tech Tags</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.projects.map((proj) => (
                      <tr key={proj.id}>
                        <td>
                          {proj.image ? (
                            <div
                              className={styles.projectThumbnail}
                              role="img"
                              aria-label={`${proj.title} project image`}
                              style={{
                                backgroundImage: `url(${JSON.stringify(proj.image)})`,
                              }}
                            />
                          ) : (
                            <span className={styles.subtext}>No image</span>
                          )}
                        </td>
                        <td className={styles.titleCell}>
                          <strong>{proj.title}</strong>
                          <span className={styles.subtext}>{proj.tagline}</span>
                        </td>
                        <td>
                          <span className="badge badge-accent">{proj.category}</span>
                        </td>
                        <td>
                          {proj.featured ? (
                            <span className="badge badge-cyan">Featured</span>
                          ) : (
                            <span className={styles.subtext}>Standard</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.tagsCell}>
                            {proj.tags.slice(0, 3).map((t, i) => (
                              <span key={i} className="badge">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className={styles.actionsCell}>
                            <button
                              onClick={() => openEditProjectModal(proj)}
                              className={styles.actionIconBtn}
                              title="Edit Project"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setProjectToDelete(proj.id)}
                              className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                              title="Delete Project"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS CRUD */}
          {activeTab === "skills" && (
            <div className={styles.tabContent}>
              <div className={styles.paneHeader}>
                <div>
                  <h2 className={styles.paneTitle}>Skills & Competencies</h2>
                  <p className={styles.paneSubtitle}>
                    Manage categories, proficiency scores, and featured badges.
                  </p>
                </div>
                <button onClick={openAddSkillModal} className="btn-primary">
                  <Plus size={16} />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className={styles.skillsGrid}>
                {data.skills.map((skill) => (
                  <div key={skill.id} className={`glass-panel ${styles.skillDashCard}`}>
                    <div className={styles.skillDashTop}>
                      <div>
                        <h4 className={styles.skillDashName}>{skill.name}</h4>
                        <span className={styles.skillDashCat}>
                          {skill.category.toUpperCase()}
                        </span>
                      </div>
                      <div className={styles.skillDashActions}>
                        <button
                          onClick={() => openEditSkillModal(skill)}
                          className={styles.actionIconBtn}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.skillDashProgress}>
                      <div
                        className={styles.skillDashBar}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>

                    <div className={styles.skillDashBottom}>
                      <span>Level: {skill.level}%</span>
                      {skill.featured && (
                        <span className="badge badge-accent">Core Strength</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE & EDUCATION */}
          {activeTab === "experience" && (
            <div className={styles.tabContent}>
              <div className={styles.paneHeader}>
                <div>
                  <h2 className={styles.paneTitle}>Work Experience & Timeline</h2>
                  <p className={styles.paneSubtitle}>
                    Track your career milestones, roles, and achievements.
                  </p>
                </div>
                <button onClick={openAddExpModal} className="btn-primary">
                  <Plus size={16} />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className={styles.expList}>
                {data.experience.map((exp) => (
                  <div key={exp.id} className={`glass-panel ${styles.expDashCard}`}>
                    <div className={styles.expDashHeader}>
                      <div>
                        <h3 className={styles.expDashRole}>{exp.role}</h3>
                        <div className={styles.expDashCompany}>
                          {exp.company} • {exp.period} ({exp.type})
                        </div>
                      </div>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => openEditExpModal(exp)}
                          className={styles.actionIconBtn}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteExp(exp.id)}
                          className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <ul className={styles.expDashBulletList}>
                      {exp.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>

                    <div className={styles.tagsCell}>
                      {exp.technologies.map((t, i) => (
                        <span key={i} className="badge">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE & SOCIALS */}
          {activeTab === "profile" && (
            <div className={styles.tabContent}>
              <div className={styles.paneHeader}>
                <div>
                  <h2 className={styles.paneTitle}>Profile & Contact Details</h2>
                  <p className={styles.paneSubtitle}>
                    Update your primary bio, title, status, and external links.
                  </p>
                </div>
              </div>

              <div className={`glass-panel ${styles.profileFormCard}`}>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      value={data.personal.name}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personal: { ...data.personal, name: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Title</label>
                    <input
                      type="text"
                      value={data.personal.title}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personal: { ...data.personal, title: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Tagline</label>
                  <input
                    type="text"
                    value={data.personal.tagline}
                    onChange={(e) => {
                      setData({
                        ...data,
                        personal: { ...data.personal, tagline: e.target.value },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="input-field"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Availability Status</label>
                    <input
                      type="text"
                      value={data.personal.status}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personal: { ...data.personal, status: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      value={data.personal.location}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personal: { ...data.personal, location: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={data.personal.email}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personal: { ...data.personal, email: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="number"
                      value={data.personal.yearsOfExperience}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personal: {
                            ...data.personal,
                            yearsOfExperience: parseInt(e.target.value) || 0,
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio (Paragraph 1)</label>
                  <textarea
                    rows={3}
                    value={data.personal.bio[0] || ""}
                    onChange={(e) => {
                      const newBio = [...data.personal.bio];
                      newBio[0] = e.target.value;
                      setData({
                        ...data,
                        personal: { ...data.personal, bio: newBio },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="textarea-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio (Paragraph 2)</label>
                  <textarea
                    rows={3}
                    value={data.personal.bio[1] || ""}
                    onChange={(e) => {
                      const newBio = [...data.personal.bio];
                      newBio[1] = e.target.value;
                      setData({
                        ...data,
                        personal: { ...data.personal, bio: newBio },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="textarea-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RAW JSON EDITOR */}
          {activeTab === "raw" && (
            <div className={styles.tabContent}>
              <div className={styles.paneHeader}>
                <div>
                  <h2 className={styles.paneTitle}>Direct JSON Code Editor</h2>
                  <p className={styles.paneSubtitle}>
                    Edit the raw JSON data directly with real-time schema validation.
                  </p>
                </div>
                <div className={styles.actionsCell}>
                  <button
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(rawJsonText);
                        setRawJsonText(JSON.stringify(parsed, null, 2));
                        addToast("Formatted JSON", "info");
                      } catch {
                        addToast("Cannot format: JSON is invalid", "error");
                      }
                    }}
                    className="btn-secondary btn-sm"
                  >
                    Format Code
                  </button>
                  <button onClick={handleSaveRawJson} className="btn-primary btn-sm">
                    <Save size={15} />
                    <span>Validate & Save</span>
                  </button>
                </div>
              </div>

              <div className={styles.rawEditorWrap}>
                <textarea
                  value={rawJsonText}
                  onChange={(e) => {
                    setRawJsonText(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className={styles.rawTextarea}
                  spellCheck={false}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL: ADD / EDIT PROJECT --- */}
      {projectModalMode && (
        <div className={styles.modalBackdrop}>
          <div className={`glass-panel ${styles.crudModalCard}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {projectModalMode === "add" ? "Create New Project" : "Edit Project"}
              </h3>
              <button
                onClick={() => setProjectModalMode(null)}
                className={styles.modalCloseBtn}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g. Distributed Consensus Engine"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={editingProject.category || "Full-Stack"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as Project["category"],
                      })
                    }
                    className="select-field"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Backend & Systems">Backend & Systems</option>
                    <option value="Cloud & AI">Cloud & AI</option>
                    <option value="Frontend & UI">Frontend & UI</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="project-image">
                  Project Image
                </label>
                <input
                  id="project-image"
                  type="text"
                  value={editingProject.image || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, image: e.target.value })
                  }
                  className="input-field"
                  placeholder="/images/projects/my-project.png"
                />
                <span className={styles.subtext}>
                  Use an image path from the public folder or an image URL.
                </span>
                {editingProject.image && (
                  <div
                    className={styles.projectImagePreview}
                    role="img"
                    aria-label={`${editingProject.title || "Project"} image preview`}
                    style={{
                      backgroundImage: `url(${JSON.stringify(editingProject.image)})`,
                    }}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Tagline (One-sentence summary)</label>
                <input
                  type="text"
                  value={editingProject.tagline || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, tagline: e.target.value })
                  }
                  className="input-field"
                  placeholder="High-throughput distributed task runner"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Overview Description</label>
                <textarea
                  rows={2}
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  className="textarea-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deep Dive Case Study</label>
                <textarea
                  rows={4}
                  value={editingProject.fullDescription || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      fullDescription: e.target.value,
                    })
                  }
                  className="textarea-field"
                  placeholder="Architectural deep-dive, trade-offs, and design details..."
                />
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Live URL</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        githubUrl: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Tech Tags (comma separated)</label>
                  <input
                    type="text"
                    value={(editingProject.tags || []).join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    className="input-field"
                    placeholder="Next.js, TypeScript, Go"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Featured on Home Page?</label>
                  <select
                    value={editingProject.featured ? "true" : "false"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        featured: e.target.value === "true",
                      })
                    }
                    className="select-field"
                  >
                    <option value="true">Yes (Featured)</option>
                    <option value="false">No (Standard)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setProjectModalMode(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSaveProject} className="btn-primary">
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD / EDIT SKILL --- */}
      {skillModalMode && (
        <div className={styles.modalBackdrop}>
          <div className={`glass-panel ${styles.crudModalCardSmall}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {skillModalMode === "add" ? "Add Skill" : "Edit Skill"}
              </h3>
              <button
                onClick={() => setSkillModalMode(null)}
                className={styles.modalCloseBtn}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ""}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g. Next.js, Rust, PostgreSQL"
                />
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={editingSkill.category || "frontend"}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, category: e.target.value })
                    }
                    className="select-field"
                  >
                    {data.skillCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Proficiency Level ({editingSkill.level || 80}%)</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={editingSkill.level || 80}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        level: parseInt(e.target.value),
                      })
                    }
                    style={{ marginTop: "0.5rem" }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Years Experience</label>
                  <input
                    type="number"
                    value={editingSkill.years || 3}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        years: parseInt(e.target.value) || 1,
                      })
                    }
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Core Strength?</label>
                  <select
                    value={editingSkill.featured ? "true" : "false"}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        featured: e.target.value === "true",
                      })
                    }
                    className="select-field"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setSkillModalMode(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSaveSkill} className="btn-primary">
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD / EDIT EXPERIENCE --- */}
      {expModalMode && (
        <div className={styles.modalBackdrop}>
          <div className={`glass-panel ${styles.crudModalCard}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {expModalMode === "add" ? "Add Work Experience" : "Edit Work Experience"}
              </h3>
              <button
                onClick={() => setExpModalMode(null)}
                className={styles.modalCloseBtn}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, role: e.target.value })
                    }
                    className="input-field"
                    placeholder="Senior Software Engineer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, company: e.target.value })
                    }
                    className="input-field"
                    placeholder="Acme Systems"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Period / Dates</label>
                  <input
                    type="text"
                    value={editingExp.period || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, period: e.target.value })
                    }
                    className="input-field"
                    placeholder="2022 - Present"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={editingExp.location || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, location: e.target.value })
                    }
                    className="input-field"
                    placeholder="San Francisco, CA (Remote)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Key Achievements (one per line)</label>
                <textarea
                  rows={3}
                  value={(editingExp.achievements || []).join("\n")}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      achievements: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  className="textarea-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={(editingExp.technologies || []).join(", ")}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      technologies: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="input-field"
                  placeholder="Go, Kubernetes, Next.js, PostgreSQL"
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setExpModalMode(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSaveExp} className="btn-primary">
                Save Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {projectToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={`glass-panel ${styles.crudModalCardSmall}`}>
            <div className={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertTriangle size={20} color="var(--accent-rose)" />
                <h3 className={styles.modalTitle}>Confirm Project Deletion</h3>
              </div>
              <button
                onClick={() => setProjectToDelete(null)}
                className={styles.modalCloseBtn}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Are you sure you want to delete this project? This will remove it from the data store once saved.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setProjectToDelete(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(projectToDelete)}
                className="btn-danger"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
