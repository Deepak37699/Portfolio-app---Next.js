"use client";

import React from "react";
import styles from "./About.module.css";
import { PersonalInfo } from "@/types/portfolio";
import {
  Cpu,
  Layers,
  Zap,
  MapPin,
  Clock,
  Briefcase,
  Mail,
} from "lucide-react";

interface AboutProps {
  personal: PersonalInfo;
}

export default function About({ personal }: AboutProps) {
  const highlights = [
    {
      icon: <Cpu size={22} className={styles.highlightIconEmerald} />,
      title: "Backend & Python Engineering",
      description: "Building robust APIs with FastAPI, Python, Java, and scalable services.",
    },
    {
      icon: <Layers size={22} className={styles.highlightIconPrimary} />,
      title: "Frontend UI & Experience",
      description: "Crafting responsive React interfaces, Bootstrap design, and smooth animations.",
    },
    {
      icon: <Zap size={22} className={styles.highlightIconCyan} />,
      title: "Data & Systems Ops",
      description: "Managing PostgreSQL, MySQL, Hadoop, CI/CD pipelines for reliable deployments.",
    },
  ];

  return (
    <section id="about" className={`section ${styles.aboutSection}`}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-subtitle">Biography & Philosophy</div>
          <h2 className="section-title">
            Engineering for <span className="gradient-accent-text">Performance</span> & Scale
          </h2>
          <p className="section-desc">
            Bridging complex distributed backend computing with pixel-perfect frontend interfaces.
          </p>
        </div>

        <div className={styles.aboutGrid}>
          {/* Bio text cards */}
          <div className={`glass-panel ${styles.bioCard}`}>
            <h3 className={styles.cardHeading}>About My Journey</h3>
            {personal.bio.map((paragraph, index) => (
              <p key={index} className={styles.bioParagraph}>
                {paragraph}
              </p>
            ))}

            <div className={styles.factsGrid}>
              <div className={styles.factItem}>
                <MapPin size={18} className={styles.factIcon} />
                <div>
                  <span className={styles.factLabel}>Location:</span>
                  <strong className={styles.factValue}>{personal.location}</strong>
                </div>
              </div>
              <div className={styles.factItem}>
                <Briefcase size={18} className={styles.factIcon} />
                <div>
                  <span className={styles.factLabel}>Experience:</span>
                  <strong className={styles.factValue}>{personal.yearsOfExperience}+ Years</strong>
                </div>
              </div>
              <div className={styles.factItem}>
                <Clock size={18} className={styles.factIcon} />
                <div>
                  <span className={styles.factLabel}>Status:</span>
                  <strong className={styles.factValue}>{personal.status}</strong>
                </div>
              </div>
              <div className={styles.factItem}>
                <Mail size={18} className={styles.factIcon} />
                <div>
                  <span className={styles.factLabel}>Contact:</span>
                  <strong className={styles.factValue}>{personal.email}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Core Pillars / Highlights */}
          <div className={styles.pillarsColumn}>
            {highlights.map((item, idx) => (
              <div key={idx} className={`glass-panel ${styles.pillarCard}`}>
                <div className={styles.pillarIconWrap}>{item.icon}</div>
                <div className={styles.pillarContent}>
                  <h4 className={styles.pillarTitle}>{item.title}</h4>
                  <p className={styles.pillarDesc}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
