import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DocumentItem, Chunk, BackendConfig } from '../types';

interface ChatStudioViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  documents: DocumentItem[];
  onOpenDocumentDrawer: (doc: DocumentItem, chunk?: Chunk) => void;
  backendConfig: BackendConfig;
  isStreaming: boolean;
}

export const ChatStudioView: React.FC<ChatStudioViewProps> = ({
  messages,
  onSendMessage,
  documents,
  onOpenDocumentDrawer,
  backendConfig,
  isStreaming
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemma-2 9B-IT');
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const samplePrompts = [
    'What are our disaster recovery commitments and failover targets?',
    'What does the SLA guarantee for p99 vector search latency?',
    'How does SOC2 handle ephemeral guest session isolation?'
  ];

  return (
    <div className="w-full h-[calc(100vh-80px)] mt-20 flex bg-[#13131a] text-[#e4e1eb] overflow-hidden">
      {/* Sidebar: Knowledge Base Corpus & Active Session */}
      <aside className="w-72 lg:w-80 border-r border-[#2a2931] bg-[#0e0e14] flex flex-col shrink-0 hidden md:flex">
        {/* Workspace Title */}
        <div className="p-4 border-b border-[#2a2931] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#41eec2] animate-pulse"></span>
            <span className="font-mono text-[13px] font-semibold text-[#e4e1eb]">pgvector Workspace</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#1f1f26] border border-[#2a2931] font-mono text-[11px] text-[#c4c0ff]">
            UUID: 8f9b
          </span>
        </div>

        {/* Active Grounding Sources */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-mono text-[#c7c4d8] uppercase tracking-wider">
                Grounded Corpora ({documents.length})
              </span>
              <span className="text-[10px] font-mono text-[#41eec2]">Active</span>
            </div>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onOpenDocumentDrawer(doc)}
                  className="p-3 rounded-xl bg-[#1b1b22] border border-[#2a2931] hover:border-[#8781ff]/50 hover:bg-[#1f1f26] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[18px] text-[#ffb2b8]">
                      {doc.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
                    </span>
                    <span className="text-[13px] font-medium text-[#e4e1eb] truncate group-hover:text-[#c4c0ff]">
                      {doc.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#c7c4d8]">
                    <span>{doc.chunkCount} vector chunks</span>
                    <span className="text-[#41eec2]">{doc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model & Embedder Spec Box */}
          <div className="p-3.5 rounded-xl bg-[#16161f] border border-[#2a2931] space-y-2 text-[12px] font-mono">
            <div className="text-[#c4c0ff] font-semibold flex items-center justify-between">
              <span>Embedding Engine</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2931]">Ollama Local</span>
            </div>
            <div className="text-[#c7c4d8] text-[11px]">
              Model: <strong className="text-[#e4e1eb]">nomic-embed-text</strong>
            </div>
            <div className="text-[#c7c4d8] text-[11px]">
              Vector Index: <strong className="text-[#41eec2]">PostgreSQL HNSW</strong>
            </div>
            <div className="text-[#c7c4d8] text-[11px]">
              Dimensionality: <strong className="text-[#e4e1eb]">768-dim</strong>
            </div>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div className="p-3.5 border-t border-[#2a2931] bg-[#1b1b22] text-[11px] font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${backendConfig.isConnected ? 'bg-[#41eec2]' : 'bg-amber-400'}`}
            ></span>
            <span className="text-[#c7c4d8] truncate max-w-[140px]">
              {backendConfig.isConnected ? 'Spring Boot Active' : 'Simulation Mode'}
            </span>
          </div>
          <span className="text-[#41eec2] font-semibold">{backendConfig.latencyMs}ms</span>
        </div>
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-full bg-[#13131a] relative overflow-hidden">
        {/* Top Chat Bar */}
        <div className="h-14 px-6 border-b border-[#2a2931] bg-[#16161f]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold text-[#e4e1eb]">Synthesis Studio</span>
            <span className="text-[#464555]">•</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2a2931] text-[11px] font-mono text-[#41eec2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
              Strict Grounding Guarantee
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[12px] font-mono text-[#c7c4d8] flex items-center gap-1.5">
              <span>Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#2a2931] border border-[#34343c] rounded-lg px-2.5 py-1 text-[#e4e1eb] text-[12px] font-mono focus:outline-none focus:border-[#8781ff]"
              >
                <option value="Gemma-2 9B-IT">Gemma-2 9B-IT</option>
                <option value="Llama-3.3 70B">Llama-3.3 70B</option>
                <option value="Mistral Nemo 12B">Mistral Nemo 12B</option>
              </select>
            </label>
          </div>
        </div>

        {/* Message Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="max-w-4xl mx-auto space-y-2">
              {msg.sender === 'human' ? (
                /* Human Question */
                <div className="flex items-start justify-end gap-3">
                  <div className="p-4 rounded-2xl rounded-tr-none bg-[#2a2931] border border-[#34343c] max-w-2xl text-[14px] text-[#e4e1eb] shadow-md">
                    <span className="font-mono text-[11px] text-[#c4c0ff] uppercase font-bold tracking-wider block mb-1">
                      Human Prompt
                    </span>
                    <p className="font-medium leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] font-mono text-[#918fa1] block text-right mt-1.5">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#8781ff] text-[#100069] flex items-center justify-center shrink-0 font-bold text-[12px]">
                    U
                  </div>
                </div>
              ) : (
                /* AI Assistant Grounded Answer */
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#c4c0ff] text-[#2000a4] flex items-center justify-center shrink-0 font-bold">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                  <div className="flex-1 rounded-2xl rounded-tl-none bg-[#1b1b22] border border-[#2a2931] p-5 shadow-lg space-y-4">
                    {/* Header with similarity and grounding pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2931]/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#41eec2] text-[18px]">verified_user</span>
                        <span className="font-mono text-[12px] text-[#41eec2] font-semibold">
                          Strictly Grounded Retrieval
                        </span>
                        <span className="text-[#464555] font-mono">•</span>
                        <span className="font-mono text-[11px] text-[#c7c4d8]">{msg.model || 'Gemma-2 9B-IT'}</span>
                      </div>
                      {msg.similarityScore && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#2a2931] text-[#41eec2] font-mono text-[11px]">
                          Cosine Distance: {(1 - msg.similarityScore).toFixed(3)} ({Math.round(msg.similarityScore * 100)}% Sim)
                        </span>
                      )}
                    </div>

                    {/* Answer text */}
                    <div className="text-[14px] text-[#e4e1eb] leading-relaxed whitespace-pre-line font-sans">
                      {msg.text}
                    </div>

                    {/* Interactive Citation Chips Drawer */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-[#2a2931]/60">
                        <span className="font-mono text-[11px] text-[#c7c4d8] uppercase tracking-wider block mb-2 font-semibold">
                          Retrieved Verified Citations ({msg.citations.length} Sources)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cit, i) => {
                            const matchedDoc = documents.find((d) => d.title === cit.documentTitle);
                            const matchedChunk = matchedDoc?.chunks.find((c) => c.id === cit.chunkId);

                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  if (matchedDoc) {
                                    onOpenDocumentDrawer(matchedDoc, matchedChunk);
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a2931] border border-[#34343c] hover:border-[#41eec2] text-[12px] font-mono text-[#e4e1eb] transition-all hover:scale-102 group text-left"
                              >
                                <span className="material-symbols-outlined text-[15px] text-[#41eec2]">bookmark</span>
                                <span className="text-[#41eec2] font-semibold">{cit.documentTitle}</span>
                                <span className="text-[#c7c4d8]">p.{cit.pageNumber}</span>
                                <span className="px-1.5 py-0.2 rounded bg-[#41eec2]/10 text-[#41eec2] text-[10px]">
                                  {cit.matchPercentage}% Sim
                                </span>
                              </button>
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
            <div className="max-w-4xl mx-auto flex items-center gap-3 text-[#c4c0ff] font-mono text-[12px] p-4 rounded-xl bg-[#1b1b22] border border-[#2a2931]">
              <span className="w-2 h-2 rounded-full bg-[#8781ff] animate-ping"></span>
              <span>DocExplorer synthesis stream receiving tokens (42 tokens/sec)...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        {messages.length <= 2 && (
          <div className="max-w-4xl mx-auto w-full px-4 mb-2 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-[#c7c4d8] shrink-0">Try asking:</span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(prompt)}
                className="px-3 py-1 rounded-full bg-[#1b1b22] border border-[#2a2931] hover:border-[#8781ff] text-[#c7c4d8] hover:text-[#e4e1eb] text-[12px] truncate whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Query Input Toolbar */}
        <div className="p-4 border-t border-[#2a2931] bg-[#16161f]/95 shrink-0">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1 rounded-2xl bg-[#0e0e14] border border-[#2a2931] px-4 py-3 flex items-center gap-3 focus-within:border-[#8781ff] transition-all shadow-inner">
              <span className="material-symbols-outlined text-[#c4c0ff] text-[20px]">psychology</span>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask any question grounded against your indexed vector database..."
                className="flex-1 bg-transparent text-[#e4e1eb] placeholder-[#918fa1] text-[14px] focus:outline-none"
              />
              <span className="font-mono text-[11px] text-[#918fa1] px-1.5 py-0.5 rounded bg-[#1f1f26] border border-[#2a2931]">
                ↵ Return
              </span>
            </div>
            <button
              type="submit"
              disabled={isStreaming || !inputText.trim()}
              className="w-12 h-12 rounded-2xl bg-[#8781ff] hover:bg-[#c4c0ff] disabled:opacity-50 text-[#100069] flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[22px]">send</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
