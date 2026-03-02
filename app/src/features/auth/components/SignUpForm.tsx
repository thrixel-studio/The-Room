"use client";
import Checkbox from "@/shared/ui/input/Checkbox";
import Input from "@/shared/ui/input/Input";
import Label from "@/shared/ui/label/Label";
import Button from "@/shared/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/shared/icons";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import GridShape from "@/shared/components/GridShape";
import GoogleAuthButton from "./ui/GoogleAuthButton";

const PASSWORD_RULES = [
  { label: 'At least 12 characters', test: (p: string) => p.length >= 12 },
  { label: 'No more than 72 characters', test: (p: string) => p.length <= 72 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One digit', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]/.test(p) },
];

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const passwordValid = PASSWORD_RULES.every(rule => rule.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isChecked) {
      setError('Please accept the Terms and Conditions');
      return;
    }

    if (!passwordValid) {
      setPasswordTouched(true);
      setError('Please fix the password requirements below');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(email, password, firstName, lastName);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-y-auto">
      <GridShape />
      {/* Logo - Top Left */}
      <div className="fixed top-6 left-6 z-50">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src="/images/logo/logo.svg"
            alt="The Room Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md px-6 mb-10">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-title-sm sm:text-title-md text-[var(--app-text-primary-color)]">
              Sign Up
            </h1>
            <p className="text-sm text-[var(--app-text-secondary-color)]">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg bg-red-900/20 text-red-400">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name <span className="text-[var(--app-danger-color)]">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name <span className="text-[var(--app-danger-color)]">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email <span className="text-[var(--app-danger-color)]">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password <span className="text-[var(--app-danger-color)]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-[var(--app-text-tertiary-color)]"
                    >
                      {showPassword ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeCloseIcon className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                  {passwordTouched && (
                    <ul className="mt-2 space-y-1">
                      {PASSWORD_RULES.map((rule) => {
                        const ok = rule.test(password);
                        return (
                          <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-500' : 'text-[var(--app-text-tertiary-color)]'}`}>
                            <span>{ok ? '✓' : '○'}</span>
                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <span className="block font-normal text-theme-sm text-[var(--app-text-secondary-color)]">
                    By creating an account you agree to the{" "}
                    <a className="text-[var(--app-accent-secondary-color)]">Terms and Conditions,</a> and our{" "}
                    <a className="text-[var(--app-accent-secondary-color)]">Privacy Policy</a>
                  </span>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="accent"
                    icon={<UserPlus className="w-4 h-4" />}
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </div>
              </div>
            </form>

            <GoogleAuthButton mode="signup" />

            <div className="mt-5">
              <p className="text-sm font-normal text-center sm:text-start text-[var(--app-text-secondary-color)]">
                Already have an account? {""}
                <Link
                  href="/signin"
                  className="inline-block transition-all hover:brightness-90 text-[var(--app-accent-secondary-color)]"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Footer --> */}
      <p className="absolute z-10 text-sm text-center -translate-x-1/2 bottom-6 left-1/2 text-[var(--app-text-tertiary-color)]">
        &copy; {new Date().getFullYear()} - The Room
      </p>
    </div>
  );
}
