"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from 'next/image';
import { useSession } from "next-auth/react";
import {
  Mic,
  AudioLines,
  FileText,
  BookOpen,
  Brain,
  Share2,
  CheckCircle2,
  Sparkles,
  Lock,
  ChartBarBig,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

// Utility function to get user initials
function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Animated, Sonix-style wireframe landing page
 * - Tailwind for layout & gray wireframe treatment
 * - Framer Motion for tasteful scroll/hover animations
 * - Lucide icons as stand-ins for bespoke art (replace later)
 * - Focused on: lecture capture → transcript → quiz/study links → auto-grade
 *
 * Drop this into a Next.js/React app with Tailwind & Framer Motion installed.
 * Adjust copy/structure freely; this is intentionally low‑fi but polished.
 */

export default function SonixStyleLandingWireframe() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-[#28929f] selection:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/lecture-logo.png"
              alt="Resona Logo"
              width={64}
              height={64}
              className="rounded-lg"
            />
            <span className="font-semibold tracking-tight text-lg">Resona</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#why" className="hover:text-[#28929f] transition-colors">Why</a>
            <a href="#features" className="hover:text-[#28929f] transition-colors">Features</a>
            <a href="#workflow" className="hover:text-[#28929f] transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-[#28929f] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#28929f] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Link href="/dashboard" className="px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white hover:border-[#28929f] transition-colors">Dashboard</Link>
                <Link href="/dashboard" className="w-8 h-8 rounded-full bg-[#28929f] hover:bg-[#237a85] flex items-center justify-center text-white text-sm font-medium transition-colors">
                  {getInitials(session.user?.name)}
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white hover:border-[#28929f] transition-colors">Sign in</Link>
                <Link href="/upload" className="px-3 py-2 text-sm rounded-lg bg-[#28929f] hover:bg-[#237a85] text-white transition-colors">Try free</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          {/* Subtle gradient mesh with teal tints */}
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#28929f]/20 to-white blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gradient-to-tl from-green-50 to-[#28929f]/10 blur-3xl opacity-70" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.4 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 px-3 py-1 rounded-full">
              <Sparkles className="size-3" /> AI‑powered lecture → quiz platform
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Record lectures. Get transcripts, quizzes, and auto‑grading—
              <span className="whitespace-nowrap">in minutes.</span>
            </h1>
            <p className="text-neutral-600 max-w-prose">
              Capture a lecture, generate notes & study guides, share a secure quiz link, and see
              instant scores with item‑level analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/upload" className="px-5 py-3 rounded-xl bg-[#28929f] hover:bg-[#237a85] text-white font-medium text-center transition-colors">Start free trial</Link>
              <button className="px-5 py-3 rounded-xl border border-neutral-300 bg-white hover:border-[#28929f] hover:text-[#28929f] transition-colors">Watch demo</button>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2"><Lock className="size-4"/> FERPA‑friendly</div>
              <div className="flex items-center gap-2"><ShieldCheck className="size-4"/> SSO / LMS</div>
              <div className="flex items-center gap-2"><ChartBarBig className="size-4"/> Analytics</div>
            </div>
          </motion.div>

          {/* Hero Mock */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-40 bg-neutral-200 rounded"/>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-neutral-200 rounded"/>
                  <div className="h-6 w-16 bg-neutral-200 rounded"/>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-3">
                  <div className="aspect-video bg-neutral-100 border border-dashed border-neutral-300 rounded-xl flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: [8, -8, 8] }}
                      transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                      className="flex items-center gap-2 text-neutral-500"
                    >
                      <Mic className="size-5"/>
                      <span className="text-sm">Lecture Recorder</span>
                    </motion.div>
                  </div>
                  <div className="h-10 bg-neutral-100 border border-dashed border-neutral-300 rounded flex items-center px-3 text-neutral-500 text-sm">Transcript appears here…</div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: AudioLines, label: "Generate Quiz" },
                    { icon: BookOpen, label: "Create Study Guide" },
                    { icon: Share2, label: "Share Link" },
                    { icon: CheckCircle2, label: "Auto‑Grade" },
                  ].map((it, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 240, damping: 12 }}
                      className="h-10 w-full bg-neutral-100 border border-dashed border-neutral-300 rounded flex items-center gap-2 px-3 text-neutral-700"
                    >
                      <it.icon className="size-4" /> {it.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-4 w-48 h-28 bg-white border-2 border-dashed border-neutral-300 rounded-xl shadow-sm flex items-center justify-center text-neutral-500 text-xs">
              Quiz Link Preview
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workflow with vertical layout */}
      <section id="workflow" className="bg-white border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              From lecture to insights in
              <span className="text-[#28929f]"> minutes</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our AI-powered platform transforms your lectures into engaging quizzes and provides deep insights into student understanding—all automatically.
            </p>
          </div>

          {/* Vertical workflow steps */}
          <div className="space-y-20">
            {/* Record */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="md:w-1/3">
                <Image
                  src="/images/mic.png"
                  alt="Record lecture"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                />
              </div>
              <div className="md:w-2/3 space-y-3">
                <h3 className="text-2xl font-bold text-[#28929f]">Record or Upload</h3>
                <p className="text-lg text-neutral-600">
                  Capture live lectures or upload existing audio/video files. Our platform supports all major formats with crystal-clear transcription powered by advanced AI.
                </p>
              </div>
            </motion.div>

            {/* Quiz */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-8"
            >
              <div className="md:w-1/3">
                <Image
                  src="/images/quiz.png"
                  alt="Generate quiz"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                />
              </div>
              <div className="md:w-2/3 space-y-3">
                <h3 className="text-2xl font-bold text-[#28929f]">AI Quiz Generation</h3>
                <p className="text-lg text-neutral-600">
                  Advanced AI analyzes your lecture content and generates relevant, engaging questions. Choose from multiple choice, true/false, and short answer formats with customizable difficulty levels.
                </p>
              </div>
            </motion.div>

            {/* Grade */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="md:w-1/3">
                <Image
                  src="/images/grade.png"
                  alt="Auto-grade submissions"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                />
              </div>
              <div className="md:w-2/3 space-y-3">
                <h3 className="text-2xl font-bold text-[#28929f]">Instant Auto-Grading</h3>
                <p className="text-lg text-neutral-600">
                  Students submit their answers and receive immediate feedback. All responses are automatically scored with detailed explanations, saving you hours of manual grading work.
                </p>
              </div>
              </motion.div>

            {/* Data */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-8"
            >
              <div className="md:w-1/3">
                <Image
                  src="/images/data.png"
                  alt="Analyze data"
                  width={300}
                  height={200}
                  className="rounded-lg w-full"
                />
              </div>
              <div className="md:w-2/3 space-y-3">
                <h3 className="text-2xl font-bold text-[#28929f]">Data & Analytics</h3>
                <p className="text-lg text-neutral-600">
                  Comprehensive educator dashboard shows student performance metrics, identifies knowledge gaps, and tracks learning progress over time with actionable insights.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/upload" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#28929f] hover:bg-[#237a85] text-white font-medium text-lg transition-colors">
              Try It Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Logos / Social proof */}
      <section className="py-8 border-y border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs md:text-sm text-neutral-500 mb-4">Trusted by educators and departments at</div>
          <div className="overflow-hidden">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -600, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="flex gap-10 opacity-70"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-8 w-32 bg-neutral-100 border border-dashed border-neutral-300 rounded" />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why / Value props */}
      <section id="why" className="bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold tracking-tight mb-10"
          >
            Fast, accurate, and built for classrooms
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Mic, t: "High‑quality capture", d: "Clean audio with noise‑aware recording or upload your file." },
              { icon: FileText, t: "Lightning transcripts", d: "Accurate transcripts with timestamps and speakers." },
              { icon: AudioLines, t: "One‑click quizzes", d: "Choose MCQ/T‑F/short answer; set difficulty; publish." },
              { icon: BookOpen, t: "Study guides", d: "Outlines, key terms, flashcards, and export to PDF/LMS." },
              { icon: Brain, t: "Auto‑grading", d: "Instant scoring with item analysis, regrade & retake flows." },
              { icon: Share2, t: "Secure links", d: "Roster restrictions, due dates, and access controls." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.2 }}
                className="p-5 rounded-2xl border-2 border-dashed border-neutral-300 bg-white"
              >
                <motion.div whileHover={{ rotate: [0, -6, 6, 0] }} className="mb-3 inline-flex p-2 rounded-xl bg-neutral-100 border border-neutral-200">
                  {React.createElement([Mic, FileText, AudioLines, BookOpen, Brain, Share2][i], { className: "size-6" })}
                </motion.div>
                <div className="font-semibold mb-1">{f.t}</div>
                <p className="text-sm text-neutral-600">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial band */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="md:col-span-2">
            <blockquote className="text-2xl md:text-3xl font-semibold leading-tight">
              “Our lecture came through almost word‑perfect. The auto‑quiz saved me hours. Absolute magic.”
            </blockquote>
            <div className="mt-4 text-sm text-neutral-300">— Dr. A. Nguyen, Department Chair</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="flex md:justify-end">
            <div className="h-28 w-28 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">🎩</div>
          </motion.div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-lg font-semibold">Start with 20 free quiz generations</div>
            <div className="text-sm text-neutral-600">No credit card required • Cancel anytime</div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input className="px-3 py-3 rounded-xl border border-neutral-300 w-full md:w-80" placeholder="Enter your school email" />
            <button className="px-5 py-3 rounded-xl bg-neutral-900 text-white font-medium whitespace-nowrap">Get invite</button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">Simple pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Free","Pro","Department"].map((tier, i) => (
              <motion.div key={tier} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                className={`p-6 rounded-2xl border-2 border-dashed border-neutral-300 bg-white ${i===1?"shadow-sm":""}`}
              >
                <div className="font-semibold mb-2">{tier}</div>
                <div className="h-6 w-24 bg-neutral-100 border border-dashed border-neutral-300 rounded mb-4"/>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-neutral-200 border"/> Placeholder benefit</li>
                  <li className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-neutral-200 border"/> Placeholder benefit</li>
                  <li className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-neutral-200 border"/> Placeholder benefit</li>
                </ul>
                <button className="mt-6 w-full py-3 rounded-xl bg-neutral-900 text-white">Choose {tier}</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">FAQ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {q:"How do students access quizzes?", a:"You generate a secure link. Students open it on any device—no account required (or restrict to roster emails)."},
              {q:"Can I edit AI questions?", a:"Yes—approve, regenerate, or write your own before publishing."},
              {q:"How are quizzes graded?", a:"MCQ and T/F auto‑grade instantly. Short answers support rubrics and assisted review."},
              {q:"Does it work with my LMS?", a:"Export CSV or sync scores via integrations (Canvas, Google Classroom, etc.)."},
            ].map((f, i)=> (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="p-5 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50">
                <div className="font-semibold mb-2">{f.q}</div>
                <p className="text-sm text-neutral-700">{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 grid md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="font-semibold text-neutral-800 flex items-center gap-2"><GraduationCap className="size-4"/> Resona</div>
            <p>Wireframe UI inspired by best‑in‑class transcription/quiz tools.</p>
          </div>
          <div></div>
            <div className="font-semibold text-neutral-800 mb-2">Product</div>
            <ul className="space-y-1">
              <li><a className="hover:underline" href="#why">Why</a></li>
              <li><a className="hover:underline" href="#features">Features</a></li>
              <li><a className="hover:underline" href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-neutral-800 mb-2">Resources</div>
            <ul className="space-y-1">
              <li><span className="text-neutral-400">Docs (placeholder)</span></li>
              <li><span className="text-neutral-400">Security (placeholder)</span></li>
              <li><span className="text-neutral-400">Status (placeholder)</span></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-neutral-800 mb-2">Contact</div>
            <ul className="space-y-1">
              <li><span className="text-neutral-400">hello@resona.app</span></li>
              <li><span className="text-neutral-400">Support portal</span></li>
            </ul>
          </div>
      </footer>
    </div>
  );
}
