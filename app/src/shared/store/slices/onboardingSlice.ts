import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const HAS_SEEN_ONBOARDING_STORAGE_KEY = 'hasSeenOnboarding';

const getInitialHasSeenOnboarding = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(HAS_SEEN_ONBOARDING_STORAGE_KEY) === 'true';
};

export interface OnboardingState {
  isOpen: boolean;
  currentStep: number;
  completed: boolean;
  hasSeenOnboarding: boolean;
  frameworkSwitched: boolean;
  step2InputHiding: boolean;
  analyzeClicked: boolean;
}

const initialState: OnboardingState = {
  isOpen: false,
  currentStep: 0,
  completed: false,
  hasSeenOnboarding: getInitialHasSeenOnboarding(),
  frameworkSwitched: false,
  step2InputHiding: false,
  analyzeClicked: false,
};

const persistHasSeen = (value: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HAS_SEEN_ONBOARDING_STORAGE_KEY, value ? 'true' : 'false');
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    openWelcome: (state) => {
      state.isOpen = true;
      state.currentStep = 0;
    },
    openTutorial: (state) => {
      state.isOpen = true;
      state.currentStep = 0;
    },
    closeTutorial: (state) => {
      state.isOpen = false;
    },
    nextStep: (state) => {
      state.currentStep += 1;
      state.step2InputHiding = false;
      state.analyzeClicked = false;
    },
    prevStep: (state) => {
      state.currentStep = Math.max(0, state.currentStep - 1);
      state.frameworkSwitched = false;
      state.step2InputHiding = false;
      state.analyzeClicked = false;
    },
    startStep2InputHide: (state) => {
      state.step2InputHiding = true;
    },
    setFrameworkSwitched: (state) => {
      state.frameworkSwitched = true;
    },
    setAnalyzeClicked: (state) => {
      state.analyzeClicked = true;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = Math.max(0, action.payload);
    },
    completeOnboarding: (state) => {
      state.completed = true;
      state.hasSeenOnboarding = true;
      state.isOpen = false;
      persistHasSeen(true);
    },
    skipOnboarding: (state) => {
      state.hasSeenOnboarding = true;
      state.isOpen = false;
      persistHasSeen(true);
    },
    resetOnboarding: (state) => {
      state.isOpen = false;
      state.currentStep = 0;
      state.completed = false;
      state.hasSeenOnboarding = false;
      persistHasSeen(false);
    },
  },
});

export const {
  openWelcome,
  openTutorial,
  closeTutorial,
  nextStep,
  prevStep,
  setStep,
  setFrameworkSwitched,
  setAnalyzeClicked,
  startStep2InputHide,
  completeOnboarding,
  skipOnboarding,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
