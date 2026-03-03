import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "@/shared/ui/button/Button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      {/* Logo - Top Left */}
      <div className="fixed top-6 left-6 z-50">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src="/images/logo/s3.png"
            alt="The Room Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-4 font-semibold text-title-md sm:text-title-lg xl:text-title-2xl text-[var(--app-text-primary-color)]">
          ERROR
        </h1>

        <Image
          src="/images/error/404.svg"
          alt="404"
          className="hidden"
          width={472}
          height={152}
        />
        <Image
          src="/images/error/404-dark.svg"
          alt="404"
          className="hidden block"
          width={472}
          height={152}
        />

        <p className="mt-6 mb-6 text-sm sm:text-base text-[var(--app-text-secondary-color)]">
          We can't seem to find the page you are looking for!
        </p>

        <Link href="/insights">
          <Button variant="accent" className="w-full sm:w-auto py-2" icon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
      </div>
      {/* Footer */}
      <p className="absolute z-10 text-sm text-center -translate-x-1/2 bottom-6 left-1/2 text-[var(--app-text-tertiary-color)]">
        &copy; {new Date().getFullYear()} - The Room
      </p>
    </div>
  );
}
