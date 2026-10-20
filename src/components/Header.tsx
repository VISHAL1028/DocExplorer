import React from 'react';
import { NavigationTab, BackendConfig } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  guestUuid: string;
  backendConfig: BackendConfig;
  onOpenAuth: (mode: 'login' | 'register') => void;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  guestUuid,
  backendConfig,
  onOpenAuth,
  userEmail
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0e0e14]/85 backdrop-blur-xl border-b border-[#2a2931]/60 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <div className="h-20 w-full px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => onTabChange('landing')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <img
              alt="DocMind Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe9tFqU0fEvwbXu_hsfNPrVRuh_kXDVSGA5aCgOWEtKKPcIIn_qzZdtViXhkN4Q5sJETCEcJ7pOVp_ZFN-sqZ7pZOrQpWz85EQVW-MMfAq_29VLBfUGKk2nagDtArQbJovuw2UXSqIQRRe628q7fCw7-VBKqF5kQaltlaaT-z6QiLFbGbtkc-Oi36YEpWH_yc2_2hXinaQLjAXXqmNSEoP7BCkAuh2m2vrwxFDjaQxO0ARFZIK_w"
              onError={(e) => {
                // Fallback styled SVG if CDN image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-[20px] text-[#e4e1eb] font-bold tracking-tight">DocMind</span>
            <span className="px-2 py-0.5 rounded-full bg-[#2a2931] text-[#c4c0ff] text-[11px] font-medium tracking-wide font-mono">
              RAG Engine v2.0
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onTabChange('landing')}
              className={`px-3 py-2 text-[14px] transition-colors rounded-lg font-medium whitespace-nowrap ${
                currentTab === 'landing'
                  ? 'bg-[#2a2931] text-[#c4c0ff]'
                  : 'text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26]'
              }`}
            >
              Landing
            </button>
            <button
              onClick={() => onTabChange('chat-studio')}
              className={`px-3 py-2 text-[14px] transition-colors rounded-lg font-medium whitespace-nowrap ${
                currentTab === 'chat-studio'
                  ? 'bg-[#2a2931] text-[#c4c0ff]'
                  : 'text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26]'
              }`}
            >
              Chat Studio
            </button>
            <button
              onClick={() => onTabChange('documents')}
              className={`px-3 py-2 text-[14px] transition-colors rounded-lg font-medium whitespace-nowrap ${
                currentTab === 'documents'
                  ? 'bg-[#2a2931] text-[#c4c0ff]'
                  : 'text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26]'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => onTabChange('settings')}
              className={`px-3 py-2 text-[14px] transition-colors rounded-lg font-medium whitespace-nowrap ${
                currentTab === 'settings'
                  ? 'bg-[#2a2931] text-[#c4c0ff]'
                  : 'text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26]'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Right: Guest session, API status, and auth actions */}
        <div className="flex items-center gap-3">
          {/* Guest Session Pill */}
          <div
            onClick={() => onOpenAuth('register')}
            title="Click to claim sandbox into permanent account"
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1f1f26] border border-[#2a2931] text-[#c7c4d8] text-[11px] font-mono cursor-pointer hover:border-[#8781ff]/40 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#c4c0ff]">account_circle</span>
            {userEmail ? (
              <span className="text-[#41eec2]">Signed in: {userEmail}</span>
            ) : (
              <span>Guest Session (UUID: {guestUuid}) • Auto-migrates on Login</span>
            )}
          </div>

          {/* Backend API status */}
          <button
            onClick={() => onTabChange('settings')}
            title="Configure Spring Boot Backend"
            className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1b22] border border-[#2a2931] text-[#41eec2] text-[12px] font-mono hover:bg-[#2a2931] transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendConfig.isConnected ? 'bg-[#41eec2] animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
            <span className="truncate max-w-[210px]">
              {backendConfig.isConnected ? 'API connected: ' : 'API fallback: '}
              {backendConfig.apiUrl.replace('http://', '')}
            </span>
          </button>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {userEmail ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-lg text-[14px] text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#2a2931] transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 rounded-lg text-[14px] text-[#e4e1eb] hover:bg-[#2a2931] transition-colors whitespace-nowrap"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 rounded-lg text-[14px] bg-[#8781ff] text-[#100069] font-medium hover:bg-[#c4c0ff] transition-all shadow-[0_0_16px_rgba(135,129,255,0.35)] whitespace-nowrap"
                >
                  Get Started / Register
                </button>
              </>
            )}

            <button
              onClick={() => onOpenAuth('login')}
              className="w-8 h-8 rounded-full bg-[#c4c0ff] text-[#2000a4] flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
              title="Profile & Session"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
