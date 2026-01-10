'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // trigger Google login (add logic with next-auth)
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // trigger Facebook login (add logic with next-auth)
    console.log('Facebook login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50/5">
      <div className=" shadow-lg rounded-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Welcome to BabyToysBD 👶
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Login to continue exploring magical toys!
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-1/4 border-pink-300" />
          <span className="text-sm text-gray-500">or login with</span>
          <hr className="w-1/4 border-pink-300" />
        </div>

        <div className="mt-4 space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-xl mr-2" />
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-blue-50 transition text-blue-600"
          >
            <FaFacebook className="text-xl mr-2" />
            Continue with Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-pink-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
