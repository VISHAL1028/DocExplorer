import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  RotateCcw,
  Square,
  Copy,
  Check,
  SlidersHorizontal,
  Bookmark,
  X
} from 'lucide-react';
import {
  DocumentItem,
  ConversationMessage,
  CitationDto,
  ChatRequestDto
} from '../types';
import { chatApi } from '../services/api';

interface ChatViewProps {
  messages: ConversationMessage[];
  onSendMessage: (text: string, topK?: number, minSimilarity?: number) => Promise<void>;
  documents: DocumentItem[];
  selectedDocumentId: string | null;
  onClearSelectedDocument: () => void;
  isStreaming: boolean;
  onStopStreaming?: () => void;
  onOpenDocumentDrawer?: (doc: DocumentItem, chunk?: any) => void;
}

const PROMPT_TEMPLATES = [
  {
    category: 'Summarization',
    icon: '📋',
    color: 'border-indigo-500/30 text-[#c4c0ff]',
    templates: [
      { label: 'Executive Summary', prompt: 'Provide a concise executive summary of the key points in this document.' },
      { label: 'Key Findings', prompt: 'What are the primary findings and compliance targets mentioned?' },
      { label: 'Action Items', prompt: 'List all action items, SLA commitments, and failover steps.' }
    ]
  },
  {
    category: 'SLA & Technical',
    icon: '⚡',
    color: 'border-emerald-500/30 text-[#41eec2]',
    templates: [
      { label: 'RTO / RPO Failover', prompt: 'What are our disaster recovery commitments and failover targets for the vector database?' },
      { label: 'Vector Search Latency', prompt: 'What does the SLA guarantee for p99 vector search latency and Postgres HNSW index performance?' },
      { label: 'SOC2 & Isolation', prompt: 'How does SOC2 handle tenant data isolation and ephemeral guest session auto-migration?' }
    ]
  }
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  documents,
  selectedDocumentId,
  onClearSelectedDocument,
  isStreaming,
  onStopStreaming,
  onOpenDocumentDrawer
}) => {
  const [inputText, setInputText] = useState('');
  const [topK, setTopK] = useState(3);
  const [minSimilarity, setMinSimilarity] = useState(0.65);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocumentId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isStreaming) return;
    const text = inputText;
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await onSendMessage(text, topK, minSimilarity);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopyMessage = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCitation = (msgId: string, citIdx: number) => {
    const key = `${msgId}-${citIdx}`;
    setExpandedCitations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#13131a] relative overflow-hidden select-text">
      {/* Active Document Filter Notification Banner */}
      {selectedDoc && (
        <div className="px-6 py-2 bg-[#1b1b22] border-b border-[#2a2931] flex items-center justify-between text-[12px] font-mono shrink-0">
          <div className="flex items-center gap-2 text-[#41eec2]">
            <FileText className="w-3.5 h-3.5" />
            <span>Grounded strictly to: <strong>{selectedDoc.title}</strong></span>
          </div>
          <button
            onClick={onClearSelectedDocument}
            className="flex items-center gap-1 text-[#918fa1] hover:text-[#e4e1eb] transition-colors"
          >
            <span>Clear filter</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty State & Prompt Templates */
          <div className="max-w-3xl mx-auto py-10 space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8781ff]/20 to-[#41eec2]/20 border border-[#8781ff]/30 text-[#c4c0ff] flex items-center justify-center mx-auto shadow-lg">
                <Bot className="w-7 h-7" />
              </div>
              <h2 className="text-[24px] font-bold text-[#e4e1eb]">DocExplorer Intelligence</h2>
              <p className="text-[14px] text-[#c7c4d8] max-w-md mx-auto">
                Ask questions across {documents.length} indexed documents with mathematical similarity rankings and exact citation proofs.
              </p>
            </div>

            {/* Prompt Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROMPT_TEMPLATES.map((cat, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl bg-[#16161f] border ${cat.color} space-y-3 shadow-md`}
                >
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#e4e1eb]">
                    <span>{cat.icon}</span>
                    <span>{cat.category}</span>
                  </div>
                  <div className="space-y-1.5">
                    {cat.templates.map((tpl, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(tpl.prompt, topK, minSimilarity)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#1b1b22] hover:bg-[#2a2931] border border-[#2a2931] hover:border-[#8781ff]/40 text-[12px] text-[#c7c4d8] hover:text-[#e4e1eb] transition-all truncate block"
                      >
                        <span className="font-medium text-[#e4e1eb] block truncate">{tpl.label}</span>
                        <span className="text-[11px] text-[#918fa1] truncate block">{tpl.prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation Messages */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                {msg.messageType === 'USER' ? (
                  /* User Prompt */
                  <div className="flex justify-end gap-3">
                    <div className="max-w-2xl p-4 rounded-2xl rounded-tr-none bg-[#2a2931] border border-[#34343c] text-[#e4e1eb] text-[14px] shadow-md">
                      <div className="text-[11px] font-mono text-[#8781ff] uppercase tracking-wider mb-1 font-semibold">
                        Human Prompt
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#8781ff] text-[#100069] flex items-center justify-center shrink-0 font-bold text-[12px] shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  /* Assistant Synthesized Answer */
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#c4c0ff] text-[#2000a4] flex items-center justify-center shrink-0 font-bold shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1 rounded-2xl rounded-tl-none bg-[#16161f] border border-[#2a2931] p-5 shadow-lg space-y-4">
                      {/* Response Top Bar */}
                      <div className="flex items-center justify-between border-b border-[#2a2931] pb-3 text-[11px] font-mono text-[#c7c4d8]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#41eec2] text-[16px]">verified_user</span>
                          <span className="text-[#41eec2] font-semibold">Grounded RAG Response</span>
                          {msg.responseTimeMs && (
                            <>
                              <span>•</span>
                              <span>{msg.responseTimeMs}ms</span>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="flex items-center gap-1 text-[#918fa1] hover:text-[#e4e1eb] transition-colors"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#41eec2]" />
                              <span className="text-[#41eec2]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Content with markdown formatting */}
                      <div className="text-[14px] text-[#e4e1eb] leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </div>

                      {/* Expandable Citation Cards */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-3 border-t border-[#2a2931] space-y-2">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-[#918fa1] font-semibold">
                            Indexed Grounded Evidence ({msg.citations.length} Sources)
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {msg.citations.map((cit, idx) => {
                              const key = `${msg.id}-${idx}`;
                              const isExp = expandedCitations[key];
                              const pct = Math.round(cit.similarityScore * 100);

                              return (
                                <div
                                  key={idx}
                                  className="rounded-xl bg-[#1b1b22] border border-[#2a2931] overflow-hidden transition-all"
                                >
                                  <div
                                    onClick={() => toggleCitation(msg.id, idx)}
                                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#1f1f26] transition-colors"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <Bookmark className="w-4 h-4 text-[#41eec2] shrink-0" />
                                      <span className="text-[13px] font-medium text-[#e4e1eb] font-mono truncate">
                                        {cit.fileName}
                                      </span>
                                      {cit.pageNumber && (
                                        <span className="px-1.5 py-0.5 rounded bg-[#2a2931] text-[11px] font-mono text-[#c7c4d8]">
                                          p.{cit.pageNumber}
                                        </span>
                                      )}
                                      <span className="px-1.5 py-0.5 rounded bg-[#41eec2]/10 text-[10px] font-mono text-[#41eec2] font-bold">
                                        #{cit.chunkIndex}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                        <span className="text-[#41eec2] font-bold">{pct}% Sim</span>
                                        <div className="w-14 bg-[#0e0e14] h-1.5 rounded-full overflow-hidden hidden sm:block">
                                          <div
                                            className="bg-[#41eec2] h-full rounded-full"
                                            style={{ width: `${pct}%` }}
                                          />
                                        </div>
                                      </div>
                                      {isExp ? (
                                        <ChevronUp className="w-4 h-4 text-[#918fa1]" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-[#918fa1]" />
                                      )}
                                    </div>
                                  </div>

                                  {isExp && (
                                    <div className="p-3 bg-[#0e0e14] border-t border-[#2a2931] space-y-2 animate-in fade-in duration-150">
                                      <div className="p-3 rounded-lg bg-[#16161f] border border-[#2a2931] text-[13px] text-[#c7c4d8] font-mono italic leading-relaxed">
                                        "{cit.snippet}"
                                      </div>
                                      <div className="flex justify-between items-center text-[11px] font-mono text-[#918fa1]">
                                        <span>PostgreSQL pgvector chunk storage</span>
                                        <button
                                          onClick={() => {
                                            const doc = documents.find((d) => d.id === cit.documentId || d.title === cit.fileName);
                                            if (doc && onOpenDocumentDrawer) {
                                              onOpenDocumentDrawer(doc);
                                            }
                                          }}
                                          className="text-[#8781ff] hover:underline"
                                        >
                                          Open in Inspector ➔
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isStreaming && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#1b1b22] border border-[#8781ff]/40 text-[#c4c0ff] font-mono text-[12px] animate-pulse">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#8781ff]" />
                  <span>Synthesizing tokens from pgvector knowledge base...</span>
                </div>
                {onStopStreaming && (
                  <button
                    onClick={onStopStreaming}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2a2931] text-[11px] text-[#ffb2b8] hover:bg-[#ff506f]/20 transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Query Input Toolbar */}
      <div className="p-3 md:p-4 border-t border-[#2a2931] bg-[#16161f]/90 backdrop-blur-md shrink-0">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Settings Bar Toggle */}
          {showSettings && (
            <div className="p-3 rounded-xl bg-[#1b1b22] border border-[#2a2931] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] font-mono animate-in fade-in duration-150">
              <div>
                <div className="flex justify-between text-[#c7c4d8] mb-1">
                  <span>Top-K Retrieved Chunks:</span>
                  <strong className="text-[#41eec2]">{topK}</strong>
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
                  <span>Min Cosine Similarity:</span>
                  <strong className="text-[#8781ff]">{minSimilarity.toFixed(2)}</strong>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="0.95"
                  step="0.05"
                  value={minSimilarity}
                  onChange={(e) => setMinSimilarity(Number(e.target.value))}
                  className="w-full accent-[#8781ff]"
                />
              </div>
            </div>
          )}

          {/* Textarea Input Card */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 bg-[#0e0e14] border border-[#2a2931] focus-within:border-[#8781ff] rounded-2xl p-2.5 transition-all shadow-inner"
          >
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-colors shrink-0 ${
                showSettings ? 'bg-[#2a2931] text-[#41eec2]' : 'text-[#918fa1] hover:text-[#e4e1eb]'
              }`}
              title="Search & Retrieval Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedDoc
                  ? `Ask question grounded in ${selectedDoc.title}...`
                  : 'Ask any question across all indexed vector documents...'
              }
              className="flex-1 bg-transparent text-[#e4e1eb] placeholder-[#918fa1] text-[14px] focus:outline-none resize-none max-h-36 py-1.5 px-2"
            />

            <button
              type="submit"
              disabled={isStreaming || !inputText.trim()}
              className="w-10 h-10 rounded-xl bg-[#8781ff] hover:bg-[#c4c0ff] disabled:opacity-40 text-[#100069] flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
