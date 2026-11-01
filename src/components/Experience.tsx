"use client";

import React from "react";
import styles from "./Experience.module.css";
import { ExperienceItem } from "@/types/portfolio";
import { Calendar, MapPin, CheckCircle2 } from "lucide-react";

interface ExperienceProps {
  experience: ExperienceItem[];
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className={`section ${styles.experienceSection}`}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-subtitle">Career Trajectory</div>
          <h2 className="section-title">
            Work <span className="gradient-accent-text">Experience</span>
          </h2>
          <p className="section-desc">
            A track record of engineering leadership, scalable systems, and continuous delivery.
          </p>
        </div>

        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine} />

          {experience.map((item) => (
            <div key={item.id} className={styles.timelineItem}>
              {/* Timeline marker node */}
              <div
                className={`${styles.timelineNode} ${
                  item.isCurrent ? styles.currentNode : ""
                }`}
              >
                <div className={styles.nodeInnerDot} />
              </div>

              {/* Card */}
              <div className={`glass-panel ${styles.timelineCard}`}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.roleTitle}>{item.role}</h3>
                    <div className={styles.companyName}>
                      {item.company}
                      <span className={styles.typeBadge}>{item.type}</span>
                    </div>
                  </div>

                  <div className={styles.metaRow}>
                    <span className={styles.periodBadge}>
                      <Calendar size={14} />
                      {item.period}
                    </span>
                    <span className={styles.locationBadge}>
                      <MapPin size={14} />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Achievements List */}
                <ul className={styles.achievementsList}>
                  {item.achievements.map((ach, i) => (
                    <li key={i} className={styles.achievementItem}>
                      <CheckCircle2 size={16} className={styles.checkIcon} />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>

                {/* Technologies */}
                <div className={styles.techStackRow}>
                  {item.technologies.map((tech, i) => (
                    <span key={i} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
