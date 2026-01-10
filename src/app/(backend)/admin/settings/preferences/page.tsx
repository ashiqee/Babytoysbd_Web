'use client';

import React, { useState } from 'react';
import { Settings, Save, Palette, Bell } from 'lucide-react';

const PreferencesPage: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [currencyFormat, setCurrencyFormat] = useState('USD');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');

  const savePreferences = () => {
    console.log({ language, theme, notifications, currencyFormat, dateFormat });
    alert('Preferences saved!');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Settings /> Preferences
      </h1>

      <div className="space-y-6  p-6 rounded shadow">
        <div>
          <label htmlFor="language" className="block text-sm font-medium mb-1">Language</label>
          <select className="w-full border px-3 py-2 rounded" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="bn">Bengali</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium mb-1">Theme</label>
          <select className="w-full border px-3 py-2 rounded" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <div>
          <label htmlFor="notifications" className="block text-sm font-medium mb-1">Notifications</label>
          <label htmlFor="emailNoti" className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            Enable email and in-app notifications
          </label>
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium mb-1">Currency Format</label>
          <select className="w-full border px-3 py-2 rounded" value={currencyFormat} onChange={(e) => setCurrencyFormat(e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="BDT">BDT (৳)</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateFormat" className="block text-sm font-medium mb-1">Date Format</label>
          <select className="w-full border px-3 py-2 rounded" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          </select>
        </div>

        <div className="pt-6">
          <button
            onClick={savePreferences}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Save size={16} /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;