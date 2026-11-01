"use client";

import React, { useState, useEffect } from "react";
import styles from "./JsonViewerModal.module.css";
import { PortfolioData } from "@/types/portfolio";
import {
  X,
  Copy,
  Check,
  Download,
  FileCode2,
  Info,
} from "lucide-react";

interface JsonViewerModalProps {
  data: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string, type: "success" | "error" | "info") => void;
}

export default function JsonViewerModal({
  data,
  isOpen,
  onClose,
  onNotify,
}: JsonViewerModalProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "personal" | "projects" | "skills" | "experience"
  >("all");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getFilteredJsonString = () => {
    if (activeTab === "all") return JSON.stringify(data, null, 2);
    return JSON.stringify(data[activeTab], null, 2);
  };

  const jsonString = getFilteredJsonString();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      onNotify("JSON copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify("Failed to copy JSON to clipboard", "error");
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onNotify("portfolio.json downloaded!", "success");
    } catch {
      onNotify("Failed to download JSON file", "error");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={`glass-panel ${styles.modalCard}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <div className={styles.codeIconWrap}>
              <FileCode2 size={20} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>src/data/portfolio.json</h3>
              <p className={styles.modalSubtitle}>
                Single source of truth powering this entire portfolio application
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Controls & Tabs */}
        <div className={styles.controlsBar}>
          <div className={styles.tabsRow}>
            {(["all", "personal", "projects", "skills", "experience"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${styles.tabBtn} ${
                    activeTab === tab ? styles.activeTabBtn : ""
                  }`}
                >
                  {tab === "all" ? "Full portfolio.json" : tab}
                </button>
              )
            )}
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={handleCopy}
              className={styles.actionBtn}
              title="Copy active JSON snippet"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? "Copied" : "Copy JSON"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn-primary btn-sm"
              title="Download entire portfolio.json"
            >
              <Download size={15} />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code display body */}
        <div className={styles.codeArea}>
          <pre className={styles.preCode}>
            <code>{jsonString}</code>
          </pre>
        </div>

        {/* Footer info tip */}
        <div className={styles.modalFooter}>
          <div className={styles.infoBadge}>
            <Info size={14} className={styles.infoIcon} />
            <span>
              Tip: You can customize any project or skill without touching UI code via the{" "}
              <strong>/dashboard</strong> page.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
