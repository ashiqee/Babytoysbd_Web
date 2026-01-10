'use client';

import React, { useEffect, useState } from 'react';
import { Save, Store, UploadCloud, Globe2 } from 'lucide-react';

const StoreSettingsPage: React.FC = () => {
  const [storeName, setStoreName] = useState('My Awesome Store');
  const [storeEmail, setStoreEmail] = useState('store@example.com');
  const [storePhone, setStorePhone] = useState('+1 123 456 7890');
  const [storeAddress, setStoreAddress] = useState('123 Main Street, New York, NY');
  const [logo, setLogo] = useState<string | null>(null);
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [googleAnalytics, setGoogleAnalytics] = useState('');
  const [facebookPixel, setFacebookPixel] = useState('');
  const [serverTracking, setServerTracking] = useState(false);
  const [customDomain, setCustomDomain] = useState('');

  // ✅ SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setLogo(e.target.result.toString());
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!storeName.trim()) errs.storeName = 'Store name is required';
    if (!storeEmail.includes('@')) errs.storeEmail = 'Valid email is required';
    if (!storePhone.trim()) errs.storePhone = 'Phone number is required';
    if (customDomain && !/^https?:\/\//.test(customDomain)) errs.customDomain = 'Domain must start with http:// or https://';
    if (!metaTitle.trim()) errs.metaTitle = 'Meta title is required';
    if (!metaDescription.trim()) errs.metaDescription = 'Meta description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

useEffect(() => {
  const fetchSettings = async () => {
    const res = await fetch('/api/store-settings');
    const data = await res.json();
    if (data) {
      setStoreName(data.storeName || '');
      setStoreEmail(data.storeEmail || '');
      setStorePhone(data.storePhone || '');
      setStoreAddress(data.storeAddress || '');
      setLogo(data.logo || '');
      setCurrency(data.currency || 'USD');
      setTimezone(data.timezone || 'UTC');
      setCustomDomain(data.customDomain || '');

      // SEO
      setMetaTitle(data.metaTitle || '');
      setMetaDescription(data.metaDescription || '');
      setMetaKeywords(data.metaKeywords || '');
      setCanonicalUrl(data.canonicalUrl || '');

      // Socials
      setFacebook(data.facebook || '');
      setInstagram(data.instagram || '');
      setWhatsapp(data.whatsapp || '');
      setGoogleAnalytics(data.googleAnalytics || '');
      setFacebookPixel(data.facebookPixel || '');
      setServerTracking(data.serverTracking || false);
    }
  };

  fetchSettings();
}, []);





const saveSettings = async () => {
  if (!validate()) return;

  const payload = {
    storeName,
    storeEmail,
    storePhone,
    storeAddress,
    logo,
    currency,
    timezone,
    customDomain,
    metaTitle,
    metaDescription,
    metaKeywords,
    canonicalUrl,
    facebook,
    instagram,
    whatsapp,
    googleAnalytics,
    facebookPixel,
    serverTracking,
  };

  try {
    const res = await fetch('/api/store-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Settings saved successfully!');
    } else {
      alert('Failed to save settings');
    }
  } catch (err) {
    console.error(err);
    alert('Error saving settings');
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Store /> Store Settings
      </h1>

      <div className="space-y-6 bg-white p-6 rounded shadow">
        {/* Basic Info */}
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium mb-1">Store Name</label>
          <input className="w-full border px-3 py-2 rounded" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
        </div>

        <div>
          <label htmlFor="Email" className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border px-3 py-2 rounded" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
          {errors.storeEmail && <p className="text-red-500 text-sm mt-1">{errors.storeEmail}</p>}
        </div>

        <div>
          <label htmlFor="Phone" className="block text-sm font-medium mb-1">Phone</label>
          <input className="w-full border px-3 py-2 rounded" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
          {errors.storePhone && <p className="text-red-500 text-sm mt-1">{errors.storePhone}</p>}
        </div>

        <div>
          <label htmlFor="Address" className="block text-sm font-medium mb-1">Address</label>
          <textarea className="w-full border px-3 py-2 rounded" rows={2} value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
        </div>

        {/* Logo */}
        <div>
          <label htmlFor="logo" className="block text-sm font-medium mb-1">Store Logo</label>
          <div className="flex items-center gap-4">
            {logo && <img src={logo} alt="Logo" className="h-16 w-16 rounded border" />}
            <label htmlFor="uploadLogo" className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded cursor-pointer">
              <UploadCloud size={18} /> Upload Logo
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>

        {/* Currency & Timezone */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium mb-1">Currency</label>
          <select className="w-full border px-3 py-2 rounded" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="BDT">BDT</option>
          </select>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium mb-1">Timezone</label>
          <select className="w-full border px-3 py-2 rounded" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option value="UTC">UTC</option>
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>

        {/* Custom Domain */}
        <div>
          <label htmlFor="customeDomain" className="block text-sm font-medium mb-1">Custom Domain</label>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="https://yourstore.com"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
          />
          {errors.customDomain && <p className="text-red-500 text-sm mt-1">{errors.customDomain}</p>}
        </div>

        {/* ✅ SEO Section */}
        <div className="pt-4 border-t">
          <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Globe2 className="w-4 h-4" /> SEO Settings
          </h2>

          <div className="grid gap-4">
            <input
              className="border px-3 py-2 rounded"
              placeholder="Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
            {errors.metaTitle && <p className="text-red-500 text-sm mt-1">{errors.metaTitle}</p>}

            <textarea
              className="border px-3 py-2 rounded"
              rows={3}
              placeholder="Meta Description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
            {errors.metaDescription && <p className="text-red-500 text-sm mt-1">{errors.metaDescription}</p>}

            <input
              className="border px-3 py-2 rounded"
              placeholder="SEO Keywords (comma separated)"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
            />

            <input
              className="border px-3 py-2 rounded"
              placeholder="Canonical URL"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Social & Analytics */}
        <div className="pt-4 border-t">
          <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Globe2 className="w-4 h-4" /> Social & Tracking
          </h2>

          <div className="grid gap-4">
            <input
              className="border px-3 py-2 rounded"
              placeholder="Facebook Page URL"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
            <input
              className="border px-3 py-2 rounded"
              placeholder="Instagram URL"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <input
              className="border px-3 py-2 rounded"
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <input
              className="border px-3 py-2 rounded"
              placeholder="Google Analytics Tracking ID"
              value={googleAnalytics}
              onChange={(e) => setGoogleAnalytics(e.target.value)}
            />
            <input
              className="border px-3 py-2 rounded"
              placeholder="Facebook Pixel ID"
              value={facebookPixel}
              onChange={(e) => setFacebookPixel(e.target.value)}
            />
            <label htmlFor="serverTracking" className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={serverTracking}
                onChange={() => setServerTracking(!serverTracking)}
              />
              Enable server-side tracking
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
