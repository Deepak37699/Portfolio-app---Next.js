"use client";

import React, { useState } from "react";
import styles from "./Skills.module.css";
import { SkillCategory, SkillItem } from "@/types/portfolio";
import { BadgeCheck } from "lucide-react";

interface SkillsProps {
  categories: SkillCategory[];
  skills: SkillItem[];
}

export default function Skills({ categories, skills }: SkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredSkills =
    selectedCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === selectedCategory);

  return (
    <section id="skills" className={`section ${styles.skillsSection}`}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-subtitle">Technical Expertise</div>
          <h2 className="section-title">
            Skills & <span className="gradient-accent-text">Technologies</span>
          </h2>
          <p className="section-desc">
            A battle-tested technology stack refined across production environments.
          </p>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabContainer}>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`${styles.tabBtn} ${
              selectedCategory === "all" ? styles.activeTab : ""
            }`}
          >
            All Disciplines ({skills.length})
          </button>
          {categories.map((cat) => {
            const count = skills.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.tabBtn} ${
                  selectedCategory === cat.id ? styles.activeTab : ""
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className={styles.skillsGrid}>
          {filteredSkills.map((skill) => (
            <div key={skill.id} className={`glass-panel ${styles.skillCard}`}>
              <div className={styles.skillHeader}>
                <div className={styles.skillNameWrap}>
                  <span className={styles.skillName}>{skill.name}</span>
                  {skill.featured && (
                    <span className="badge badge-accent" title="Primary core strength">
                      <BadgeCheck size={11} />
                      Core
                    </span>
                  )}
                </div>
                <span className={styles.skillLevelNumber}>{skill.level}%</span>
              </div>

              {/* Progress bar */}
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <div className={styles.skillFooter}>
                <span className={styles.skillCategoryTag}>
                  {skill.category.toUpperCase()}
                </span>
                {skill.years && (
                  <span className={styles.skillYears}>{skill.years} yrs exp</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
