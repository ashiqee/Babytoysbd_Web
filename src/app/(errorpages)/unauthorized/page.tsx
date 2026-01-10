"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 text-lg mb-6">
          You don’t have permission to access this page. Please contact the administrator if you believe this is a mistake.
        </p>
        <button
          onClick={handleGoBack}
          className="inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
