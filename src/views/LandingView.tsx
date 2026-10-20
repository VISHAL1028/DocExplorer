import React, { useState } from 'react';
import { NavigationTab, DocumentItem, Chunk } from '../types';

interface LandingViewProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpenDocumentDrawer: (doc: DocumentItem, chunk?: Chunk) => void;
  documents: DocumentItem[];
  onUploadFile?: (file: File) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onTabChange,
  onOpenDocumentDrawer,
  documents,
  onUploadFile
}) => {
  const [workbenchQuery, setWorkbenchQuery] = useState('');
  const [highlightChunk, setHighlightChunk] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const primaryDoc = documents[0];
  const primaryChunk = primaryDoc?.chunks[0];

  const handleCitationClick = () => {
    setHighlightChunk(true);
    if (primaryDoc && primaryChunk) {
      onOpenDocumentDrawer(primaryDoc, primaryChunk);
    }
  };

  const handleWorkbenchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onTabChange('chat-studio');
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onUploadFile) {
        onUploadFile(e.dataTransfer.files[0]);
      }
      onTabChange('documents');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#13131a] text-[#e4e1eb] relative overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#c4c0ff]/20 via-[#8781ff]/10 to-transparent blur-[140px] pointer-events-none rounded-full"></div>
      <div className="absolute top-[420px] -left-48 w-[500px] h-[500px] bg-[#41eec2]/10 blur-[130px] pointer-events-none rounded-full"></div>
      <div className="absolute top-[680px] -right-48 w-[600px] h-[600px] bg-[#c4c0ff]/10 blur-[150px] pointer-events-none rounded-full"></div>

      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-20 flex flex-col items-center text-center">
        {/* Status Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a2931]/80 border border-[#34343c] backdrop-blur-md shadow-md mb-8">
          <span className="w-2 h-2 rounded-full bg-[#41eec2] animate-pulse"></span>
          <span className="font-mono text-[11px] text-[#41eec2] uppercase tracking-widest font-semibold">
            Enterprise RAG Engine v2.0
          </span>
          <span className="text-[#464555] font-mono">•</span>
          <span className="font-mono text-[12px] text-[#c7c4d8]">PostgreSQL pgvector Grounded</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-[38px] sm:text-[48px] md:text-[54px] md:leading-[62px] text-[#e4e1eb] font-bold tracking-tight max-w-4xl mx-auto mb-6">
          Chat with your documents using{' '}
          <span className="bg-gradient-to-r from-[#c4c0ff] via-[#8781ff] to-[#41eec2] bg-clip-text text-transparent">
            grounded AI intelligence
          </span>
          .
        </h1>

        {/* Subheadline */}
        <p className="text-[16px] md:text-[18px] text-[#c7c4d8] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Upload PDFs, Word docs, CSVs, or Markdown. DocMind indexes your files with pgvector embeddings and delivers
          cited, hallucination-free synthesis powered by state-of-the-art LLMs.
        </p>

        {/* CTA Buttons Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12">
          <button
            onClick={() => onTabChange('chat-studio')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[16px] bg-[#8781ff] text-[#100069] font-semibold hover:bg-[#c4c0ff] transition-all shadow-xl hover:shadow-[#8781ff]/30 active:scale-95"
          >
            <span>Try in Guest Mode</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <a
            href="#interactive-preview"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[16px] bg-[#2a2931]/90 text-[#e4e1eb] hover:text-[#c4c0ff] hover:bg-[#34343c] transition-all shadow-sm border border-[#34343c]"
          >
            <span className="material-symbols-outlined text-[20px] text-[#41eec2]">play_circle</span>
            <span>View Interactive Demo</span>
          </a>
        </div>

        {/* Quick Session Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[#c7c4d8] font-mono text-[11px] mb-16">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#41eec2] text-[16px]">verified</span> Zero setup
          </span>
          <span className="w-1 h-1 rounded-full bg-[#464555]"></span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#41eec2] text-[16px]">lock_open</span> Anonymous sandbox
          </span>
          <span className="w-1 h-1 rounded-full bg-[#464555]"></span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#41eec2] text-[16px]">sync_alt</span> Auto-migrates to user account
          </span>
        </div>

        {/* HERO VISUAL MOCKUP (Dynamic Split-Screen Workbench) */}
        <div
          id="interactive-preview"
          className="w-full relative rounded-2xl bg-[#0e0e14] border border-[#2a2931] p-2 md:p-3 shadow-2xl backdrop-blur-2xl"
        >
          {/* Workbench Shell Top Bar */}
          <div className="w-full px-4 py-2.5 rounded-xl bg-[#1f1f26] border border-[#2a2931] flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff506f]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#34343c]"></span>
              <span className="w-3 h-3 rounded-full bg-[#00d1a7]/80"></span>
              <span className="ml-3 font-mono text-[12px] text-[#c7c4d8]">workbench_session_8f9b4e12.rag</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#2a2931] text-[#41eec2] font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
                Cosine Similarity: 0.942
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#c7c4d8]">
                <span>nomic-embed-text (768-dim)</span>
                <span>•</span>
                <span className="text-[#c4c0ff] font-semibold">Gemma-2 9B-IT</span>
              </div>
            </div>
          </div>

          {/* Split View: Source PDF & RAG Synthesizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
            {/* LEFT: Document Inspector / Grounded Source Document (5 Cols) */}
            <div
              onClick={() => onOpenDocumentDrawer(primaryDoc, primaryChunk)}
              className="lg:col-span-5 rounded-xl bg-[#1b1b22] border border-[#2a2931] p-4 flex flex-col justify-between overflow-hidden shadow-inner relative group cursor-pointer hover:border-[#8781ff]/40 transition-colors"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2a2931]/60">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#ffb2b8] text-[20px]">picture_as_pdf</span>
                  <span className="font-mono text-[13px] text-[#e4e1eb] font-medium truncate">
                    Q3_FY2025_Risk_Assessment.pdf
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#34343c] text-[#c7c4d8] font-mono text-[11px] shrink-0">
                  Page 14 of 48
                </span>
              </div>

              {/* Mini Document Preview Sheet */}
              <div className="rounded-lg bg-[#0e0e14] border border-[#2a2931]/80 p-4 text-[#c7c4d8] font-mono text-[12px] leading-relaxed space-y-3 relative overflow-hidden">
                <div className="text-[#e4e1eb] text-[16px] font-semibold mb-2 font-sans">
                  Section 4.3: Cloud Infrastructure Redundancy
                </div>
                <p className="opacity-60 text-[12px]">
                  Primary data center failovers are executed across dual-availability regions within 45 seconds of
                  signal degradation. Automated health checks poll heartbeat services every 500 milliseconds.
                </p>

                {/* Grounded Chunk Highlight */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    highlightChunk
                      ? 'bg-[#00d1a7]/20 border-[#41eec2] shadow-[0_0_15px_rgba(65,238,194,0.3)] ring-1 ring-[#41eec2]'
                      : 'bg-[#00d1a7]/10 border-[#00d1a7]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-[#41eec2] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">bolt</span> RETRIEVED CHUNK #chunk-8821
                    </span>
                    <span className="text-[11px] font-mono text-[#41eec2] bg-[#41eec2]/10 px-2 py-0.5 rounded">
                      98.4% Match
                    </span>
                  </div>
                  <p className="text-[#e4e1eb] text-[12px] font-sans italic">
                    "The disaster recovery strategy guarantees a Recovery Time Objective (RTO) under 3 minutes and a
                    Recovery Point Objective (RPO) of zero for all pgvector semantic knowledge stores."
                  </p>
                </div>

                <p className="opacity-60 text-[12px]">
                  Compliance mandates ISO/IEC 27001 zero-trust access control protocols throughout pipeline staging
                  tiers and asynchronous webhook handlers.
                </p>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-[#c7c4d8] font-mono text-[11px] border-t border-[#2a2931]/60">
                <div className="flex items-center gap-1 text-[#41eec2]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Verified in Postgres Vector Store</span>
                </div>
                <span>SHA-256: d84f...c10b</span>
              </div>
            </div>

            {/* RIGHT: AI Synthesizer Stream & Interactive Citation Chips (7 Cols) */}
            <div className="lg:col-span-7 rounded-xl bg-[#13131a] border border-[#2a2931] p-5 flex flex-col justify-between shadow-sm">
              <div>
                {/* Stream Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2a2931]/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#8781ff] text-[#100069] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    </div>
                    <span className="text-[16px] text-[#e4e1eb] font-semibold">DocMind Synthesis Stream</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#2a2931] text-[#c4c0ff] font-mono text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4c0ff] animate-ping"></span>
                    SSE Streaming (42 tps)
                  </span>
                </div>

                {/* User Query Node */}
                <div className="p-3.5 rounded-xl bg-[#2a2931] border border-[#34343c] mb-4">
                  <span className="font-mono text-[11px] text-[#c4c0ff] uppercase font-bold tracking-wider block mb-1">
                    Human Prompt
                  </span>
                  <p className="text-[14px] text-[#e4e1eb] font-medium">
                    What are our disaster recovery commitments and failover targets for the vector database?
                  </p>
                </div>

                {/* Synthesized Answer with Inline Citation Chips */}
                <div className="p-4 rounded-xl bg-[#1b1b22] border border-[#2a2931] mb-4 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#41eec2] text-[18px]">verified_user</span>
                    <span className="font-mono text-[11px] text-[#41eec2] font-semibold">Strictly Grounded Retrieval</span>
                  </div>
                  <div className="space-y-3 text-[14px] text-[#e4e1eb] leading-relaxed">
                    <p>
                      Based on your verified internal document, the architecture implements dual-availability failovers
                      triggered within 45 seconds of anomaly detection.
                    </p>
                    <p>
                      Specifically, the disaster recovery commitment establishes a Recovery Time Objective{' '}
                      <button
                        onClick={handleCitationClick}
                        title="Click to inspect source chunk in document"
                        className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-full bg-[#41eec2]/10 border border-[#41eec2]/30 text-[#41eec2] font-mono text-[11px] shadow-sm cursor-pointer hover:bg-[#41eec2]/20 hover:scale-105 transition-all"
                      >
                        <span className="material-symbols-outlined text-[13px]">bookmark</span>
                        (RTO &lt; 3 mins)
                        <span className="text-[10px] opacity-75">p.14</span>
                      </button>
                      {' '}and maintains a Recovery Point Objective of zero{' '}
                      <button
                        onClick={handleCitationClick}
                        title="Click to inspect source chunk in document"
                        className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-full bg-[#41eec2]/10 border border-[#41eec2]/30 text-[#41eec2] font-mono text-[11px] shadow-sm cursor-pointer hover:bg-[#41eec2]/20 hover:scale-105 transition-all"
                      >
                        <span className="material-symbols-outlined text-[13px]">dataset</span>
                        (RPO = 0)
                        <span className="text-[10px] opacity-75">#chunk-8821</span>
                      </button>
                      {' '}specifically guarded for all pgvector stores.
                    </p>
                  </div>
                </div>

                {/* Grounded Evidence Drawer (Citations List) */}
                <div className="rounded-xl bg-[#1f1f26] border border-[#2a2931] p-3 space-y-2">
                  <div className="text-[#c7c4d8] font-mono text-[11px] flex items-center justify-between">
                    <span className="font-semibold text-[#e4e1eb] uppercase tracking-wider">Indexed References (2 Sources)</span>
                    <span>100% Grounded • 0% Extrapolation</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div
                      onClick={() => onOpenDocumentDrawer(documents[0])}
                      className="p-2.5 rounded-lg bg-[#2a2931] hover:bg-[#34343c] cursor-pointer transition-colors border border-[#34343c]"
                    >
                      <div className="flex items-center justify-between mb-1 font-mono text-[12px]">
                        <span className="text-[#e4e1eb] truncate">Q3_FY2025_Risk.pdf</span>
                        <span className="text-[#41eec2] font-bold">0.98 Sim</span>
                      </div>
                      <div className="w-full bg-[#0e0e14] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#41eec2] h-full rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div
                      onClick={() => onOpenDocumentDrawer(documents[1])}
                      className="p-2.5 rounded-lg bg-[#2a2931] hover:bg-[#34343c] cursor-pointer transition-colors border border-[#34343c]"
                    >
                      <div className="flex items-center justify-between mb-1 font-mono text-[12px]">
                        <span className="text-[#e4e1eb] truncate">Infra_SLA_Doc.docx</span>
                        <span className="text-[#c4c0ff] font-bold">0.89 Sim</span>
                      </div>
                      <div className="w-full bg-[#0e0e14] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#8781ff] h-full rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Omni Input inside Mockup */}
              <form onSubmit={handleWorkbenchSubmit} className="mt-4 pt-3 flex items-center gap-2">
                <div className="flex-1 bg-[#2a2931] border border-[#34343c] rounded-xl px-4 py-2.5 flex items-center justify-between shadow-inner focus-within:border-[#8781ff]">
                  <input
                    type="text"
                    value={workbenchQuery}
                    onChange={(e) => setWorkbenchQuery(e.target.value)}
                    placeholder="Ask a clarifying question about RTO failover steps..."
                    className="bg-transparent text-[#e4e1eb] placeholder-[#918fa1] text-[13px] w-full focus:outline-none"
                  />
                  <span className="font-mono text-[11px] text-[#918fa1] px-1.5 py-0.5 rounded bg-[#1f1f26] shrink-0 ml-2">
                    ↵ Enter
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-[#c4c0ff] text-[#2000a4] flex items-center justify-center shadow-md hover:bg-[#8781ff] transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 4-STEP INTERACTIVE RAG PIPELINE */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-[#2a2931]/40">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="font-mono text-[11px] text-[#41eec2] uppercase tracking-widest font-bold mb-2">
            Deterministic Reasoning Engine
          </div>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-[#e4e1eb]">
            High-throughput RAG Pipeline in 4 Steps
          </h2>
          <p className="text-[14px] text-[#c7c4d8] mt-3 leading-relaxed">
            Every assertion maps directly to your uploaded content. Unmodified raw embeddings with mathematically
            verifiable similarity rankings.
          </p>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-6 flex flex-col justify-between hover:bg-[#1f1f26] hover:border-[#8781ff]/40 transition-all group shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#8781ff]/20 text-[#c4c0ff] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">upload_file</span>
              </div>
              <div className="font-mono text-[11px] text-[#c4c0ff] uppercase tracking-wider mb-1 font-bold">
                Step 01 / Ingestion
              </div>
              <h3 className="text-[18px] text-[#e4e1eb] font-semibold mb-2">Multi-Format Ingest</h3>
              <p className="text-[13px] text-[#c7c4d8] leading-relaxed">
                Extract raw textual blocks and clean layouts from PDF, DOCX, TXT, and CSV documents up to 100MB per file with automatic page preservation.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#0e0e14]/60 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl border-t border-[#2a2931]/60">
              <span className="font-mono text-[11px] text-[#c7c4d8] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#41eec2]">memory</span>
                Apache Tika parser integrated
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-6 flex flex-col justify-between hover:bg-[#1f1f26] hover:border-[#41eec2]/40 transition-all group shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#00d1a7]/20 text-[#41eec2] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">hub</span>
              </div>
              <div className="font-mono text-[11px] text-[#41eec2] uppercase tracking-wider mb-1 font-bold">
                Step 02 / Vectorizing
              </div>
              <h3 className="text-[18px] text-[#e4e1eb] font-semibold mb-2">pgvector Embeddings</h3>
              <p className="text-[13px] text-[#c7c4d8] leading-relaxed">
                Chunked text segments are embedded using Ollama{' '}
                <code className="text-[#41eec2] font-mono text-[11px]">nomic-embed-text</code> yielding dense
                768-dimensional vector representations.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#0e0e14]/60 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl border-t border-[#2a2931]/60">
              <span className="font-mono text-[11px] text-[#c7c4d8] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#41eec2]">database</span>
                HNSW index in PostgreSQL
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-6 flex flex-col justify-between hover:bg-[#1f1f26] hover:border-[#8781ff]/40 transition-all group shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#8781ff]/20 text-[#c4c0ff] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">manage_search</span>
              </div>
              <div className="font-mono text-[11px] text-[#c4c0ff] uppercase tracking-wider mb-1 font-bold">
                Step 03 / Matching
              </div>
              <h3 className="text-[18px] text-[#e4e1eb] font-semibold mb-2">Semantic Top-K Retrieval</h3>
              <p className="text-[13px] text-[#c7c4d8] leading-relaxed">
                Incoming queries trigger cosine distance scans with strict thresholding, isolating only the most relevant document chunks for the contextual prompt window.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#0e0e14]/60 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl border-t border-[#2a2931]/60">
              <span className="font-mono text-[11px] text-[#c7c4d8] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#41eec2]">speed</span>
                &lt; 18ms latency @ 1M vectors
              </span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-6 flex flex-col justify-between hover:bg-[#1f1f26] hover:border-[#41eec2]/40 transition-all group shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#00d1a7]/20 text-[#41eec2] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <div className="font-mono text-[11px] text-[#41eec2] uppercase tracking-wider mb-1 font-bold">
                Step 04 / Synthesis
              </div>
              <h3 className="text-[18px] text-[#e4e1eb] font-semibold mb-2">Grounded Generation</h3>
              <p className="text-[13px] text-[#c7c4d8] leading-relaxed">
                Frontier models generate verifiable answers locked down with system prompt constraints to prohibit hallucination and inject exact citation tokens.
              </p>
            </div>
            <div className="mt-6 pt-4 bg-[#0e0e14]/60 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl border-t border-[#2a2931]/60">
              <span className="font-mono text-[11px] text-[#c7c4d8] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#41eec2]">verified</span>
                Zero-extrapolation guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FEATURE GRID & BENTO MATRIX */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-[11px] text-[#c4c0ff] uppercase font-bold tracking-wider">
              Engine Capabilities
            </span>
            <h2 className="text-[28px] sm:text-[36px] text-[#e4e1eb] font-bold mt-1">
              Built for Mission-Critical Precision
            </h2>
          </div>
          <p className="text-[#c7c4d8] text-[14px] max-w-md leading-relaxed">
            Designed for technical, compliance, and research workflows where factual accuracy is paramount and unverifiable answers are unacceptable.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Bento 1: Grounded Citations (2 Cols) */}
          <div className="md:col-span-2 rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-8 relative overflow-hidden flex flex-col justify-between shadow-md">
            <div className="max-w-xl">
              <div className="w-10 h-10 rounded-lg bg-[#2a2931] flex items-center justify-center text-[#c4c0ff] mb-4">
                <span className="material-symbols-outlined">fact_check</span>
              </div>
              <h3 className="text-[22px] text-[#e4e1eb] font-bold mb-3">
                Exact Citation Links &amp; Semantic Score Badges
              </h3>
              <p className="text-[14px] text-[#c7c4d8] mb-6 leading-relaxed">
                Never wonder where an answer originated. DocMind appends reactive citation pills linked directly to source coordinates: original document name, page, and chunk score.
              </p>
            </div>

            {/* Interactive Graphic Demonstration */}
            <div className="w-full rounded-xl bg-[#0e0e14] border border-[#2a2931] p-5 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenDocumentDrawer(documents[2])}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2a2931] border border-[#34343c] hover:border-[#41eec2] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#41eec2] text-[16px]">menu_book</span>
                  <span className="font-mono text-[12px] text-[#e4e1eb]">SOC2_Audit_Report.pdf</span>
                  <span className="font-mono text-[11px] text-[#41eec2] bg-[#41eec2]/10 px-2 py-0.5 rounded">p. 32</span>
                </button>
                <button
                  onClick={() => onOpenDocumentDrawer(documents[3])}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2a2931] border border-[#34343c] hover:border-[#c4c0ff] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#c4c0ff] text-[16px]">description</span>
                  <span className="font-mono text-[12px] text-[#e4e1eb]">Data_Processing_Addendum.docx</span>
                  <span className="font-mono text-[11px] text-[#c4c0ff] bg-[#c4c0ff]/10 px-2 py-0.5 rounded">p. 4</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-[#1f1f26] border border-[#2a2931] flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#c7c4d8]">
                  Top-1 Cosine Distance: <strong className="text-[#e4e1eb]">0.058 (94.2% Similarity)</strong>
                </span>
                <span className="text-[#41eec2]">Status: Verified Grounded</span>
              </div>
            </div>
          </div>

          {/* Bento 2: Real-time Streaming (1 Col) */}
          <div className="rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#2a2931] flex items-center justify-center text-[#41eec2] mb-4">
                <span className="material-symbols-outlined">stream</span>
              </div>
              <h3 className="text-[22px] text-[#e4e1eb] font-bold mb-3">Instant Token Streaming</h3>
              <p className="text-[14px] text-[#c7c4d8] leading-relaxed">
                High-throughput Server-Sent Events (SSE) stream synthesized tokens directly from Ollama or OpenRouter with sub-second time-to-first-token.
              </p>
            </div>
            <div className="mt-6 pt-4 rounded-xl bg-[#1f1f26] border border-[#2a2931] p-4">
              <div className="flex items-center justify-between text-[#c7c4d8] font-mono text-[11px] mb-2">
                <span>Streaming throughput</span>
                <span className="text-[#41eec2]">48.2 tokens/sec</span>
              </div>
              <div className="w-full bg-[#0e0e14] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#8781ff] to-[#41eec2] h-full rounded-full transition-all duration-1000"
                  style={{ width: '78%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bento 3: Guest Mode & Transparent Claiming (1 Col) */}
          <div className="rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#2a2931] flex items-center justify-center text-[#c4c0ff] mb-4">
                <span className="material-symbols-outlined">fingerprint</span>
              </div>
              <h3 className="text-[22px] text-[#e4e1eb] font-bold mb-3">Frictionless Guest Sandbox</h3>
              <p className="text-[14px] text-[#c7c4d8] leading-relaxed">
                Every anonymous visitor gets an instant isolated UUID session. Upload, embed, and test documents immediately. All vector indices silently claim into your permanent account when you register.
              </p>
            </div>
            <div className="mt-6 p-3.5 rounded-xl bg-[#1f1f26] border border-[#2a2931] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#41eec2]">cached</span>
              <div className="text-left font-mono text-[11px]">
                <div className="text-[#e4e1eb] font-bold">Session Auto-Migration</div>
                <div className="text-[#c7c4d8]">0 ms data transfer overhead</div>
              </div>
            </div>
          </div>

          {/* Large Bento 4: Bulk Ingestion Engine (2 Cols) */}
          <div className="md:col-span-2 rounded-2xl bg-[#1b1b22] border border-[#2a2931] p-8 flex flex-col justify-between shadow-md">
            <div className="max-w-xl">
              <div className="w-10 h-10 rounded-lg bg-[#2a2931] flex items-center justify-center text-[#41eec2] mb-4">
                <span className="material-symbols-outlined">layers</span>
              </div>
              <h3 className="text-[22px] text-[#e4e1eb] font-bold mb-3">
                Live Status Polling &amp; Asynchronous Parsing
              </h3>
              <p className="text-[14px] text-[#c7c4d8] mb-6 leading-relaxed">
                Track document pipeline states in real-time. Drop multi-gigabyte corpora and observe lifecycle transitions from <code className="text-[#c4c0ff] font-mono text-xs">UPLOADING</code> to <code className="text-[#c4c0ff] font-mono text-xs">PROCESSING</code> to <code className="text-[#41eec2] font-mono text-xs">INDEXED</code>.
              </p>
            </div>

            {/* Live Pipeline Visualizer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1f1f26] border border-[#2a2931] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#34343c] flex items-center justify-center text-[#c7c4d8]">
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#c7c4d8] uppercase">Phase 1</span>
                  <div className="font-mono text-[12px] text-[#e4e1eb] font-bold">Async Upload</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1f1f26] border border-[#2a2931] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8781ff]/20 flex items-center justify-center text-[#c4c0ff]">
                  <span className="material-symbols-outlined text-[18px]">transform</span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#c4c0ff] uppercase">Phase 2</span>
                  <div className="font-mono text-[12px] text-[#e4e1eb] font-bold">Ollama Chunking</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#1f1f26] border border-[#2a2931] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#41eec2]/20 flex items-center justify-center text-[#41eec2]">
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#41eec2] uppercase">Phase 3</span>
                  <div className="font-mono text-[12px] text-[#e4e1eb] font-bold">pgvector Indexed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ENTERPRISE TECH STACK BANNER */}
      <section className="w-full bg-[#0e0e14]/80 border-y border-[#2a2931]/60 py-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center">
          <span className="font-mono text-[11px] text-[#c7c4d8] uppercase tracking-widest font-semibold mb-6">
            Architected on Industry Standard Frameworks
          </span>
          <div className="w-full flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#2a2931]/60 border border-[#34343c] shadow-sm">
              <span className="material-symbols-outlined text-[#41eec2] text-[22px]">code_blocks</span>
              <span className="text-[16px] text-[#e4e1eb] font-semibold">Spring Boot 4.1.1</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#2a2931]/60 border border-[#34343c] shadow-sm">
              <span className="material-symbols-outlined text-[#c4c0ff] text-[22px]">psychology_alt</span>
              <span className="text-[16px] text-[#e4e1eb] font-semibold">Spring AI 2.0.1</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#2a2931]/60 border border-[#34343c] shadow-sm">
              <span className="material-symbols-outlined text-[#41eec2] text-[22px]">dns</span>
              <span className="text-[16px] text-[#e4e1eb] font-semibold">PostgreSQL + pgvector</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#2a2931]/60 border border-[#34343c] shadow-sm">
              <span className="material-symbols-outlined text-[#c4c0ff] text-[22px]">terminal</span>
              <span className="text-[16px] text-[#e4e1eb] font-semibold">Ollama Local AI</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#2a2931]/60 border border-[#34343c] shadow-sm">
              <span className="material-symbols-outlined text-[#41eec2] text-[22px]">router</span>
              <span className="text-[16px] text-[#e4e1eb] font-semibold">OpenRouter Gateways</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: READY TO START CTA WITH INSTANT DROPZONE TEASER */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#2a2931] via-[#1f1f26] to-[#1b1b22] border border-[#34343c] p-8 md:p-14 overflow-hidden shadow-2xl">
          {/* Accent Glows Inside Card */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#c4c0ff]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#41eec2]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text and Action Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34343c] text-[#41eec2] font-mono text-[11px]">
                <span className="material-symbols-outlined text-[16px]">bolt</span> Instant Evaluation
              </div>
              <h2 className="text-[32px] sm:text-[42px] md:leading-[50px] text-[#e4e1eb] font-bold tracking-tight">
                Ready to interrogate your documents with real citations?
              </h2>
              <p className="text-[16px] text-[#c7c4d8] max-w-xl leading-relaxed">
                Launch into guest mode right now. No email required. Drop an NDA, technical spec, or financial statement and receive your first grounded synthesis in seconds.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onTabChange('chat-studio')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[16px] bg-[#8781ff] text-[#100069] font-semibold hover:bg-[#c4c0ff] transition-all shadow-xl hover:shadow-[#8781ff]/30 active:scale-95"
                >
                  <span>Open Chat Studio</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button
                  onClick={() => onTabChange('documents')}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-[16px] bg-[#34343c] text-[#e4e1eb] hover:text-[#41eec2] border border-[#464555] transition-colors"
                >
                  <span className="material-symbols-outlined">folder_open</span>
                  <span>Manage Knowledge Bases</span>
                </button>
              </div>
            </div>

            {/* Dropzone Teaser Box (5 Cols) */}
            <div className="lg:col-span-5">
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'bg-[#1f1f26] border-[#41eec2] scale-105 shadow-2xl'
                    : 'bg-[#0e0e14]/80 border-[#34343c] hover:bg-[#0e0e14] hover:border-[#8781ff] shadow-xl'
                }`}
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.csv,.md,.txt"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      if (onUploadFile) onUploadFile(e.target.files[0]);
                      onTabChange('documents');
                    }
                  }}
                />
                <div className="w-16 h-16 rounded-2xl bg-[#c4c0ff]/10 text-[#c4c0ff] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-[36px]">cloud_upload</span>
                </div>
                <h4 className="text-[18px] text-[#e4e1eb] font-semibold mb-1">Drop your document here</h4>
                <p className="text-[13px] text-[#c7c4d8] max-w-xs mb-4">
                  Drag and drop PDF, DOCX, CSV or Markdown up to 100MB
                </p>
                <div className="px-4 py-2 rounded-lg bg-[#2a2931] text-[#c4c0ff] font-mono text-[11px] font-semibold flex items-center gap-1.5 shadow-sm border border-[#34343c]">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Browse Local Files
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#c7c4d8] font-mono text-[12px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2]"></span>
                  <span>pgvector index ready</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
