"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-16 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-4">
          <span>Get In Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight mb-4 font-sans">
          We&apos;d love to hear from you.
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Have questions about prompts, custom enterprise blueprints, or partnership inquiries? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10">
        
        {/* Contact Form */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Message received!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Thanks for reaching out. A team member will respond to your email within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you're working on or what prompts you need..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-xs transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold mb-1">Direct Support</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Reach our support team directly via email.
            </p>
            <a href="mailto:support@awa.ai" className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline">
              support@awa.ai
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold mb-1">Community Discord</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Join 5,000+ AI creators sharing prompt breakthroughs daily.
            </p>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
              discord.gg/awa-ai
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
