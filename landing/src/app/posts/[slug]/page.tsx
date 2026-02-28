"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// This would typically come from a CMS or database
const postContent = {
  title: "Introducing The Room: Your AI Mental Wellness Companion",
  date: "January 15, 2026",
  readTime: "5 min read",
  category: "Announcement",
  author: {
    name: "Marcus Williams",
    role: "Co-Founder & CEO",
    avatar: "MW",
  },
  content: `
    <p>Today, we're thrilled to introduce The Room to the world. After two years of research, development, and collaboration with mental health professionals, we've built something we believe can make a real difference in people's lives.</p>

    <h2>Why We Built The Room</h2>
    <p>Mental health support shouldn't be a luxury. Yet for millions of people, access to therapy is limited by cost, availability, or stigma. We asked ourselves: what if everyone could have access to a supportive, understanding companion that's available whenever they need it?</p>
    <p>That question led us to create The Room - not as a replacement for professional care, but as a complement to it. A tool that can help people reflect on their thoughts, understand their patterns, and build healthier mental habits.</p>

    <h2>What Makes The Room Different</h2>
    <p>The Room isn't just another chatbot. Our AI was specifically designed for mental wellness conversations, trained with guidance from licensed therapists and psychologists. Here's what sets it apart:</p>
    <ul>
      <li><strong>Emotionally Intelligent Conversations:</strong> The Room understands context and emotional nuance, responding with empathy and appropriate support.</li>
      <li><strong>Pattern Recognition:</strong> Over time, The Room learns your unique patterns, helping you identify triggers and growth areas.</li>
      <li><strong>Evidence-Based Frameworks:</strong> Access to proven therapeutic techniques like CBT, mindfulness, and journaling prompts.</li>
      <li><strong>Complete Privacy:</strong> Your data is encrypted end-to-end. We never share or sell your personal information.</li>
    </ul>

    <h2>Our Commitment</h2>
    <p>We're committed to building technology that genuinely helps people. This means:</p>
    <ul>
      <li>Continuous improvement based on research and user feedback</li>
      <li>Transparency about what AI can and cannot do</li>
      <li>Clear guidance to seek professional help when needed</li>
      <li>Making mental wellness support accessible to everyone</li>
    </ul>

    <h2>Join Us</h2>
    <p>We believe everyone deserves support on their mental wellness journey. Whether you're managing daily stress, working through difficult emotions, or simply wanting to understand yourself better, The Room is here for you.</p>
    <p>Start your journey today. We can't wait to meet you.</p>
  `,
};

export default function PostPage() {
  return (
    <>
      {/* Article Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-radial opacity-20" />

        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Link */}
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-[var(--app-text-secondary-color)] hover:text-violet-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Link>

            {/* Category */}
            <Badge variant="light" color="primary" className="mb-4">
              {postContent.category}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--app-text-primary-color)] mb-6">
              {postContent.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-[var(--app-text-secondary-color)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  {postContent.author.avatar}
                </div>
                <div>
                  <p className="text-[var(--app-text-primary-color)] font-medium text-sm">
                    {postContent.author.name}
                  </p>
                  <p className="text-[var(--app-text-tertiary-color)] text-xs">
                    {postContent.author.role}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" />
                {postContent.date}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                {postContent.readTime}
              </span>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Article Content */}
      <section className="pb-20">
        <Container size="md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <motion.article
              className="lg:col-span-9"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="prose prose-lg prose-invert max-w-none
                  prose-headings:text-[var(--app-text-primary-color)] prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-p:text-[var(--app-text-secondary-color)] prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:text-[var(--app-text-secondary-color)] prose-ul:my-4
                  prose-li:my-2
                  prose-strong:text-[var(--app-text-primary-color)]
                  prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: postContent.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-[var(--app-border-primary-color)]">
                <div className="flex flex-wrap gap-2">
                  {["Mental Health", "AI", "Wellness", "Launch"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-[var(--app-bg-secondary-color)] text-[var(--app-text-secondary-color)] border border-[var(--app-border-primary-color)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 flex items-center gap-4">
                <span className="text-[var(--app-text-secondary-color)] text-sm">
                  Share this article:
                </span>
                <button className="w-10 h-10 rounded-full bg-[var(--app-bg-secondary-color)] border border-[var(--app-border-primary-color)] flex items-center justify-center text-[var(--app-text-secondary-color)] hover:text-violet-400 hover:border-violet-600 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[var(--app-bg-secondary-color)] border border-[var(--app-border-primary-color)] flex items-center justify-center text-[var(--app-text-secondary-color)] hover:text-violet-400 hover:border-violet-600 transition-all">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28 space-y-6">
                {/* Author Card */}
                <div className="p-6 rounded-2xl bg-[var(--app-bg-secondary-color)] border border-[var(--app-border-primary-color)]">
                  <h3 className="text-sm font-medium text-[var(--app-text-tertiary-color)] mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center text-white font-bold">
                      {postContent.author.avatar}
                    </div>
                    <div>
                      <p className="text-[var(--app-text-primary-color)] font-medium">
                        {postContent.author.name}
                      </p>
                      <p className="text-[var(--app-text-tertiary-color)] text-sm">
                        {postContent.author.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/10 to-amber-500/10 border border-violet-600/20">
                  <h3 className="font-semibold text-[var(--app-text-primary-color)] mb-2">
                    Try The Room Today
                  </h3>
                  <p className="text-[var(--app-text-secondary-color)] text-sm mb-4">
                    Start your mental wellness journey with a free trial.
                  </p>
                  <Button variant="primary" size="sm" fullWidth>
                    Get Started
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
