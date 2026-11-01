"use client";

import React, { useState } from "react";
import styles from "./Contact.module.css";
import { PersonalInfo, SocialLink } from "@/types/portfolio";
import {
  Mail,
  Copy,
  Check,
  Send,
  MapPin,
  Clock,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/Icons";

interface ContactProps {
  personal: PersonalInfo;
  socials: SocialLink[];
  onNotify: (msg: string, type: "success" | "error" | "info") => void;
}

export default function Contact({ personal, socials, onNotify }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopiedEmail(true);
      onNotify("Email address copied to clipboard!", "success");
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      onNotify("Failed to copy email", "error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onNotify("Please fill out all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    // Simulate instant sending
    setTimeout(() => {
      setIsSubmitting(false);
      onNotify(
        `Thank you ${formData.name}! Your message has been received.`,
        "success"
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 600);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <GithubIcon size={18} />;
      case "linkedin":
        return <LinkedinIcon size={18} />;
      case "twitter / x":
      case "twitter":
        return <TwitterIcon size={18} />;
      default:
        return <Mail size={18} />;
    }
  };

  return (
    <section id="contact" className={`section ${styles.contactSection}`}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-subtitle">Get In Touch</div>
          <h2 className="section-title">
            Let&apos;s Build Something <span className="gradient-accent-text">Exceptional</span>
          </h2>
          <p className="section-desc">
            Whether you have an upcoming project, engineering leadership role, or technical challenge.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Direct Info Card */}
          <div className={`glass-panel ${styles.infoPanel}`}>
            <h3 className={styles.panelTitle}>Contact Information</h3>
            <p className={styles.panelIntro}>
              Feel free to reach out via email, social networks, or using the contact form. I typically respond within 24 hours.
            </p>

            <div className={styles.directChannels}>
              {/* Copy email widget */}
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <Mail size={20} />
                </div>
                <div className={styles.channelText}>
                  <span className={styles.channelLabel}>Direct Email</span>
                  <div className={styles.emailRow}>
                    <span className={styles.channelValue}>{personal.email}</span>
                    <button
                      onClick={handleCopyEmail}
                      className={styles.copyBtn}
                      title="Copy email to clipboard"
                    >
                      {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedEmail ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <MapPin size={20} />
                </div>
                <div className={styles.channelText}>
                  <span className={styles.channelLabel}>Location</span>
                  <span className={styles.channelValue}>{personal.location}</span>
                </div>
              </div>

              {/* Status */}
              <div className={styles.channelItem}>
                <div className={styles.channelIcon}>
                  <Clock size={20} />
                </div>
                <div className={styles.channelText}>
                  <span className={styles.channelLabel}>Availability</span>
                  <div className={styles.availabilityRow}>
                    <span className="pulsing-dot" />
                    <span className={styles.channelValue}>{personal.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className={styles.socialFollow}>
              <span className={styles.followLabel}>Find me on:</span>
              <div className={styles.socialIconsRow}>
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialCircle}
                    title={s.platform}
                  >
                    {getSocialIcon(s.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className={`glass-panel ${styles.formPanel}`}>
            <h3 className={styles.panelTitle}>Send a Message</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Deepak Yadav"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Your Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="deepak@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Development / Project Collaboration"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Hi Deepak, I'd like to discuss an opportunity..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="textarea-field"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Send size={16} />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
