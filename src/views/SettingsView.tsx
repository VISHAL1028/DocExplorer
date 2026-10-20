import React, { useState } from 'react';
import { BackendConfig } from '../types';

interface SettingsViewProps {
  config: BackendConfig;
  onUpdateConfig: (newConfig: Partial<BackendConfig>) => void;
  onTestConnection: (url: string) => Promise<{ isConnected: boolean; latencyMs: number; message: string }>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onUpdateConfig,
  onTestConnection
}) => {
  const [apiUrl, setApiUrl] = useState(config.apiUrl);
  const [activeLlm, setActiveLlm] = useState(config.activeLlm);
  const [embeddingModel, setEmbeddingModel] = useState(config.embeddingModel);
  const [mode, setMode] = useState<BackendConfig['mode']>(config.mode);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ isConnected: boolean; latencyMs: number; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({ apiUrl, activeLlm, embeddingModel, mode });
    setTestResult({
      isConnected: config.isConnected,
      latencyMs: config.latencyMs,
      message: 'Settings updated successfully.'
    });
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestConnection(apiUrl);
      setTestResult(res);
      onUpdateConfig({ isConnected: res.isConnected, latencyMs: res.latencyMs });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] mt-20 p-4 md:p-8 max-w-5xl mx-auto space-y-8 bg-[#13131a] text-[#e4e1eb]">
      {/* Settings Header */}
      <div className="border-b border-[#2a2931] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f1f26] border border-[#2a2931] text-[#c4c0ff] font-mono text-[11px] mb-2">
          <span className="material-symbols-outlined text-[15px]">tune</span>
          Engine &amp; Gateway Configuration
        </div>
        <h1 className="text-[28px] font-bold text-[#e4e1eb]">Spring Boot &amp; Vector Store Settings</h1>
        <p className="text-[14px] text-[#c7c4d8] mt-1">
          Configure REST API endpoints, connection thresholds, and local pgvector parameters for your Spring Boot backend.
        </p>
      </div>

      {/* Backend Endpoint Config Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend Connectivity Card */}
        <div className="rounded-2xl bg-[#16161f] border border-[#2a2931] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#2a2931] pb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#e4e1eb] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#41eec2]">dns</span>
                Spring Boot REST Endpoint
              </h3>
              <p className="text-[12px] text-[#c7c4d8] mt-0.5">
                The base URL of your Spring Boot 4.1.1 or Spring AI service.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${config.isConnected ? 'bg-[#41eec2]' : 'bg-amber-400'}`}
              ></span>
              <span className="font-mono text-[11px] text-[#c7c4d8]">
                {config.isConnected ? 'Connected' : 'Fallback'} ({config.latencyMs}ms)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-mono text-[#c7c4d8] mb-1.5 uppercase">API Base URL</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8081/api/v1"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0e0e14] border border-[#2a2931] font-mono text-[13px] text-[#e4e1eb] focus:outline-none focus:border-[#8781ff]"
                />
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isTesting}
                  className="px-5 py-2.5 rounded-xl bg-[#2a2931] hover:bg-[#34343c] border border-[#34343c] text-[#c4c0ff] font-mono text-[12px] font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
                >
                  {isTesting ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">network_check</span>
                  )}
                  <span>Test Connection</span>
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl text-[12px] font-mono border flex items-center justify-between ${
                  testResult.isConnected
                    ? 'bg-[#41eec2]/10 border-[#41eec2]/40 text-[#41eec2]'
                    : 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                }`}
              >
                <span>{testResult.message}</span>
                <span className="font-bold">{testResult.latencyMs}ms</span>
              </div>
            )}

            <div>
              <label className="block text-[12px] font-mono text-[#c7c4d8] mb-1.5 uppercase">
                Execution Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('auto')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    mode === 'auto'
                      ? 'bg-[#2a2931] border-[#41eec2] text-[#e4e1eb]'
                      : 'bg-[#0e0e14] border-[#2a2931] text-[#c7c4d8]'
                  }`}
                >
                  <div className="font-semibold text-[13px]">Auto-Detect (Recommended)</div>
                  <div className="text-[11px] font-mono text-[#918fa1] mt-1">Calls Spring Boot if alive, else mocks</div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('live')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    mode === 'live'
                      ? 'bg-[#2a2931] border-[#41eec2] text-[#e4e1eb]'
                      : 'bg-[#0e0e14] border-[#2a2931] text-[#c7c4d8]'
                  }`}
                >
                  <div className="font-semibold text-[13px]">Live Spring Boot</div>
                  <div className="text-[11px] font-mono text-[#918fa1] mt-1">Strict network REST requests only</div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('mock')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    mode === 'mock'
                      ? 'bg-[#2a2931] border-[#41eec2] text-[#e4e1eb]'
                      : 'bg-[#0e0e14] border-[#2a2931] text-[#c7c4d8]'
                  }`}
                >
                  <div className="font-semibold text-[13px]">Client Simulation</div>
                  <div className="text-[11px] font-mono text-[#918fa1] mt-1">Self-contained browser vector engine</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vector & LLM Models */}
        <div className="rounded-2xl bg-[#16161f] border border-[#2a2931] p-6 space-y-4">
          <h3 className="text-[16px] font-bold text-[#e4e1eb] flex items-center gap-2 border-b border-[#2a2931] pb-3">
            <span className="material-symbols-outlined text-[#c4c0ff]">psychology</span>
            Embeddings &amp; Synthesis Pipeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-mono text-[#c7c4d8] mb-1.5 uppercase">Embedding Model</label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e14] border border-[#2a2931] text-[#e4e1eb] text-[13px] font-mono focus:outline-none focus:border-[#8781ff]"
              >
                <option value="nomic-embed-text (768-dim)">nomic-embed-text (Ollama / 768-dim)</option>
                <option value="bge-large-en (1024-dim)">bge-large-en (HuggingFace / 1024-dim)</option>
                <option value="text-embedding-3-small (1536-dim)">text-embedding-3-small (OpenAI / 1536-dim)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-mono text-[#c7c4d8] mb-1.5 uppercase">Synthesis LLM</label>
              <select
                value={activeLlm}
                onChange={(e) => setActiveLlm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e14] border border-[#2a2931] text-[#e4e1eb] text-[13px] font-mono focus:outline-none focus:border-[#8781ff]"
              >
                <option value="Gemma-2 9B-IT">Gemma-2 9B-IT (pgvector Grounded)</option>
                <option value="Llama-3.3 70B">Llama-3.3 70B (High Reasoning)</option>
                <option value="Mistral Nemo 12B">Mistral Nemo 12B (Fast Latency)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#8781ff] text-[#100069] font-bold text-[14px] hover:bg-[#c4c0ff] transition-all shadow-lg hover:shadow-[#8781ff]/25"
          >
            Save Configuration
          </button>
        </div>
      </form>

      {/* Spring Boot REST API Reference Guide for Developer */}
      <div className="rounded-2xl bg-[#0e0e14] border border-[#2a2931] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2a2931] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#41eec2]">code</span>
            <span className="font-semibold text-[#e4e1eb] text-[15px]">
              Spring Boot Controller Integration Specs
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#1f1f26] text-[#41eec2] font-mono text-[11px]">
            Java / Spring AI 2.0.1
          </span>
        </div>

        <p className="text-[13px] text-[#c7c4d8]">
          This frontend expects the following endpoints exposed on your Spring Boot application at{' '}
          <code className="text-[#41eec2] font-mono">{apiUrl}</code>:
        </p>

        <div className="space-y-3 font-mono text-[12px]">
          <div className="p-3 rounded-xl bg-[#16161f] border border-[#2a2931]">
            <div className="text-[#41eec2] font-bold mb-1">GET /api/v1/health</div>
            <div className="text-[#c7c4d8] text-[11px]">
              Returns <code className="text-[#e4e1eb]">&#123; "status": "UP", "pgvector": "CONNECTED" &#125;</code> for readiness.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#16161f] border border-[#2a2931]">
            <div className="text-[#c4c0ff] font-bold mb-1">POST /api/v1/chat/query</div>
            <div className="text-[#c7c4d8] text-[11px]">
              Payload: <code className="text-[#e4e1eb]">&#123; "query": string, "model": string, "topK": 3 &#125;</code><br />
              Returns: <code className="text-[#e4e1eb]">&#123; "answer": string, "citations": [...], "similarityScore": 0.98 &#125;</code>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#16161f] border border-[#2a2931]">
            <div className="text-[#41eec2] font-bold mb-1">POST /api/v1/documents/upload</div>
            <div className="text-[#c7c4d8] text-[11px]">
              Multipart file upload parsing via Apache Tika and saving embeddings to pgvector table.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
