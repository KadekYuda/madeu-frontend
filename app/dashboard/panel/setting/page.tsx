"use client";

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Globe, User, Lock, Palette } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto';
type Language = 'id' | 'en';

interface Settings {
  theme: Theme;
  language: Language;
  notifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  fontSize: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    language: 'id',
    notifications: true,
    emailNotifications: false,
    soundEnabled: true,
    fontSize: 16,
  });

  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Apply theme - force override system preference
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first from both html and body
    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');
    
    if (settings.theme === 'auto') {
      // Check system preference only when auto is selected
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      } else {
        root.classList.add('light');
        body.classList.add('light');
      }
    } else if (settings.theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      // light mode
      root.classList.add('light');
      body.classList.add('light');
    }
    
    // Force the theme by adding data attribute to override system
    root.setAttribute('data-theme', settings.theme);
    
    // Add style to force override system preference
    if (settings.theme !== 'auto') {
      root.style.colorScheme = settings.theme;
    } else {
      root.style.colorScheme = '';
    }
  }, [settings.theme]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Pengaturan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola preferensi dan pengaturan akun Anda
          </p>
        </div>

        {/* Save Notification */}
        {showSaved && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg animate-fade-in">
            ✓ Pengaturan berhasil disimpan
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          
          {/* Theme Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tampilan
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tema
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'auto'] as Theme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting('theme', theme)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        settings.theme === theme
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {theme === 'light' && <Sun className="w-6 h-6" />}
                        {theme === 'dark' && <Moon className="w-6 h-6" />}
                        {theme === 'auto' && <Globe className="w-6 h-6" />}
                        <span className="text-sm font-medium capitalize dark:text-white">
                          {theme === 'light' ? 'Terang' : theme === 'dark' ? 'Gelap' : 'Otomatis'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ukuran Font: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Kecil</span>
                  <span>Sedang</span>
                  <span>Besar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notifikasi
              </h2>
            </div>
            
            <div className="space-y-4">
              <ToggleSetting
                label="Notifikasi Push"
                description="Terima notifikasi untuk aktivitas penting"
                checked={settings.notifications}
                onChange={(checked) => updateSetting('notifications', checked)}
              />
              <ToggleSetting
                label="Email Notifikasi"
                description="Kirim pemberitahuan melalui email"
                checked={settings.emailNotifications}
                onChange={(checked) => updateSetting('emailNotifications', checked)}
              />
              <ToggleSetting
                label="Suara"
                description="Mainkan suara untuk notifikasi"
                checked={settings.soundEnabled}
                onChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
          </div>

          {/* Language Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bahasa & Region
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bahasa
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value as Language)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Akun
              </h2>
            </div>
            
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
                Edit Profile
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Ubah Password
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400">
                Hapus Akun
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Versi 1.0.0 • © 2024 Your App
        </div>
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}