import React, { useState } from 'react';
import {
  Layers,
  FileText,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  Tag
} from 'lucide-react';
import { DocumentItem, Chunk } from '../types';

interface ChunksViewProps {
  documents: DocumentItem[];
  selectedDocumentId: string | null;
  onSelectDocument: (id: string | null) => void;
}

export const ChunksView: React.FC<ChunksViewProps> = ({
  documents,
  selectedDocumentId,
  onSelectDocument
}) => {
  const [chunkSearch, setChunkSearch] = useState('');
  const [expandedChunks, setExpandedChunks] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocumentId);

  // Collect all chunks matching current filter
  const targetDocs = selectedDoc ? [selectedDoc] : documents;
  const allChunksWithDoc: { doc: DocumentItem; chunk: Chunk }[] = [];

  targetDocs.forEach((doc) => {
    doc.chunks.forEach((chunk) => {
      if (
        !chunkSearch ||
        chunk.content.toLowerCase().includes(chunkSearch.toLowerCase()) ||
        doc.title.toLowerCase().includes(chunkSearch.toLowerCase()) ||
        chunk.id.toLowerCase().includes(chunkSearch.toLowerCase())
      ) {
        allChunksWithDoc.push({ doc, chunk });
      }
    });
  });

  const toggleExpand = (id: string) => {
    setExpandedChunks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#13131a] p-4 md:p-8 space-y-6 select-text">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-[#2a2931] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1f26] border border-[#2a2931] text-[11px] font-mono text-[#c4c0ff] mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>pgvector Chunk Decomposition</span>
            </div>
            <h1 className="text-[24px] font-bold text-[#e4e1eb]">Vector Chunks Explorer</h1>
            <p className="text-[13px] text-[#c7c4d8]">
              Inspect extracted textual segments, HNSW vector embeddings, and token counts.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-3 py-1.5 rounded-xl bg-[#1b1b22] border border-[#2a2931] text-[#e4e1eb]">
              Total Chunks: <strong className="text-[#41eec2]">{allChunksWithDoc.length}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#1b1b22] border border-[#2a2931] text-[#e4e1eb]">
              Dim: <strong className="text-[#c4c0ff]">768</strong>
            </span>
          </div>
        </div>

        {/* Toolbar: Document Selector + Keyword Search */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <label className="block text-[11px] font-mono uppercase text-[#918fa1] mb-1">
              Select Document
            </label>
            <select
              value={selectedDocumentId || ''}
              onChange={(e) => onSelectDocument(e.target.value ? e.target.value : null)}
              className="w-full px-3 py-2 rounded-xl bg-[#16161f] border border-[#2a2931] text-[#e4e1eb] text-[13px] font-mono focus:outline-none focus:border-[#8781ff]"
            >
              <option value="">All Documents ({documents.length})</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.chunkCount} chunks)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-7">
            <label className="block text-[11px] font-mono uppercase text-[#918fa1] mb-1">
              Filter Text or Chunk #ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#918fa1]" />
              <input
                type="text"
                value={chunkSearch}
                onChange={(e) => setChunkSearch(e.target.value)}
                placeholder="Search raw chunk content, RTO, latency..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#16161f] border border-[#2a2931] text-[13px] text-[#e4e1eb] placeholder-[#918fa1] focus:outline-none focus:border-[#8781ff]"
              />
            </div>
          </div>
        </div>

        {/* Chunks List */}
        <div className="space-y-3">
          {allChunksWithDoc.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-[#16161f] border border-[#2a2931] text-[#918fa1] text-[13px]">
              No chunks matched the current filters.
            </div>
          ) : (
            allChunksWithDoc.map(({ doc, chunk }, idx) => {
              const isExp = expandedChunks[chunk.id] ?? true;
              return (
                <div
                  key={chunk.id || idx}
                  className="rounded-2xl bg-[#16161f] border border-[#2a2931] hover:border-[#34343c] overflow-hidden transition-all shadow-md"
                >
                  {/* Top Bar */}
                  <div
                    onClick={() => toggleExpand(chunk.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#1b1b22] transition-colors select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#8781ff]/15 border border-[#8781ff]/30 text-[#c4c0ff] flex items-center justify-center font-mono font-bold text-[12px] shrink-0">
                        #{chunk.chunkIndex}
                      </div>

                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold text-[#e4e1eb] font-mono block truncate">
                          {doc.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#918fa1]">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-[#ffb2b8]" /> Page {chunk.pageNumber}
                          </span>
                          <span>•</span>
                          <span>{chunk.tokenCount} tokens</span>
                          <span>•</span>
                          <span className="text-[#41eec2] font-semibold">
                            {Math.round(chunk.similarity * 100)}% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(chunk.id, chunk.content);
                        }}
                        className="p-1.5 rounded-lg text-[#918fa1] hover:text-[#e4e1eb] hover:bg-[#2a2931] transition-colors"
                        title="Copy Chunk"
                      >
                        {copiedId === chunk.id ? (
                          <Check className="w-4 h-4 text-[#41eec2]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      {isExp ? (
                        <ChevronUp className="w-4 h-4 text-[#918fa1]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#918fa1]" />
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  {isExp && (
                    <div className="p-4 bg-[#0e0e14] border-t border-[#2a2931] space-y-3 animate-in fade-in duration-150">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#918fa1] block mb-1">
                          Extracted Grounded Text
                        </span>
                        <div className="p-3.5 rounded-xl bg-[#16161f] border border-[#2a2931] text-[13px] text-[#e4e1eb] leading-relaxed font-sans">
                          {chunk.content}
                        </div>
                      </div>

                      {/* Vector Preview */}
                      {chunk.vectorPreview && (
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#918fa1] block mb-1">
                            Vector Preview (pgvector nomic-embed-text / 768 dimensions)
                          </span>
                          <div className="p-2.5 rounded-lg bg-[#121218] border border-[#2a2931] text-[11px] font-mono text-[#c4c0ff] overflow-x-auto whitespace-nowrap">
                            [{chunk.vectorPreview.join(', ')}, ...]
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
