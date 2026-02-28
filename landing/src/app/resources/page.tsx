"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const posts = [
  {
    slug: "introducing-solace",
    title: "Introducing The Room: Your AI Mental Wellness Companion",
    excerpt:
      "Today we're excited to launch The Room - a new approach to mental wellness that combines AI technology with evidence-based therapeutic practices.",
    date: "January 15, 2026",
    readTime: "5 min read",
    category: "Announcement",
    featured: true,
  },
  {
    slug: "science-behind-journaling",
    title: "The Science Behind Journaling for Mental Health",
    excerpt:
      "Research shows that expressive writing can significantly improve mental wellbeing. Learn how The Room leverages these findings.",
    date: "January 10, 2026",
    readTime: "8 min read",
    category: "Science",
    featured: false,
  },
  {
    slug: "ai-emotional-intelligence",
    title: "How We Built AI with Emotional Intelligence",
    excerpt:
      "A deep dive into the technical and ethical considerations behind creating an AI that can provide meaningful emotional support.",
    date: "January 5, 2026",
    readTime: "12 min read",
    category: "Technology",
    featured: false,
  },
  {
    slug: "privacy-first-approach",
    title: "Our Privacy-First Approach to Mental Health Data",
    excerpt:
      "Your mental health journey is deeply personal. Here's how we protect your data while still providing personalized insights.",
    date: "December 28, 2025",
    readTime: "6 min read",
    category: "Privacy",
    featured: false,
  },
  {
    slug: "building-healthy-habits",
    title: "5 Ways to Build Healthy Mental Wellness Habits",
    excerpt:
      "Small, consistent actions can lead to significant improvements in mental health. Discover strategies that work.",
    date: "December 20, 2025",
    readTime: "7 min read",
    category: "Wellness",
    featured: false,
  },
  {
    slug: "understanding-emotional-patterns",
    title: "Understanding Your Emotional Patterns",
    excerpt:
      "Learn how recognizing patterns in your emotions can help you better manage stress and improve overall wellbeing.",
    date: "December 15, 2025",
    readTime: "9 min read",
    category: "Insights",
    featured: false,
  },
];

const categories = [
  "All",
  "Announcement",
  "Science",
  "Technology",
  "Privacy",
  "Wellness",
  "Insights",
];

export default function ResourcesPage() {
  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial opacity-20" />

        <Container>
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--app-text-primary-color)] mb-4">
              Resources
            </h1>
            <p className="text-lg text-[var(--app-text-secondary-color)]">
              Updates, insights, and information from the The Room team.
              Explore the science of mental wellness and stay up to date with
              our latest features.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Categories */}
      <Section padding="sm">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                index === 0
                  ? "bg-violet-600 text-white"
                  : "bg-[var(--app-bg-secondary-color)] text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)] border border-[var(--app-border-primary-color)]"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Featured Post */}
      {featuredPost && (
        <Section padding="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={`/posts/${featuredPost.slug}`}>
              <Card
                variant="gradient"
                hover
                padding="lg"
                className="relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <Badge variant="solid" color="primary" className="mb-4">
                    Featured
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[var(--app-text-primary-color)] mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-[var(--app-text-secondary-color)] mb-6 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--app-text-tertiary-color)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        </Section>
      )}

      {/* Posts Grid */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/posts/${post.slug}`}>
                <Card variant="bordered" hover className="h-full">
                  <Badge
                    variant="light"
                    color={
                      post.category === "Science"
                        ? "info"
                        : post.category === "Technology"
                        ? "primary"
                        : "secondary"
                    }
                    className="mb-4"
                  >
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-[var(--app-text-primary-color)] mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[var(--app-text-secondary-color)] text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[var(--app-text-tertiary-color)] mt-auto pt-4 border-t border-[var(--app-border-primary-color)]">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Newsletter CTA */}
      <Section background="secondary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--app-text-primary-color)] mb-4">
            Stay Updated
          </h2>
          <p className="text-[var(--app-text-secondary-color)] mb-6">
            Get the latest mental wellness insights and The Room updates
            delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--app-bg-primary-color)] border border-[var(--app-border-primary-color)] text-[var(--app-text-primary-color)] placeholder:text-[var(--app-text-tertiary-color)] focus:outline-none focus:border-violet-600"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:brightness-90 transition-all flex items-center justify-center gap-2"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}
