"use client";

import React, { useEffect, useMemo, useState, startTransition } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Modal } from "@/shared/ui/modal";
import Button from "@/shared/ui/button/Button";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  completeOnboarding,
  nextStep,
  prevStep,
  setStep,
  skipOnboarding,
} from "@/shared/store/slices/onboardingSlice";
import { useUpdateUserMutation } from "@/features/settings/api/profile.endpoints";
import { ONBOARDING_STEPS } from "./steps";
import { ArrowRight, X } from "lucide-react";

export function AppOnboarding() {
  const dispatch = useAppDispatch();
  const [updateUser] = useUpdateUserMutation();
  const router = useRouter();
  const pathname = usePathname();

  const { isOpen, currentStep, hasSeenOnboarding, frameworkSwitched, step2InputHiding, analyzeClicked } = useAppSelector(
    (state) => state.onboarding
  );

  const steps = useMemo(() => ONBOARDING_STEPS, []);
  const lastStepIndex = steps.length - 1;

  const safeStepIndex = Math.min(Math.max(0, currentStep), lastStepIndex);
  const step = steps[safeStepIndex];
  const isWelcomeStep = step.id === "welcome";

  const [titleVisible, setTitleVisible] = useState(false);
  const [welcomeButtonVisible, setWelcomeButtonVisible] = useState(false);
  const [welcomeButtonShimmer, setWelcomeButtonShimmer] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [continueShimmer, setContinueShimmer] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);

  // Welcome animation: fade in title, then fade in button after 1s
  useEffect(() => {
    if (!isOpen || !isWelcomeStep) {
      setTitleVisible(false);
      setWelcomeButtonVisible(false);
      return;
    }

    const titleDelayMs = 600;
    const fadeDurationMs = 500;
    const buttonDelayMs = titleDelayMs + fadeDurationMs + 600;

    setTitleVisible(false);
    setWelcomeButtonVisible(false);

    const t1 = window.setTimeout(() => setTitleVisible(true), titleDelayMs);
    const t2 = window.setTimeout(() => setWelcomeButtonVisible(true), buttonDelayMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isOpen, isWelcomeStep]);

  // Tutorial fade-in
  useEffect(() => {
    if (isWelcomeStep || !isOpen) {
      setTutorialVisible(false);
      return;
    }

    const id = window.setTimeout(() => setTutorialVisible(true), 100);
    return () => window.clearTimeout(id);
  }, [isWelcomeStep, isOpen]);

  // Start shimmer 2s after welcome button appears
  useEffect(() => {
    if (!welcomeButtonVisible) { setWelcomeButtonShimmer(false); return; }
    const t = window.setTimeout(() => setWelcomeButtonShimmer(true), 3000);
    return () => window.clearTimeout(t);
  }, [welcomeButtonVisible]);

  // Start shimmer 2s after tutorial becomes visible
  useEffect(() => {
    if (!tutorialVisible) { setContinueShimmer(false); return; }
    const t = window.setTimeout(() => setContinueShimmer(true), 3000);
    return () => window.clearTimeout(t);
  }, [tutorialVisible]);

  // Move to step 5 when Analyze is clicked on step 4
  useEffect(() => {
    if (!analyzeClicked || step.id !== 'step4') return;
    dispatch(nextStep());
  }, [analyzeClicked, step.id, dispatch]);

  // Keep Redux step index in-bounds if something external changed it.
  useEffect(() => {
    if (!isOpen) return;
    if (currentStep !== safeStepIndex) {
      dispatch(setStep(safeStepIndex));
    }
  }, [dispatch, currentStep, safeStepIndex, isOpen]);

  const handleSkip = () => {
    dispatch(skipOnboarding());
  };

  const handleBack = () => {
    setNavigatingBack(true);
    startTransition(() => dispatch(prevStep()));
  };

  const handleNext = () => {
    if (isWelcomeStep) {
      setTitleVisible(false);
      setWelcomeButtonVisible(false);
      window.setTimeout(() => startTransition(() => dispatch(nextStep())), 600);
      return;
    }

    setNavigatingBack(false);
    const isLast = safeStepIndex >= lastStepIndex;
    if (!isLast) {
      startTransition(() => dispatch(nextStep()));
      return;
    }

    updateUser({ has_completed_tutorial: true });
    dispatch(completeOnboarding());
    if (pathname !== "/chat") {
      router.push("/chat");
    }
  };

  if (!step) return null;

  return (
    <>
    {/* Pre-paint the tutorial shell while welcome is visible so the browser has already
        rasterised the dot-pattern background onto a GPU layer before the user clicks. */}
    {isOpen && isWelcomeStep && createPortal(
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: -1,
          opacity: 0.001, pointerEvents: 'none',
          willChange: 'opacity',
        }}
      >
        <div className="relative flex flex-col md:flex-row md:rounded-3xl overflow-hidden bg-[var(--app-bg-secondary-color)] bg-[radial-gradient(circle,_rgba(255,255,255,0.045)_1px,_transparent_1px)] bg-[length:36px_36px] md:min-h-[640px]">
          <div className="w-full md:w-1/2 bg-[var(--app-bg-secondary-color)]" />
          <div className="w-full md:w-1/2 bg-[var(--app-bg-primary-color)]" />
        </div>
      </div>,
      document.body
    )}
    {isOpen && !isWelcomeStep && hasSeenOnboarding && createPortal(
      <button
        type="button"
        onClick={handleSkip}
        className="fixed top-4 right-4 text-white/50 hover:text-white/80 transition-colors"
        style={{ zIndex: 100000 }}
        aria-label="Close tutorial"
      >
        <X className="h-5 w-5" />
      </button>,
      document.body
    )}
    {isOpen && !isWelcomeStep && safeStepIndex > 1 && createPortal(
      <button
        type="button"
        onClick={handleBack}
        className="md:hidden fixed top-4 left-6 text-white/50 hover:text-white/80 transition-colors px-2 py-1 text-sm"
        style={{ zIndex: 100000 }}
      >
        Back
      </button>,
      document.body
    )}
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      disableBackdropClose
      className={isWelcomeStep ? "!bg-transparent !rounded-none !shadow-none min-w-0" : "max-w-5xl !p-0"}
      showCloseButton={false}
    >
      {isWelcomeStep ? (
        <div className="flex flex-col items-center justify-center gap-16 min-h-[280px]">
          <h1
            className={`font-bold text-white text-5xl sm:text-7xl font-[family-name:var(--font-dancing-script)] transition-opacity duration-1000 ease-in-out text-center ${
              titleVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome to The Room!
          </h1>
          <div className={`transition-opacity duration-1000 ease-in-out ${welcomeButtonVisible ? "opacity-100" : "opacity-0"}`}>
            <Button
              onClick={handleNext}
              variant="accent"
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="after"
              className={`px-6 py-3 text-base !rounded-[10px] !transition-all duration-200 !bg-[var(--app-accent-secondary-color)] !text-[var(--app-bg-primary-color)] ${welcomeButtonShimmer ? "btn-onboarding" : ""}`}
            >
              Let's Start
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ willChange: 'opacity', contain: 'layout style' }} className={`relative flex flex-col md:flex-row md:rounded-3xl overflow-hidden bg-[var(--app-bg-secondary-color)] bg-[radial-gradient(circle,_rgba(255,255,255,0.045)_1px,_transparent_1px)] bg-[length:36px_36px] md:min-h-[640px] transition-opacity duration-500 ease-out ${tutorialVisible ? "opacity-100" : "opacity-0"}`}>


          {/* Back button — desktop only (absolute) */}
          {safeStepIndex > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="hidden md:block absolute top-4 left-4 z-10 px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Back
            </button>
          )}

          {/* Left — text content */}
          <div className={`w-full md:w-1/2 flex flex-col justify-start md:justify-center gap-6 px-8 md:px-12 pt-[120px] pb-12 md:py-12`}>
            <div className="flex flex-col gap-3">
              <div className="text-md text-[var(--app-accent-secondary-color)]">
                Step {safeStepIndex} of {steps.length - 1}
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {step.title}
              </h2>
            </div>

            <p className="text-white/70 leading-relaxed whitespace-pre-line">
              {step.description}
            </p>

            {/* Continue button for most steps */}
            {step.id !== 'step4' && (step.id !== 'step3' || frameworkSwitched) && (
              <div className={`transition-opacity duration-500 ease-out w-fit ${step.id === 'step3' ? (frameworkSwitched ? "opacity-100" : "opacity-0") : "opacity-100"}`}>
                <Button
                  onClick={handleNext}
                  variant="accent"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="after"
                  className={`px-6 py-3 text-base w-fit !rounded-[10px] !transition-all duration-200 !bg-[var(--app-accent-secondary-color)] !text-[var(--app-bg-primary-color)] ${continueShimmer ? "btn-onboarding" : ""}`}
                >
                  {step.id === 'step6' ? 'Finish' : 'Continue'}
                </Button>
              </div>
            )}
          </div>

          {/* Right — illustration */}
          <div key={step.id} className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-white/10 bg-[var(--app-bg-primary-color)] overflow-hidden min-h-[300px] md:min-h-0">
            {step.illustration ? (
              step.id === 'step2'
                ? React.cloneElement(step.illustration as React.ReactElement<{ skipInputAutoFade?: boolean }>, { skipInputAutoFade: navigatingBack })
                : step.illustration
            ) : (
              <div className="flex items-center justify-center h-full text-white/20 text-sm">Image</div>
            )}
          </div>

        </div>
      )}
    </Modal>
    </>
  );
}
