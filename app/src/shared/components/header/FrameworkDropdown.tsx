"use client";

import React, { useState } from "react";
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import { DropdownItem } from "@/shared/ui/dropdown/DropdownItem";
import { useFrameworks, FrameworkKey } from "@/features/frameworks";
import { useToast } from '@/shared/hooks/useToast';
import { ChevronDown, Check, Heart, Target, Zap, Lightbulb } from "lucide-react";

function FrameworkDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedFramework, setSelectedFramework, frameworks, getFrameworkByKey } = useFrameworks();
  const { showError } = useToast();

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const currentFramework = getFrameworkByKey(selectedFramework);

  const getFrameworkIcon = (frameworkKey: FrameworkKey) => {
    switch (frameworkKey) {
      case "mental_wellness":
        return Heart;
      case "decision_making":
        return Target;
      case "productivity_boost":
        return Zap;
      case "problem_solving":
        return Lightbulb;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 text-gray-400 dropdown-toggle gap-1.5 px-3 py-2 rounded-lg bg-gray-100 bg-gray-800/80 hover:bg-gray-200 hover:bg-gray-600 transition-colors"
      >
        <ChevronDown
          className={`w-4 h-4 text-gray-500 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        <span className="text-sm font-medium text-gray-800 text-white/90 whitespace-nowrap">
          {currentFramework?.title || "Select Framework"}
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="right-0 mt-4 w-56"
      >
        <div className="p-2">
          {frameworks.map((framework) => {
            const isSelected = selectedFramework === framework.key;
            const IconComponent = getFrameworkIcon(framework.key);
            return (
              <DropdownItem
                key={framework.key}
                onItemClick={async () => {
                  await setSelectedFramework(framework.key, showError);
                  closeDropdown();
                }}
                className={`flex items-center gap-2 px-3 py-2 font-medium rounded-lg text-sm transition-colors ${
                  isSelected
                    ? "bg-brand-50 text-brand-500 bg-brand-500/10 text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-gray-400 hover:bg-white/5 hover:text-gray-300"
                }`}
              >
                {IconComponent && (
                  <IconComponent className={`w-4 h-4 ${isSelected ? "text-brand-500 text-brand-400" : ""}`} />
                )}
                <span className="flex-1">{framework.title}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-brand-500 text-brand-400" />
                )}
              </DropdownItem>
            );
          })}
        </div>
      </Dropdown>
    </div>
  );
}

export default React.memo(FrameworkDropdown);
