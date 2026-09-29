import React from 'react';
import { Zap, Sparkles, Lock, Smartphone, Gift } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const highlights = [
    {
      title: 'Fast',
      description: 'Zero queue times and instantaneous browser rendering. Operations run immediately on your machine without laggy remote server round-trips.',
      icon: <Zap className="h-5 w-5 text-[#F59E0B]" />,
    },
    {
      title: 'Easy to Use',
      description: 'Streamlined, distraction-free interfaces with zero complicated configurations. Drag, drop, tweak, and download in seconds.',
      icon: <Sparkles className="h-5 w-5 text-[#2563EB]" />,
    },
    {
      title: 'Privacy Focused',
      description: 'Your confidential documents, personal resumes, and photos never leave your device for client-side tools. Total peace of mind.',
      icon: <Lock className="h-5 w-5 text-[#16A34A]" />,
    },
    {
      title: 'Mobile Friendly',
      description: 'Engineered from the ground up for touchscreens, mobile Safari, and Chrome on Android with responsive thumb navigation.',
      icon: <Smartphone className="h-5 w-5 text-[#7C3AED]" />,
    },
    {
      title: 'Free Tools',
      description: 'High-utility everyday productivity software available at zero cost without credit cards, watermarks, or deceptive paywalls.',
      icon: <Gift className="h-5 w-5 text-[#06B6D4]" />,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F8FAFC] dark:bg-slate-900/40 border-y border-[#E2E8F0] dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-blue-400 mb-2">
            Why AI Tools Hub?
          </h2>
          <h3 className="text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
            Designed for speed, data privacy, and daily workflows
          </h3>
          <p className="text-sm text-[#475569] dark:text-slate-400 mt-3 leading-relaxed">
            Most web tools force you to upload sensitive files to remote servers, sign up with credit cards, or deal with intrusive full-page ads. AI Tools Hub does things differently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-6 flex flex-col justify-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 mb-4">
                {item.icon}
              </div>
              <h4 className="text-base font-bold text-[#0F172A] dark:text-white mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
