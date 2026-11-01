"use client";

import React from "react";
import styles from "./Footer.module.css";
import { ArrowUp, Code2 } from "lucide-react";

interface FooterProps {
  developerName: string;
}

export default function Footer({ developerName }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandRow}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <Code2 size={18} />
            </div>
            <span className={styles.brandName}>{developerName}</span>
          </div>

          <div className={styles.quickLinks}>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </div>

          <button
            onClick={scrollToTop}
            className={styles.backToTopBtn}
            aria-label="Back to top"
            title="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>

        <div className={styles.copyrightRow}>
          <p>
            © 2026 {developerName}.
          </p>
        </div>
      </div>
    </footer>
  );
}
