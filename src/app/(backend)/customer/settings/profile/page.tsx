"use client";

import { Image } from "@heroui/react";
import { useState, useEffect } from "react";

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  address: string;
  shippingAddress: string;
  profilePic?: string | null;
}

export default function ProfileSettings() {
  // Mock initial user data - replace with real user data fetch
  const [profile, setProfile] = useState<ProfileData>({
    name: "John Doe",
    email: "john@example.com",
    mobile: "+1234567890",
    address: "123 Main Street, City, Country",
    shippingAddress: "123 Main Street, City, Country",
    profilePic: null,
  });

  const [shippingSameAsAddress, setShippingSameAsAddress] = useState(true);

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate image preview URL when file changes
  useEffect(() => {
    if (!profilePicFile) {
      setProfilePicPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePicFile);
    setProfilePicPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePicFile]);

  // Validation helpers
  function validateProfile() {
    if (!profile.name.trim() || !profile.email.trim() || !profile.mobile.trim() || !profile.address.trim()) {
      setMessage({ type: "error", text: "Name, email, mobile, and address are required." });
      return false;
    }
    if (!shippingSameAsAddress && !profile.shippingAddress.trim()) {
      setMessage({ type: "error", text: "Shipping address is required if different from address." });
      return false;
    }
    // Basic email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return false;
    }
    // Basic mobile number check (simple)
    const mobileRegex = /^\+?\d{7,15}$/;
    if (!mobileRegex.test(profile.mobile)) {
      setMessage({ type: "error", text: "Please enter a valid mobile number (digits only, may start with +)." });
      return false;
    }
    return true;
  }

  function validatePasswords() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill all password fields." });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return false;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return false;
    }
    return true;
  }

  // Mock save profile info
  async function handleProfileSave() {
    setMessage(null);
    if (!validateProfile()) return;

    setLoading(true);
    // Simulate upload profilePic and API call delay
    setTimeout(() => {
      // Sync shipping address if checkbox checked
      if (shippingSameAsAddress) {
        setProfile((prev) => ({
          ...prev,
          shippingAddress: prev.address,
          profilePic: profilePicPreview || prev.profilePic,
        }));
      } else {
        setProfile((prev) => ({
          ...prev,
          profilePic: profilePicPreview || prev.profilePic,
        }));
      }

      setProfilePicFile(null); // clear file input
      setLoading(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    }, 1500);
  }

  // Mock change password
  async function handleChangePassword() {
    setMessage(null);
    if (!validatePasswords()) return;

    setLoading(true);
    // Simulate password check & update delay
    setTimeout(() => {
      setLoading(false);
      if (currentPassword !== "oldpassword123") {
        // mock current password check fail
        setMessage({ type: "error", text: "Current password is incorrect." });
      } else {
        setMessage({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    }, 1500);
  }

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleProfileSave();
          }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <Image
                className="h-24 w-24 object-cover rounded-full border border-gray-300"
                src={profilePicPreview || profile.profilePic || "/default-profile.png"}
                alt="Profile Picture"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setProfilePicFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "
              />
            </label>
          </div>

          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              value={profile.mobile}
              onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
              placeholder="+1234567890"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block font-medium mb-1">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="shippingSame"
              checked={shippingSameAsAddress}
              onChange={() => setShippingSameAsAddress((prev) => !prev)}
              className="mr-2"
            />
            <label htmlFor="shippingSame" className="font-medium cursor-pointer">
              Shipping address is same as Address
            </label>
          </div>

          {!shippingSameAsAddress && (
            <div>
              <label htmlFor="shippingAddress" className="block font-medium mb-1">
                Shipping Address
              </label>
              <textarea
                id="shippingAddress"
                rows={3}
                value={profile.shippingAddress}
                onChange={(e) => setProfile({ ...profile, shippingAddress: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="currentPassword" className="block font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </section>
    </main>
  );
}
