export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  location: string;
  status: string;
  email: string;
  phone?: string;
  avatar: string;
  resumeUrl: string;
  yearsOfExperience: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
  icon: string;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-100
  category: string;
  featured: boolean;
  years?: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  category: "Full-Stack" | "Backend & Systems" | "Cloud & AI" | "Frontend & UI";
  featured: boolean;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  metrics: string[];
  highlights: string[];
  image: string;
  architecture?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  type: string;
  isCurrent: boolean;
  achievements: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  gpa?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  badge?: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  socials: SocialLink[];
  metrics: MetricItem[];
  skillCategories: SkillCategory[];
  skills: SkillItem[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

