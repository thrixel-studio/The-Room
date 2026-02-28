"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, MessageCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/3 left-10 hidden lg:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-violet-600/20 backdrop-blur-sm flex items-center justify-center border border-violet-600/30">
          <Brain className="w-8 h-8 text-violet-400" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-16 hidden lg:block"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/30">
          <MessageCircle className="w-7 h-7 text-amber-400" />
        </div>
      </motion.div>

      <Container>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="light" color="primary" size="md" icon={<Sparkles className="w-4 h-4" />}>
              AI-Powered Mental Wellness
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-[var(--app-text-primary-color)]">Your Personal</span>
            <br />
            <span className="text-gradient">Mental Wellness</span>
            <br />
            <span className="text-[var(--app-text-primary-color)]">Companion</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="mt-6 text-lg sm:text-xl text-[var(--app-text-secondary-color)] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            24/7 emotional support through AI-powered journaling, personalized
            insights, and guided conversations that learn, grow, and adapt to
            your unique journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Start Your Journey
            </Button>
            <Button
              variant="ghost"
              size="lg"
              icon={<Play className="w-5 h-5" />}
            >
              See How It Works
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-[var(--app-text-tertiary-color)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 border-2 border-[var(--app-bg-primary-color)]"
                  />
                ))}
              </div>
              <span className="text-sm">Join 10,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm">4.9/5 Rating</span>
            </div>
          </motion.div>

          {/* Hero Visual - Chat Preview */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-[var(--app-border-primary-color)] bg-[var(--app-bg-secondary-color)] shadow-2xl max-w-3xl mx-auto">
              {/* Mock Chat Interface */}
              <div className="p-6 sm:p-8">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--app-border-primary-color)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--app-text-primary-color)]">
                      The Room
                    </h3>
                    <p className="text-xs text-green-400">Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="py-6 space-y-4">
                  <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="bg-[var(--app-accent-color)] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">
                        Hey The Room, I&apos;ve been feeling a bit overwhelmed lately
                        with work.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div className="bg-[var(--app-bg-tertiary-color)] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-[var(--app-text-primary-color)] text-sm">
                        I hear you. It&apos;s completely normal to feel that way.
                        Let&apos;s explore what&apos;s been on your mind. What aspects
                        of work feel most overwhelming right now?
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    <div className="bg-gradient-to-r from-violet-600/20 to-amber-500/20 rounded-2xl px-4 py-3 border border-violet-600/30">
                      <p className="text-xs text-[var(--app-text-tertiary-color)] mb-1">
                        New Insight
                      </p>
                      <p className="text-[var(--app-text-primary-color)] text-sm">
                        I&apos;ve noticed you often mention work stress on weekday
                        evenings. Would you like to explore some patterns?
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--app-border-primary-color)]">
                  <input
                    type="text"
                    placeholder="Share what's on your mind..."
                    className="flex-1 bg-[var(--app-bg-tertiary-color)] rounded-xl px-4 py-3 text-sm text-[var(--app-text-primary-color)] placeholder:text-[var(--app-text-tertiary-color)] border border-[var(--app-border-primary-color)] focus:outline-none focus:border-[var(--app-accent-color)]"
                    disabled
                  />
                  <button className="w-10 h-10 rounded-xl bg-[var(--app-accent-color)] flex items-center justify-center hover:brightness-90 transition-all">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative glow behind the card */}
            <div className="absolute -inset-4 bg-violet-600/10 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
