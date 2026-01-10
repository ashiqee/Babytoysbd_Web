"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [authMethod, setAuthMethod] = useState<"email" | "mobile">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_no: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Signup failed");
      setLoading(false);
      return;
    }

    // auto login
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      identifier: form.email || form.mobile_no,
      password: form.password,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const identifier = authMethod === "email" ? form.email : form.mobile_no;

    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      identifier,
      password: form.password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleProviderSignIn = async (provider: "google" | "facebook") => {
    setLoading(true);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-100 dark:from-gray-900 dark:to-black px-4">
      <div className="bg-white/10 dark:bg-white/5 p-6 rounded-md shadow-md max-w-md w-full space-y-5 backdrop-blur border border-white/10">
        {/* Tabs */}
        <div className="flex justify-center mb-4">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 font-medium ${
                tab === t
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              } transition`}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded">{error}</p>
        )}

        <form onSubmit={tab === "signup" ? handleSignup : handleLogin} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          )}

          {/* Identifier Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {authMethod === "email" ? "Email" : "Mobile Number"}
              </label>
              <button
                type="button"
                onClick={() =>
                  setAuthMethod(authMethod === "email" ? "mobile" : "email")
                }
                className="text-xs text-blue-600 underline"
              >
                Use {authMethod === "email" ? "Mobile" : "Email"}
              </button>
            </div>
            <input
              type={authMethod === "email" ? "email" : "tel"}
              name={authMethod === "email" ? "email" : "mobile_no"}
              value={
                authMethod === "email" ? form.email : form.mobile_no
              }
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : tab === "signup" ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or continue with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleProviderSignIn("google")}
            className="flex items-center justify-center w-1/2 bg-white dark:bg-gray-100 text-gray-800 py-2 px-3 rounded shadow border"
          >
            <FcGoogle className="mr-2" size={20} />
            Google
          </button>

          <button
            type="button"
            onClick={() => handleProviderSignIn("facebook")}
            className="flex items-center justify-center w-1/2 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700"
          >
            <FaFacebook className="mr-2" size={20} />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
