"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenStorage } from '@/shared/lib/storage';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');

    if (access_token && refresh_token) {
      // Store tokens
      tokenStorage.setTokens(access_token, refresh_token);

      // Redirect to chat page and force a reload to ensure AuthContext picks up the tokens
      window.location.href = '/chat';
    } else {
      setError('Authentication failed. Please try again.');
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800 text-white">{error}</h2>
          <p className="text-gray-600 text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block w-12 h-12 mb-4 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-800 text-white">Completing sign in...</h2>
        <p className="mt-2 text-gray-600 text-gray-400">Please wait while we log you in.</p>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function CallbackLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block w-12 h-12 mb-4 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-800 text-white">Loading...</h2>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
