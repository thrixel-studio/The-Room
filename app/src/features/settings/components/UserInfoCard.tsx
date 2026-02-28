"use client";
import React from "react";
import Input from "@/shared/ui/input/Input";
import Label from "@/shared/ui/label/Label";

interface UserInfoCardProps {
  isEditing: boolean;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
}

const UserInfoCard = React.memo(function UserInfoCard({
  isEditing,
  firstName,
  setFirstName,
  lastName,
  setLastName
}: UserInfoCardProps) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white/90">
          Personal Information
        </h3>
        <p className="mt-0.5 text-xs font-normal text-gray-400">
          Update your details to keep your profile up-to-date.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2">
        <div className="col-span-2 lg:col-span-1">
          <Label className="text-[var(--app-text-tertiary-color)]">First Name</Label>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            disabled={!isEditing}
            className="!bg-[var(--app-bg-primary-color)]"
          />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <Label className="text-[var(--app-text-tertiary-color)]">Last Name</Label>
          <Input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            disabled={!isEditing}
            className="!bg-[var(--app-bg-primary-color)]"
          />
        </div>
      </div>
    </div>
  );
});

UserInfoCard.displayName = 'UserInfoCard';

export default UserInfoCard;
