"use client";

import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { toggleTheme } from "@/shared/store/slices/themeSlice";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeTogglerTwo = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
    >
      {theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
};

export default ThemeTogglerTwo;
