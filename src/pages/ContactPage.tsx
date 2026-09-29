import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updateSEO } from '../utils/seo';
import { Mail, Send, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    updateSEO({
      title: 'Contact Support & Feedback – AI Tools Hub',
      description:
        'Have inquiries, tool feedback, or partnership requests? Send a message to the AI Tools Hub engineering and support team.',
      canonicalPath: '/contact',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast('error', 'Please fill out all required fields.');
      return;
    }

    setSubmitted(true);
    addToast('success', 'Your message has been sent to our support desk.');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Contact Support' }]} />

      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Contact & Inquiries
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Have feedback on a tool, feature suggestions, or business inquiries? We'd love to hear from you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Form */}
        <div className="md:col-span-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Message Received!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting AI Tools Hub. A support representative will review your message and reply via email within 24 to 48 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="mt-4 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  id="contact-name"
                  name="fullName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Feature suggestion for PDF Split"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide specific details or feedback..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                aria-label="Submit Contact Inquiry"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Info Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>Direct Support Channel</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For security vulnerability reports, bug disclosures, or general support:
            </p>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-blue-600 dark:text-blue-400">
              support@aitoolshub.io
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <span>Common Support Questions</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <p>
                <strong>Need an API Key?</strong> Configure your Gemini API key in the admin settings or server environment to enable live copywriting generation.
              </p>
              <p>
                <strong>File upload issues?</strong> Verify your files are under 50MB and use standard formats (PNG, JPG, PDF).
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
