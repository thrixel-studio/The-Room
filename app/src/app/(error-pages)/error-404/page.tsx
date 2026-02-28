import GridShape from "@/shared/components/GridShape";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Error 404 | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Error 404 page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Error404() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md text-white/90 xl:text-title-2xl">
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

        <p className="mt-10 mb-6 text-base text-gray-700 text-gray-400 sm:text-lg">
          We can’t seem to find the page you are looking for!
        </p>

        <Link
          href="/insights"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 border-gray-700 bg-gray-800 text-gray-400 hover:bg-white/[0.03] hover:text-gray-200"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
