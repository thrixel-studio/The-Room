"use client";
import React from "react";
import TextArea from "@/shared/ui/input/TextArea";

interface UserBioCardProps {
  isEditing: boolean;
  bioText: string;
  setBioText: (value: string) => void;
}

const UserBioCard = React.memo(function UserBioCard({ isEditing, bioText, setBioText }: UserBioCardProps) {
  const placeholderText = "Write something here...";

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white/90">
          More About You
        </h3>
        <p className="mt-0.5 text-xs font-normal text-gray-400">
            Interests, values, or preferences to keep in mind.
        </p>
      </div>

      <div>
        <TextArea
          placeholder={placeholderText}
          value={bioText}
          onChange={setBioText}
          disabled={!isEditing}
          autoResize
          maxHeight={250}
          className="!bg-[var(--app-bg-primary-color)] !border-[var(--app-border-primary-color)] focus:!border-[var(--app-accent-color)] focus:!shadow-[0_0_0_3px_var(--app-accent-color-transparent)]"
        />
      </div>
    </div>
  );
});

UserBioCard.displayName = 'UserBioCard';

export default UserBioCard;
