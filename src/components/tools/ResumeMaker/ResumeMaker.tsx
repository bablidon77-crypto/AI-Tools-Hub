import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { ResumeData, ExperienceItem, EducationItem, ProjectItem } from '../../../types';
import { requestAIGeneration } from '../../../services/aiService';
import { trackEvent } from '../../../utils/analytics';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Check,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Award,
  BookOpen
} from 'lucide-react';
import resumeHeroImg from '../../../assets/images/resume_builder_preview_1790611029315.jpg';

const initialResumeData: ResumeData = {
  fullName: 'Sarah Jenkins',
  professionalTitle: 'Senior Full Stack Engineer',
  email: 'sarah.jenkins@example.com',
  phone: '+1 (555) 382-9102',
  location: 'Austin, TX',
  website: 'https://sarahjenkins.dev',
  linkedin: 'linkedin.com/in/sarahjenkins',
  github: 'github.com/sarahjenkins',
  summary:
    'Results-driven Senior Full Stack Engineer with 7+ years of experience engineering scalable web platforms, high-throughput microservices, and reactive user interfaces. Proven track record of reducing latency by 45% and mentoring distributed engineering teams.',
  experiences: [
    {
      id: '1',
      role: 'Lead Frontend Architect',
      company: 'CloudScale Technologies',
      location: 'San Francisco, CA',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      description:
        'Architected real-time analytics dashboard serving 120,000+ daily active users using React, TypeScript, and WebSockets. Led a squad of 8 engineers and improved Core Web Vitals to 98th percentile.',
    },
    {
      id: '2',
      role: 'Full Stack Software Engineer',
      company: 'Nexis Enterprise Systems',
      location: 'Austin, TX',
      startDate: '2020',
      endDate: '2023',
      current: false,
      description:
        'Developed REST & GraphQL microservices with Node.js and PostgreSQL. Migrated legacy monolith into containerized services, cutting infrastructure hosting costs by 32%.',
    },
  ],
  educations: [
    {
      id: '1',
      degree: 'B.S. in Computer Science',
      school: 'University of Texas at Austin',
      location: 'Austin, TX',
      graduationYear: '2019',
      description: 'Graduated Magna Cum Laude. Focused on distributed systems and algorithm complexity.',
    },
  ],
  projects: [
    {
      id: '1',
      name: 'OmniStream Analytics',
      role: 'Creator & Maintainer',
      link: 'github.com/sarahjenkins/omnistream',
      description: 'Open-source distributed event telemetry pipeline handling 50k events/sec in Node.js.',
    },
  ],
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'Next.js',
    'Tailwind CSS',
    'PostgreSQL',
    'Docker',
    'GraphQL',
    'AWS Cloud',
    'System Architecture',
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate',
    'Certified Kubernetes Application Developer (CKAD)',
  ],
  languages: ['English (Native)', 'Spanish (Professional Working)'],
  template: 'modern',
};

