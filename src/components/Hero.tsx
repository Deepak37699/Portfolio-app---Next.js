"use client";

import React from "react";
import Image from "next/image";
import styles from "./Hero.module.css";
import { PersonalInfo, MetricItem, SocialLink } from "@/types/portfolio";
import {
  ArrowRight,
  Mail,
  Sparkles,
  Terminal,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/Icons";

interface HeroProps {
  personal: PersonalInfo;
  metrics: MetricItem[];
  socials: SocialLink[];
  onOpenJsonModal: () => void;
}

export default function Hero({
  personal,
  metrics,
  socials,
  onOpenJsonModal,
}: HeroProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <GithubIcon size={20} />;
      case "linkedin":
        return <LinkedinIcon size={20} />;
      case "twitter / x":
      case "twitter":
        return <TwitterIcon size={20} />;
      default:
        return <Mail size={20} />;
    }
  };

  return (
    <section id="hero" className={styles.heroSection}>
      {/* Background ambient glowing orbs */}
      <div className={styles.ambientGlowPrimary} />
      <div className={styles.ambientGlowCyan} />

      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            <span className="pulsing-dot" />
            <span className={styles.statusText}>{personal.status}</span>
          </div>

          {/* Main Title & Headline */}
          <h1 className={styles.headline}>
            Crafting Scalable <br />
            <span className="gradient-text">{personal.title}</span>
          </h1>

          <p className={styles.tagline}>{personal.tagline}</p>

          {/* Action CTAs */}
          <div className={styles.ctaGroup}>
            <a href="#projects" className="btn-primary">
              <span>Explore Projects</span>
              <ArrowRight size={18} />
            </a>
            <a href="#contact" className="btn-secondary">
              <span>Get In Touch</span>
            </a>
            <button
              onClick={onOpenJsonModal}
              className={styles.jsonPillBtn}
              title="Explore the JSON schema behind this app"
            >
              <Terminal size={16} />
              <span>Data via JSON</span>
            </button>
          </div>

          {/* Social Links */}
          <div className={styles.socialGroup}>
            <span className={styles.socialLabel}>Connect:</span>
            {socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label={social.platform}
                title={`${social.platform}: ${social.username}`}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        </div>

        {/* Hero Visual: Avatar & floating badges */}
        <div className={styles.heroVisual}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarRing} />
            <div className={styles.avatarImageContainer}>
              <Image
                src={personal.avatar}
                alt={personal.name}
                width={360}
                height={360}
                priority
                className={styles.avatarImg}
              />
            </div>

            {/* Floating Info Badges */}
            <div className={`${styles.floatingBadge} ${styles.badgeTopLeft}`}>
              <Sparkles size={16} className={styles.badgeIconPrimary} />
              <span>Full-Stack & Cloud Architecture</span>
            </div>

            <div className={`${styles.floatingBadge} ${styles.badgeBottomRight}`}>
              <div className="pulsing-dot" />
              <span>{personal.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={`container ${styles.metricsContainer}`}>
        <div className={styles.metricsGrid}>
          {metrics.map((metric) => (
            <div key={metric.id} className={`glass-panel ${styles.metricCard}`}>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricDesc}>{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
