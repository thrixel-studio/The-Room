"use client";

import React from "react";
import { Phone, ExternalLink, Heart } from "lucide-react";
import { Modal } from "@/shared/ui/modal";

const emergency = [
  { region: "America", number: "911", tel: "tel:911" },
  { region: "Europe", number: "112", tel: "tel:112" },
  { region: "Russia", number: "112", tel: "tel:112" },
];

const resources = [
  {
    name: "Complicated Life",
    desc: "Mental health support platform",
    href: "https://complicated.life",
  },
  {
    name: "International Therapist Directory",
    desc: "Find professional therapists worldwide",
    href: "https://internationaltherapistdirectory.com",
  },
];

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(185, 28, 28, 0.15)", border: "1.5px solid rgba(185, 28, 28, 0.4)" }}
          >
            <Heart className="w-4 h-4" style={{ color: "#ef4444" }} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white leading-tight">
              Your safety matters
            </h3>
            <p className="text-sm text-white/50 mt-0.5 leading-relaxed">
              Please step away from any immediate danger and take one slow breath. Real help is here.
            </p>
          </div>
        </div>

        {/* Resource links */}
        <div className="grid grid-cols-2 gap-2">
          {resources.map((r) => (
            <a
              key={r.name}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 px-3 py-2.5 rounded-xl transition-colors"
              style={{
                border: "1px solid var(--app-border-primary-color)",
                backgroundColor: "var(--app-bg-tertiary-color)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--app-border-primary-color)")
              }
            >
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-white leading-snug">{r.name}</p>
                <ExternalLink className="w-3 h-3 shrink-0 text-white/40" />
              </div>
              <p className="text-[10px] text-white/40">{r.desc}</p>
            </a>
          ))}
        </div>

        {/* Emergency numbers */}
        <div className="flex items-center justify-center gap-6 py-2">
          {emergency.map((e) => (
            <a
              key={e.region}
              href={e.tel}
              className="flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white/80"
            >
              <Phone className="w-3 h-3 shrink-0 text-white/30" />
              <span>{e.region}</span>
              <span className="font-semibold text-white">{e.number}</span>
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}