export const ResumeMaker: React.FC = () => {
  const { addToast, incrementAiUsage, userPlan, openUpgradeModal } = useApp();

  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem('aitoolshub_saved_resume');
      return saved ? JSON.parse(saved) : initialResumeData;
    } catch {
      return initialResumeData;
    }
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [langInput, setLangInput] = useState('');

  // Auto-save to localStorage
  const handleSave = () => {
    localStorage.setItem('aitoolshub_saved_resume', JSON.stringify(resume));
    addToast('success', 'Resume saved to your browser local storage!');
    trackEvent('tool_complete', { tool_name: 'ai-resume-maker', action: 'save' });
  };

  const handleReset = () => {
    if (window.confirm('Reset resume to blank template?')) {
      const blank: ResumeData = {
        fullName: '',
        professionalTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: '',
        experiences: [],
        educations: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: [],
        template: 'modern',
      };
      setResume(blank);
      localStorage.removeItem('aitoolshub_saved_resume');
      addToast('info', 'Resume reset to blank.');
    }
  };

  const handleLoadSample = () => {
    setResume(initialResumeData);
    addToast('success', 'Sample resume loaded successfully.');
  };

  const handlePrint = () => {
    trackEvent('download', { tool_name: 'ai-resume-maker', format: 'pdf_print' });
    window.print();
  };

  // AI Assistance Handler
  const handleAiAction = async (action: 'summary' | 'experience' | 'skills', index?: number) => {
    const allowed = incrementAiUsage();
    if (!allowed) return;

    setIsAiLoading(true);

    let prompt = '';
    let systemInstruction = 'You are a certified executive resume strategist and ATS optimization expert.';

    if (action === 'summary') {
      prompt = `Review and enhance this resume professional summary for high ATS score and impact. Make it punchy, metric-driven, and confident without being arrogant:
Job Title: ${resume.professionalTitle || 'Software Engineer'}
Current Summary: ${resume.summary || 'Seeking a challenging role in tech.'}

Provide only the improved 3-4 sentence professional summary text, with no preamble or conversational filler.`;
    } else if (action === 'experience' && index !== undefined) {
      const exp = resume.experiences[index];
      prompt = `Improve the following bullet description for a resume role to maximize ATS keyword matching and active action verbs:
Role: ${exp.role} at ${exp.company}
Description: ${exp.description}

Provide only the revised 2-3 sentence impactful accomplishment description with strong action verbs.`;
    } else if (action === 'skills') {
      prompt = `Suggest 8-10 high-value technical and core skills relevant to a candidate with title: "${resume.professionalTitle || 'Software Engineer'}" and current skills: "${resume.skills.join(', ')}". Return as a comma-separated list of skill names only.`;
    }

    const res = await requestAIGeneration({
      prompt,
      systemInstruction,
      toolType: 'resume-maker',
    });

    setIsAiLoading(false);

    if (res.success && res.result) {
      const output = res.result.trim();
      if (action === 'summary') {
        setResume((prev) => ({ ...prev, summary: output }));
        addToast('success', 'Professional summary enhanced with AI!');
      } else if (action === 'experience' && index !== undefined) {
        setResume((prev) => {
          const exps = [...prev.experiences];
          exps[index].description = output;
          return { ...prev, experiences: exps };
        });
        addToast('success', 'Work experience description polished!');
      } else if (action === 'skills') {
        const newSkills = output
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s && !resume.skills.includes(s));
        setResume((prev) => ({ ...prev, skills: [...prev.skills, ...newSkills] }));
        addToast('success', `Added ${newSkills.length} suggested skills!`);
      }
    } else if (res.isConfigError) {
      addToast('info', res.message || 'API key not configured in environment.');
    } else {
      addToast('error', res.message || 'AI generation failed. Please try again.');
    }
  };

  // Experience Handlers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setResume((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  };

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationYear: '',
      description: '',
    };
    setResume((prev) => ({ ...prev, educations: [...prev.educations, newEdu] }));
  };

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      educations: prev.educations.filter((e) => e.id !== id),
    }));
  };

  // Projects Handlers
  const addProject = () => {
    const newProj: ProjectItem = {
      id: Date.now().toString(),
      name: '',
      role: '',
      link: '',
      description: '',
    };
    setResume((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const removeProject = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Skills handlers
  const addSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (!skillInput.trim()) return;
    if (!resume.skills.includes(skillInput.trim())) {
      setResume((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Control Bar */}
      <div className="no-print rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-[#2563EB]/10 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
                  AI Resume Maker & ATS Builder
                </h2>
                <p className="text-xs text-[#475569] dark:text-slate-400">
                  Live real-time preview, ATS formats, and browser-local data storage
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-xs font-semibold text-[#0F172A] dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>Save</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="px-3 py-2 text-xs font-medium text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white cursor-pointer"
            >
              Sample Data
            </button>

            <button
              onClick={handleReset}
              className="p-2 text-[#475569] hover:text-[#DC2626] rounded-lg cursor-pointer"
              title="Reset resume"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Template Selector & Mobile View Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Template:
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
              {(['modern', 'professional', 'simple', 'ats'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setResume((prev) => ({ ...prev, template: t }))}
                  className={`px-3 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    resume.template === t
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle View for Tablets/Mobile */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Editor on Left, Live Sheet on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Editor Form (Hidden on mobile if preview tab active) */}
        <div
          className={`no-print xl:col-span-6 space-y-6 ${
            activeTab === 'preview' ? 'hidden xl:block' : 'block'
          }`}
        >
          
          {/* Personal Info Card */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={resume.professionalTitle}
                  onChange={(e) => setResume({ ...resume, professionalTitle: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => setResume({ ...resume, email: e.target.value })}
                  placeholder="e.g. sarah@example.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={resume.location}
                  onChange={(e) => setResume({ ...resume, location: e.target.value })}
                  placeholder="e.g. Austin, TX"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  LinkedIn or Portfolio
                </label>
                <input
                  type="text"
                  value={resume.linkedin}
                  onChange={(e) => setResume({ ...resume, linkedin: e.target.value })}
                  placeholder="e.g. linkedin.com/in/sarahjenkins"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary with AI */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Professional Summary
              </h3>
              <button
                disabled={isAiLoading}
                onClick={() => handleAiAction('summary')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isAiLoading ? 'Improving...' : 'Improve with AI'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={resume.summary}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              placeholder="Highlight your years of experience, core technical specialties, and primary career achievements..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Work Experience */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Work Experience ({resume.experiences.length})
                </h3>
              </div>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Position #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      title="Delete experience"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const next = [...resume.experiences];
                        next[idx].role = e.target.value;
                        setResume({ ...resume, experiences: next });
                      }}
                      placeholder="Role (e.g. Senior Frontend Engineer)"
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const next = [...resume.experiences];
                        next[idx].company = e.target.value;
                        setResume({ ...resume, experiences: next });
                      }}
                      placeholder="Company (e.g. Acme Corp)"
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => {
                        const next = [...resume.experiences];
                        next[idx].startDate = e.target.value;
                        setResume({ ...resume, experiences: next });
                      }}
                      placeholder="Start (e.g. 2021)"
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => {
                        const next = [...resume.experiences];
                        next[idx].endDate = e.target.value;
                        setResume({ ...resume, experiences: next });
                      }}
                      placeholder="End (e.g. Present)"
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Accomplishments & Impact
                      </span>
                      <button
                        disabled={isAiLoading || !exp.description}
                        onClick={() => handleAiAction('experience', idx)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Enhance with AI</span>
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => {
                        const next = [...resume.experiences];
                        next[idx].description = e.target.value;
                        setResume({ ...resume, experiences: next });
                      }}
                      placeholder="Describe what you built, technologies used, and metrics achieved..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Projects Section */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Education ({resume.educations.length})
                </h3>
              </div>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Degree</span>
              </button>
            </div>

            <div className="space-y-3">
              {resume.educations.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [...resume.educations];
                        next[idx].degree = e.target.value;
                        setResume({ ...resume, educations: next });
                      }}
                      placeholder="Degree / Field"
                      className="font-semibold text-xs bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none flex-1"
                    />
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-[#475569] hover:text-[#DC2626] p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => {
                        const next = [...resume.educations];
                        next[idx].school = e.target.value;
                        setResume({ ...resume, educations: next });
                      }}
                      placeholder="School / University"
                      className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => {
                        const next = [...resume.educations];
                        next[idx].graduationYear = e.target.value;
                        setResume({ ...resume, educations: next });
                      }}
                      placeholder="Graduation Year (e.g. 2020)"
                      className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills with AI Suggestions */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Skills ({resume.skills.length})
                </h3>
              </div>
              <button
                disabled={isAiLoading}
                onClick={() => handleAiAction('skills')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3" />
                <span>Suggest Skills</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Type a skill and press Enter (e.g. React, Docker, Python)..."
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={addSkill}
                className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-[#475569] hover:text-[#DC2626] cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Live Resume Sheet (Right Column / Preview Tab) */}
        <div
          className={`xl:col-span-6 sticky top-24 ${
            activeTab === 'editor' ? 'hidden xl:block' : 'block'
          }`}
        >
          <div className="no-print mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Live ATS Document Preview</span>
            <span className="font-mono text-[11px] uppercase">
              Template: {resume.template}
            </span>
          </div>

          {/* Printable White Paper Sheet Container */}
          <div
            id="resume-print-area"
            className="resume-sheet bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 font-sans transition-all overflow-hidden"
            style={{ minHeight: '840px' }}
          >
            
            {/* Header Lockup based on Template */}
            <div
              className={`pb-6 mb-6 ${
                resume.template === 'modern'
                  ? 'border-b-2 border-blue-600'
                  : resume.template === 'professional'
                  ? 'border-b border-slate-300 text-center'
                  : resume.template === 'ats'
                  ? 'border-b border-black'
                  : 'border-b border-slate-200'
              }`}
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {resume.fullName || 'Your Full Name'}
              </h1>
              <div className="text-sm font-semibold text-blue-700 mt-1">
                {resume.professionalTitle || 'Professional Title'}
              </div>

              {/* Metadata Separator Row */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-3">
                {resume.email && <span>{resume.email}</span>}
                {resume.email && resume.phone && <span aria-hidden="true">·</span>}
                {resume.phone && <span>{resume.phone}</span>}
                {resume.phone && resume.location && <span aria-hidden="true">·</span>}
                {resume.location && <span>{resume.location}</span>}
                {resume.location && resume.linkedin && <span aria-hidden="true">·</span>}
                {resume.linkedin && <span>{resume.linkedin}</span>}
              </div>
            </div>

            {/* Summary */}
            {resume.summary && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  Professional Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {resume.summary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {resume.experiences.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1">
                  Experience
                </h4>
                <div className="space-y-4">
                  {resume.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-900">
                          {exp.role || 'Role'} <span className="font-normal text-slate-600">at {exp.company || 'Company'}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-700 leading-relaxed pl-2 border-l border-slate-200">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.educations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1">
                  Education
                </h4>
                <div className="space-y-2">
                  {resume.educations.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree}</span>
                        <span className="text-slate-600">, {edu.school}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {edu.graduationYear}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Skills */}
            {resume.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  Core Competencies & Skills
                </h4>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-700">
                  {resume.skills.map((skill, i) => (
                    <span key={skill}>
                      {skill}
                      {i < resume.skills.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && (
              <div className="mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  Certifications
                </h4>
                <div className="text-xs text-slate-700 space-y-1">
                  {resume.certifications.map((cert, idx) => (
                    <div key={idx}>· {cert}</div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
