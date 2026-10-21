import React, { useState } from 'react';
import {
  Search,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Copy,
  Check,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { DocumentItem, CitationDto, SearchResultDto } from '../types';
import { chatApi } from '../services/api';

interface SearchViewProps {
  documents: DocumentItem[];
  selectedDocumentId: string | null;
  onOpenDocumentDrawer?: (doc: DocumentItem, chunk?: any) => void;
}

const SEARCH_TYPES = [
  { label: 'All', icon: '🔍', placeholder: 'Search any concept, technical topic, or keyword...' },
  { label: 'Clauses & SLAs', icon: '📜', placeholder: 'Find specific SLAs, failover commitments, or clauses...' },
  { label: 'Facts & Data', icon: '📊', placeholder: 'Find RTO/RPO targets, latency benchmarks, and metrics...' },
  { label: 'Security & SOC2', icon: '🛡️', placeholder: 'Look up encryption, zero-trust protocols, or tenant isolation...' }
];

function getScoreColor(score: number) {
  if (score >= 0.8) {
    return {
      bar: 'bg-[#41eec2]',
      badge: 'text-[#41eec2] bg-[#41eec2]/10 border-[#41eec2]/20',
      label: 'High Match'
    };
  }
  if (score >= 0.6) {
    return {
      bar: 'bg-amber-400',
      badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      label: 'Medium Match'
    };
  }
  return {
    bar: 'bg-red-400',
    badge: 'text-red-400 bg-red-400/10 border-red-400/20',
    label: 'Low Match'
  };
}

export const SearchView: React.FC<SearchViewProps> = ({
  documents,
  selectedDocumentId,
  onOpenDocumentDrawer
}) => {
  const [query, setQuery] = useState('');
  const [searchTypeIndex, setSearchTypeIndex] = useState(0);
  const [topK, setTopK] = useState(5);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.65);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultDto | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const activeSearchType = SEARCH_TYPES[searchTypeIndex];
  const selectedDoc = documents.find((d) => d.id === selectedDocumentId);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await chatApi.searchSimilarity(
        {
          query,
          documentId: selectedDocumentId || undefined,
          topK,
          similaritySearch: similarityThreshold
        },
        documents
      );
      setResults(res);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopySnippet = async (index: number, snippet: string) => {
    await navigator.clipboard.writeText(snippet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#13131a] p-4 md:p-8 space-y-6 select-text">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="border-b border-[#2a2931] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1f26] border border-[#2a2931] text-[11px] font-mono text-[#41eec2] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>pgvector Cosine Distance Search</span>
            </div>
            <h1 className="text-[24px] font-bold text-[#e4e1eb]">Semantic Similarity Search</h1>
            <p className="text-[13px] text-[#c7c4d8]">
              Directly query the vector space to inspect ranked chunks and similarity distances.
            </p>
          </div>

          {selectedDoc && (
            <div className="px-3 py-1.5 rounded-xl bg-[#1b1b22] border border-[#41eec2]/40 text-[#41eec2] font-mono text-[11px] self-start sm:self-auto">
              Scoping to: {selectedDoc.title}
            </div>
          )}
        </div>

        {/* Search Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SEARCH_TYPES.map((st, i) => (
            <button
              key={i}
              onClick={() => setSearchTypeIndex(i)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all whitespace-nowrap border ${
                searchTypeIndex === i
                  ? 'bg-[#8781ff] text-[#100069] border-[#8781ff] font-semibold shadow-md'
                  : 'bg-[#16161f] text-[#c7c4d8] border-[#2a2931] hover:bg-[#1b1b22] hover:text-[#e4e1eb]'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#0e0e14] border border-[#2a2931] focus-within:border-[#8781ff] transition-all shadow-inner">
            <Search className="w-5 h-5 text-[#918fa1] ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeSearchType.placeholder}
              className="flex-1 bg-transparent text-[#e4e1eb] placeholder-[#918fa1] text-[14px] focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#41eec2] hover:bg-[#55fcd0] disabled:opacity-40 text-[#00382b] font-semibold text-[13px] transition-all flex items-center gap-1.5 shrink-0 shadow-md active:scale-95"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Search Vectors</span>
            </button>
          </div>

          {/* Similarity Controls (Top-K & Threshold) */}
          <div className="p-4 rounded-xl bg-[#16161f] border border-[#2a2931] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] font-mono">
            <div>
              <div className="flex justify-between text-[#c7c4d8] mb-1">
                <span>Top-K Results Limit:</span>
                <strong className="text-[#41eec2]">{topK} chunks</strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-[#41eec2]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#c7c4d8] mb-1">
                <span>Minimum Cosine Score:</span>
                <strong className="text-[#8781ff]">{(similarityThreshold * 100).toFixed(0)}%</strong>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.95"
                step="0.05"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-full accent-[#8781ff]"
              />
            </div>
          </div>
        </form>

        {/* Results Area */}
        <div className="space-y-4">
          {isSearching && (
            <div className="text-center py-12 text-[#c4c0ff] font-mono text-[13px] flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scanning PostgreSQL HNSW indexes...</span>
            </div>
          )}

          {!isSearching && results && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[12px] font-mono text-[#c7c4d8]">
                <span>
                  Found <strong className="text-[#41eec2]">{results.totalMatches}</strong> matching chunks for "{results.query}"
                </span>
                <span>Sorted by Cosine Distance</span>
              </div>

              {results.matches.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-[#16161f] border border-[#2a2931] text-[#918fa1] text-[13px]">
                  No vector chunks exceeded the {Math.round(similarityThreshold * 100)}% similarity threshold.
                </div>
              ) : (
                results.matches.map((match, idx) => {
                  const scoreInfo = getScoreColor(match.similarityScore);
                  const isExp = expandedCards[idx];

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-[#16161f] border border-[#2a2931] hover:border-[#34343c] overflow-hidden transition-all shadow-md group"
                    >
                      {/* Top color indicator line */}
                      <div className={`h-1 w-full ${scoreInfo.bar}`} />

                      <div className="p-4 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-[#2a2931] text-[#c4c0ff] flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                              #{match.chunkIndex}
                            </span>
                            <span className="font-semibold text-[#e4e1eb] text-[14px] truncate font-mono">
                              {match.fileName}
                            </span>
                            {match.pageNumber && (
                              <span className="px-2 py-0.5 rounded bg-[#1f1f26] border border-[#2a2931] text-[11px] font-mono text-[#c7c4d8] shrink-0">
                                Page {match.pageNumber}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold ${scoreInfo.badge}`}
                            >
                              {(match.similarityScore * 100).toFixed(1)}% Sim
                            </span>
                          </div>
                        </div>

                        {/* Chunk Content */}
                        <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-[#2a2931] text-[13px] text-[#e4e1eb] leading-relaxed font-sans italic">
                          "{match.snippet}"
                        </div>

                        {/* Footer details */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#918fa1] pt-1">
                          <div className="flex items-center gap-3">
                            <span>Tokens: {String(match.metadata?.tokens ?? 380)}</span>
                            <span>•</span>
                            <button
                              onClick={() => {
                                const doc = documents.find((d) => d.id === match.documentId || d.title === match.fileName);
                                if (doc && onOpenDocumentDrawer) {
                                  onOpenDocumentDrawer(doc);
                                }
                              }}
                              className="text-[#8781ff] hover:underline"
                            >
                              View in Chunk Drawer
                            </button>
                          </div>

                          <button
                            onClick={() => handleCopySnippet(idx, match.snippet)}
                            className="flex items-center gap-1 hover:text-[#e4e1eb] transition-colors"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#41eec2]" />
                                <span className="text-[#41eec2]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
