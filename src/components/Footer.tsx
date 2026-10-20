import React from 'react';
import { NavigationTab } from '../types';

interface FooterProps {
  onTabChange: (tab: NavigationTab) => void;
  latencyMs?: number;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, latencyMs = 28 }) => {
  return (
    <footer className="w-full bg-[#0e0e14] py-8 border-t border-[#2a2931]/70 shadow-[0_-1px_8px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#c7c4d8] text-[13px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[#e4e1eb] font-semibold tracking-wide">DocMind Engine</span>
          <span className="text-[#464555]">•</span>
          <span>© 2025 Synthetic Reasoning &amp; Retrieval Corp.</span>
          <span className="text-[#464555]">•</span>
          <span className="text-[#41eec2] font-mono text-[11px]">Spring Boot Architecture Ready</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
            Status: <strong className="text-[#e4e1eb] font-normal">Nominal</strong>
          </span>
          <span>
            Latency: <strong className="text-[#e4e1eb] font-normal">{latencyMs}ms</strong>
          </span>
          <span>
            Tokens: <strong className="text-[#e4e1eb] font-normal">128k Context</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};
