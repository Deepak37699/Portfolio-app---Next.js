"use client";

import React, { useState, useEffect } from "react";
import initialPortfolioData from "@/data/portfolio.json";
import { PortfolioData } from "@/types/portfolio";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Toast, { ToastMessage } from "@/components/Toast";
import JsonViewerModal from "@/components/JsonViewerModal";

export default function Home() {
  const [data, setData] = useState<PortfolioData>(
    initialPortfolioData as PortfolioData
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Refresh data from /api/portfolio on mount to catch any runtime updates
  useEffect(() => {
    const loadFreshData = async () => {
      try {
        const res = await fetch("/api/portfolio", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch {
        // Fallback to initialPortfolioData
      }
    };
    loadFreshData();
  }, []);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {/* Sticky Glass Navbar */}
      <Navbar developerName={data.personal.name} />

      {/* Main Sections */}
      <main>
        <Hero
          personal={data.personal}
          metrics={data.metrics}
          socials={data.socials}
          onOpenJsonModal={() => setIsJsonModalOpen(true)}
        />

        <About personal={data.personal} />

        <Skills
          categories={data.skillCategories}
          skills={data.skills}
        />

        <Projects projects={data.projects} />

        <Experience experience={data.experience} />

        <Education
          education={data.education}
          certifications={data.certifications}
        />

        <Contact
          personal={data.personal}
          socials={data.socials}
          onNotify={addToast}
        />
      </main>

      {/* Footer */}
      <Footer developerName={data.personal.name} />

      {/* Global Interactive Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
      <JsonViewerModal
        data={data}
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onNotify={addToast}
      />
    </>
  );
}
