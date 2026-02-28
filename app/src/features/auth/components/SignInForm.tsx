"use client";
import Checkbox from "@/shared/ui/input/Checkbox";
import Input from "@/shared/ui/input/Input";
import Label from "@/shared/ui/label/Label";
import Button from "@/shared/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/shared/icons";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import GridShape from "@/shared/components/GridShape";
import GoogleAuthButton from "./ui/GoogleAuthButton";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(true); // Default to checked
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password, isChecked);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
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
      <div className="relative z-10 w-full max-w-md px-6 mb-5">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-title-sm sm:text-title-md text-[var(--app-text-primary-color)]">
              Sign In
            </h1>
            <p className="text-sm text-[var(--app-text-secondary-color)]">
              Enter your email and password to sign in!
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
                <div>
                  <Label>
                    Email <span className="text-[var(--app-danger-color)]">*</span>
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-[var(--app-danger-color)]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-theme-sm text-[var(--app-text-secondary-color)]">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm inline-block transition-all hover:brightness-90 text-[var(--app-accent-secondary-color)]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="accent"
                    icon={<LogIn className="w-4 h-4" />}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </form>

            <GoogleAuthButton mode="signin" />

            <div className="mt-5">
              <p className="text-sm font-normal text-center sm:text-start text-[var(--app-text-secondary-color)]">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="inline-block transition-all hover:brightness-90 text-[var(--app-accent-secondary-color)]"
                >
                  Sign Up
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
