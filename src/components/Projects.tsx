"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import styles from "./Projects.module.css";
import { Project } from "@/types/portfolio";
import ProjectModal from "./ProjectModal";
import {
  Search,
  ExternalLink,
  Maximize2,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        project.title.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className={`section ${styles.projectsSection}`}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-subtitle">Featured Work</div>
          <h2 className="section-title">
            Engineered for <span className="gradient-accent-text">Real-World Scale</span>
          </h2>
          <p className="section-desc">
            Production systems, microservices, and modern web applications.
          </p>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className={styles.controlsRow}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by tech, keyword, or architecture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={styles.clearSearchBtn}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.categoryPill} ${
                  selectedCategory === cat ? styles.activeCategoryPill : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <SlidersHorizontal size={36} className={styles.emptyIcon} />
            <h3>No matching projects found</h3>
            <p>Try searching with another keyword or resetting the category filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <div key={project.id} className={`glass-panel ${styles.projectCard}`}>
                {/* Thumbnail */}
                <div
                  className={styles.imageWrap}
                  onClick={() => setActiveModalProject(project)}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={560}
                    height={320}
                    className={styles.thumbnailImg}
                  />
                  <div className={styles.imageOverlay}>
                    <span className={styles.viewDetailsBadge}>
                      <Maximize2 size={16} />
                      View Case Study
                    </span>
                  </div>

                  {project.featured && (
                    <div className={styles.featuredBadge}>
                      <Sparkles size={12} />
                      <span>Featured</span>
                    </div>
                  )}

                  <div className={styles.categoryBadge}>{project.category}</div>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3
                    className={styles.cardTitle}
                    onClick={() => setActiveModalProject(project)}
                  >
                    {project.title}
                  </h3>

                  <p className={styles.cardTagline}>{project.tagline}</p>
                  <p className={styles.cardDesc}>{project.description}</p>

                  {/* Highlights or Metrics Preview */}
                  {project.metrics && project.metrics[0] && (
                    <div className={styles.highlightPill}>
                      <span className={styles.highlightPillDot} />
                      <span>{project.metrics[0]}</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className={styles.tagsRow}>
                    {project.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="badge">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="badge">+{project.tags.length - 4}</span>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className={styles.cardFooter}>
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className={styles.caseStudyBtn}
                    >
                      <span>Case Study</span>
                      <ArrowRight size={15} />
                    </button>

                    <div className={styles.outboundLinks}>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.iconLink}
                          aria-label="GitHub Repository"
                          title="GitHub Repository"
                        >
                          <GithubIcon size={18} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.iconLink}
                          aria-label="Live Demo"
                          title="Live Demo"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
}
