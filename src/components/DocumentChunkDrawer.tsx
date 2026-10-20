import React from 'react';
import { Chunk, DocumentItem } from '../types';

interface DocumentChunkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentItem | null;
  selectedChunk?: Chunk | null;
  onSelectChunk?: (chunk: Chunk) => void;
}

export const DocumentChunkDrawer: React.FC<DocumentChunkDrawerProps> = ({
  isOpen,
  onClose,
  document,
  selectedChunk,
  onSelectChunk
}) => {
  if (!isOpen || !document) return null;

  const activeChunk = selectedChunk || document.chunks[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-[#13131a] border-l border-[#2a2931] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#2a2931] flex items-center justify-between bg-[#1b1b22]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#ff506f]/15 text-[#ffb2b8] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {document.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
              </span>
            </div>
            <div className="truncate">
              <h3 className="font-semibold text-[#e4e1eb] text-[16px] truncate">{document.title}</h3>
              <p className="text-[12px] text-[#c7c4d8] font-mono">
                {document.fileSize} • {document.pageCount} Pages • {document.chunkCount} Vector Chunks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2a2931] hover:bg-[#34343c] text-[#c7c4d8] hover:text-[#e4e1eb] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata pill row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#1b1b22] border border-[#2a2931]">
              <span className="text-[11px] font-mono text-[#c7c4d8] block mb-1 uppercase">SHA-256 Digest</span>
              <span className="text-[12px] font-mono text-[#e4e1eb] truncate block">{document.sha256}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#1b1b22] border border-[#2a2931]">
              <span className="text-[11px] font-mono text-[#c7c4d8] block mb-1 uppercase">Postgres Status</span>
              <span className="text-[12px] font-mono text-[#41eec2] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2]"></span>
                {document.status}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#1b1b22] border border-[#2a2931]">
              <span className="text-[11px] font-mono text-[#c7c4d8] block mb-1 uppercase">Embedding Dimension</span>
              <span className="text-[12px] font-mono text-[#c4c0ff]">768-dim (HNSW)</span>
            </div>
          </div>

          {/* Chunk Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-[#e4e1eb]">Retrieved Chunks in Document</span>
              <span className="text-[12px] font-mono text-[#c7c4d8]">{document.chunks.length} extracted</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {document.chunks.map((chk) => (
                <button
                  key={chk.id}
                  onClick={() => onSelectChunk && onSelectChunk(chk)}
                  className={`px-3 py-2 rounded-lg text-left text-[12px] font-mono border transition-all shrink-0 ${
                    activeChunk.id === chk.id
                      ? 'bg-[#2a2931] border-[#41eec2] text-[#41eec2] shadow-sm'
                      : 'bg-[#1b1b22] border-[#2a2931] text-[#c7c4d8] hover:text-[#e4e1eb]'
                  }`}
                >
                  <div className="font-semibold">#{chk.id}</div>
                  <div className="text-[10px] opacity-75">Page {chk.pageNumber} • {Math.round(chk.similarity * 100)}% Sim</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chunk Card */}
          {activeChunk && (
            <div className="rounded-xl bg-[#0e0e14] border border-[#2a2931] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2a2931] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#41eec2]/10 text-[#41eec2] text-[12px] font-mono font-bold">
                    Chunk #{activeChunk.id}
                  </span>
                  <span className="text-[12px] text-[#c7c4d8] font-mono">Page {activeChunk.pageNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#c7c4d8]">Cosine Distance:</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#1f1f26] text-[#41eec2] text-[12px] font-mono font-bold">
                    {activeChunk.similarity.toFixed(3)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-[#c7c4d8] block mb-2">Grounded Text Block</span>
                <div className="p-4 rounded-lg bg-[#1b1b22] border border-[#2a2931] text-[#e4e1eb] text-[14px] leading-relaxed font-normal italic">
                  "{activeChunk.content}"
                </div>
              </div>

              {activeChunk.vectorPreview && (
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#c7c4d8] block mb-1">
                    Dense Vector Preview (First 8 of 768 dims)
                  </span>
                  <div className="p-3 rounded-lg bg-[#16161f] font-mono text-[11px] text-[#c4c0ff] overflow-x-auto whitespace-nowrap">
                    [{activeChunk.vectorPreview.join(', ')}, ...]
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-[12px] font-mono text-[#c7c4d8]">
                <span>Tokens: {activeChunk.tokenCount}</span>
                <span className="flex items-center gap-1 text-[#41eec2]">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Verified in PostgreSQL
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#2a2931] bg-[#1b1b22] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#2a2931] hover:bg-[#34343c] text-[#e4e1eb] text-[13px] font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
