import React from "react";
import { Phone, ExternalLink } from "lucide-react";

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

export function EmergencyInline() {
  return (
    <div
      className="rounded-2xl py-4 space-y-3"
    >
      {/* Resource links */}
      <div className="flex flex-wrap gap-2">
        {resources.map((r) => (
          <a
            key={r.name}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl transition-colors"
            style={{
              backgroundColor: "var(--app-bg-secondary-color)",
              border: "1px solid var(--app-border-primary-color)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")
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
      <div className="flex items-center justify-start gap-6">
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
  );
}
