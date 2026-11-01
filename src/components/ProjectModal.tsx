"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import styles from "./ProjectModal.module.css";
import { Project } from "@/types/portfolio";
import {
  X,
  ExternalLink,
  CheckCircle,
  Cpu,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`glass-panel ${styles.modalCard}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header bar */}
        <div className={styles.modalHeader}>
          <div className={styles.headerBadges}>
            <span className="badge badge-accent">{project.category}</span>
            {project.featured && (
              <span className="badge badge-cyan">
                <Sparkles size={12} />
                Featured Project
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalScrollBody}>
          <div className={styles.imageContainer}>
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={440}
              className={styles.projectImg}
            />
          </div>

          <div className={styles.contentWrap}>
            <h2 className={styles.projectTitle}>{project.title}</h2>
            <p className={styles.projectTagline}>{project.tagline}</p>

            <div className={styles.actionRow}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink size={16} />
                  <span>Launch Live Demo</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <GithubIcon size={16} />
                  <span>View Source Code</span>
                </a>
              )}
            </div>

            {/* In-depth description */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>System Architecture & Overview</h3>
              <p className={styles.fullDesc}>{project.fullDescription}</p>
            </div>

            {/* Architecture note if present */}
            {project.architecture && (
              <div className={styles.architectureBox}>
                <div className={styles.architectureHeader}>
                  <Cpu size={18} className={styles.archIcon} />
                  <span>Architecture & Stack Blueprint</span>
                </div>
                <code>{project.architecture}</code>
              </div>
            )}

            {/* Key Engineering Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>Technical Highlights</h3>
                <ul className={styles.highlightsList}>
                  {project.highlights.map((item, idx) => (
                    <li key={idx} className={styles.highlightItem}>
                      <CheckCircle size={16} className={styles.checkIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Performance Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>Measured Impact & Metrics</h3>
                <div className={styles.metricsGrid}>
                  {project.metrics.map((metric, idx) => (
                    <div key={idx} className={styles.metricPill}>
                      <span className={styles.metricDot} />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Tags */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>Technologies Used</h3>
              <div className={styles.tagsContainer}>
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
