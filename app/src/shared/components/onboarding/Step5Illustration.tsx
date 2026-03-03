"use client";

import React, { useEffect, useState } from "react";

export function Step5Illustration() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 150);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={`w-full h-full transition-opacity duration-500 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src="/images/tutorial/insight.webp"
        alt="Insight visualization"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
