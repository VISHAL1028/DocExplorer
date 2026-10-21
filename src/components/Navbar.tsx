import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Layers,
  Upload,
  PanelLeft,
  FileText,
  X,
  Sliders,
  Sparkles,
  User,
  ChevronDown,
  CheckCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { AppTab, DocumentItem, BackendConfig } from '../types';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  documents: DocumentItem[];
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  onUploadClick: () => void;
  backendConfig: BackendConfig;
  userEmail: string | null;
  guestUuid: string;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  documents,
  selectedDocumentId,
  setSelectedDocumentId,
  onUploadClick,
  backendConfig,
  userEmail,
  guestUuid,
  onOpenAuth
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDocSelectOpen, setIsDocSelectOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const docSelectRef = useRef<HTMLDivElement>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocumentId);

  const tabs: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'chunks', label: 'Chunks', icon: Layers },
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (docSelectRef.current && !docSelectRef.current.contains(event.target as Node)) {
        setIsDocSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 w-full z-40 bg-[#0e0e14]/90 backdrop-blur-xl border-b border-[#2a2931] flex items-center justify-between px-2 sm:px-4 md:px-6 shrink-0 select-none">
      {/* Left: Sidebar toggle + Brand + Active Document selector */}
      <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 sm:p-2 rounded-xl text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26] transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Brand Name DocExplorer */}
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2 text-left group transition-transform active:scale-95 shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#8781ff] to-[#41eec2] flex items-center justify-center shadow-[0_0_12px_rgba(135,129,255,0.4)]">
            <span className="material-symbols-outlined text-[#100069] text-[18px] sm:text-[20px] font-bold">explore</span>
          </div>
          <span className="text-[16px] sm:text-[18px] md:text-[20px] text-[#e4e1eb] font-bold tracking-tight">
            DocExplorer
          </span>
        </button>

        {/* Active Document Filter Selector */}
        <div className="relative hidden sm:block" ref={docSelectRef}>
          <button
            onClick={() => setIsDocSelectOpen(!isDocSelectOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-mono transition-all ${
              selectedDoc
                ? 'bg-[#1b1b22] border-[#41eec2]/50 text-[#41eec2]'
                : 'bg-[#16161f] border-[#2a2931] text-[#c7c4d8] hover:text-[#e4e1eb] hover:border-[#34343c]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[140px] md:max-w-[200px]">
              {selectedDoc ? selectedDoc.title : 'All Ingested Documents'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#918fa1] shrink-0" />
          </button>

          {isDocSelectOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-[#16161f] border border-[#2a2931] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-mono text-[#918fa1] px-2 py-1 uppercase tracking-wider">
                Filter Target Document
              </div>
              <button
                onClick={() => {
                  setSelectedDocumentId(null);
                  setIsDocSelectOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-mono transition-colors text-left ${
                  selectedDocumentId === null
                    ? 'bg-[#2a2931] text-[#41eec2] font-semibold'
                    : 'text-[#e4e1eb] hover:bg-[#1f1f26]'
                }`}
              >
                <span>All Documents ({documents.length})</span>
                {selectedDocumentId === null && <CheckCircle className="w-3.5 h-3.5 text-[#41eec2]" />}
              </button>

              <div className="h-px bg-[#2a2931] my-1" />

              <div className="max-h-52 overflow-y-auto space-y-1">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocumentId(doc.id);
                      setIsDocSelectOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-mono transition-colors text-left truncate ${
                      selectedDocumentId === doc.id
                        ? 'bg-[#2a2931] text-[#41eec2] font-semibold'
                        : 'text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26]'
                    }`}
                  >
                    <span className="truncate">{doc.title}</span>
                    {selectedDocumentId === doc.id && (
                      <CheckCircle className="w-3.5 h-3.5 text-[#41eec2] shrink-0 ml-1.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Primary Navigation Tabs (Chat, Search, Chunks, Overview, Settings) */}
      <nav className="flex items-center gap-1 bg-[#16161f] border border-[#2a2931] p-1 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#8781ff] text-[#100069] font-semibold shadow-md'
                  : 'text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Upload Button + Backend Pulse + Profile Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#41eec2] hover:bg-[#55fcd0] text-[#00382b] font-semibold text-[13px] transition-all shadow-[0_0_12px_rgba(65,238,194,0.3)] shrink-0 active:scale-95"
          title="Upload Document"
        >
          <Upload className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Backend Connectivity Status Dot */}
        <button
          onClick={() => setActiveTab('settings')}
          className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1b22] border border-[#2a2931] text-[11px] font-mono hover:bg-[#2a2931] transition-colors"
          title={`Spring Boot: ${backendConfig.apiUrl}`}
        >
          {backendConfig.isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-[#41eec2]" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="text-[#c7c4d8] truncate max-w-[120px]">
            {backendConfig.isConnected ? 'Spring Boot' : 'Sim Mode'}
          </span>
        </button>

        {/* User Account / Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 rounded-xl bg-[#2a2931] border border-[#34343c] text-[#c4c0ff] hover:text-[#e4e1eb] hover:bg-[#34343c] flex items-center justify-center transition-all"
            title="User Profile & Session"
          >
            <User className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#16161f] border border-[#2a2931] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="pb-3 border-b border-[#2a2931]">
                <div className="text-[13px] font-semibold text-[#e4e1eb] truncate">
                  {userEmail || 'Guest Explorer'}
                </div>
                <div className="text-[11px] font-mono text-[#41eec2] mt-0.5">
                  UUID: {guestUuid}
                </div>
              </div>

              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26] transition-colors flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-[#8781ff]" />
                  <span>API Settings</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26] transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-[#41eec2]" />
                  <span>Claim Guest Sandbox</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#2a2931]">
                {userEmail ? (
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-mono text-[#ffb2b8] hover:bg-[#ff506f]/15 transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-mono text-[#8781ff] hover:bg-[#8781ff]/15 transition-colors"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
