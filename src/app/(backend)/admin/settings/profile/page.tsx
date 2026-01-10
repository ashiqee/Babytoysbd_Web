'use client';

import React, { useState } from 'react';
import { User, Save, UploadCloud, Mail, Lock } from 'lucide-react';

const ProfileSettingsPage: React.FC = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('Ashiq Coder');
  const [email, setEmail] = useState('ashiq@example.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setAvatar(e.target.result.toString());
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.includes('@')) errs.email = 'Valid email is required';
    if (password && password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password && password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveProfile = () => {
    if (!validate()) return;

    const updatedProfile = {
      name,
      email,
      ...(password && { password }),
    };

    console.log('Saving profile:', updatedProfile);
    alert('Profile updated successfully!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User /> Profile Settings
      </h1>

      <div className="space-y-6 bg-white p-6 rounded shadow">
        {/* Avatar Upload */}
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium mb-1">Avatar</label>
          <div className="flex items-center gap-4">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full border" />
            ) : (
              <div className="w-16 h-16 rounded-full border bg-gray-200 flex items-center justify-center text-gray-500">N/A</div>
            )}
            <label htmlFor="uploadAvatar" className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded cursor-pointer">
              <UploadCloud size={18} /> Upload
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="setName" className="block text-sm font-medium mb-1">Name</label>
          <input className="w-full border px-3 py-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className=" text-sm font-medium mb-1 flex items-center gap-1">
            <Mail size={16} /> Email
          </label>
          <input type="email" className="w-full border px-3 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="paasword" className=" text-sm font-medium mb-1 flex items-center gap-1">
            <Lock size={16} /> New Password
          </label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={saveProfile}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Save size={16} /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
