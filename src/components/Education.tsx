"use client";

import React from "react";
import styles from "./Education.module.css";
import { EducationItem, CertificationItem } from "@/types/portfolio";
import { GraduationCap, Award, ExternalLink, CheckCircle } from "lucide-react";

interface EducationProps {
  education: EducationItem[];
  certifications: CertificationItem[];
}

export default function Education({ education, certifications }: EducationProps) {
  return (
    <section id="education" className={`section ${styles.eduSection}`}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-subtitle">Credentials & Academics</div>
          <h2 className="section-title">
            Education & <span className="gradient-accent-text">Certifications</span>
          </h2>
          <p className="section-desc">
            Foundational academic rigor complemented by industry-standard credentials.
          </p>
        </div>

        <div className={styles.eduGrid}>
          {/* Education Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <GraduationCap size={24} className={styles.columnIconPrimary} />
              <h3 className={styles.columnTitle}>Academic Degrees</h3>
            </div>

            <div className={styles.cardsList}>
              {education.map((item) => (
                <div key={item.id} className={`glass-panel ${styles.eduCard}`}>
                  <div className={styles.eduHeader}>
                    <div>
                      <h4 className={styles.degreeTitle}>{item.degree}</h4>
                      <div className={styles.institutionName}>{item.institution}</div>
                    </div>
                    <span className={styles.periodPill}>{item.period}</span>
                  </div>

                  {item.gpa && (
                    <div className={styles.gpaBadge}>GPA: {item.gpa}</div>
                  )}

                  <ul className={styles.highlightsList}>
                    {item.highlights.map((hl, i) => (
                      <li key={i} className={styles.highlightItem}>
                        <CheckCircle size={14} className={styles.checkIcon} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <Award size={24} className={styles.columnIconCyan} />
              <h3 className={styles.columnTitle}>Industry Certifications</h3>
            </div>

            <div className={styles.cardsList}>
              {certifications.map((cert) => (
                <div key={cert.id} className={`glass-panel ${styles.certCard}`}>
                  <div className={styles.certHeader}>
                    <div className={styles.certBadgeWrap}>
                      <span className={styles.badgeCode}>{cert.badge || "CERT"}</span>
                    </div>

                    <div className={styles.certInfo}>
                      <h4 className={styles.certName}>{cert.name}</h4>
                      <div className={styles.issuerRow}>
                        <span>{cert.issuer}</span>
                        <span className={styles.dotSeparator}>•</span>
                        <span className={styles.certYear}>Issued {cert.issueDate}</span>
                      </div>
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <span>Verify Credential</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

