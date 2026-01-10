'use client'
import Link from 'next/link'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      {/* Lottie Animation */}
      <div className="w-full max-w-xl mb-6">
        <DotLottieReact
      src="/lottie/404.lottie"
      loop
      autoplay
    />
      </div>

      <h1 className="text-4xl font-bold text-indigo-600 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
          The page you&#39;re looking for doesn&#39;t exist, has been moved, or you mistyped the URL.
        </p>

      <Link
        href="/"
        className="bg-indigo-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
      >
        ← Back to Home
      </Link>
    </div>
  )
}
