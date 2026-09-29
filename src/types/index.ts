export type ToolCategory = 'all' | 'ai' | 'pdf' | 'image' | 'business' | 'productivity';

export type PlanType = 'free' | 'pro' | 'business';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  badge: 'Free' | 'Pro' | 'New';
  popular?: boolean;
  featured?: boolean;
  metaTitle: string;
  metaDescription: string;
  features: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationYear: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  link: string;
  description: string;
}

export interface ResumeData {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  projects: ProjectItem[];
  skills: string[];
  certifications: string[];
  languages: string[];
  template: 'modern' | 'professional' | 'simple' | 'ats';
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: 'AI Tools' | 'Resume & Career' | 'PDF Guides' | 'Image Optimization' | 'Productivity' | 'Business Tools';
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
  relatedToolSlug?: string;
  keywords: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'privacy' | 'pricing' | 'tools';
}
