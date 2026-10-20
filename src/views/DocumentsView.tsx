import React, { useState } from 'react';
import { DocumentItem, Chunk } from '../types';

interface DocumentsViewProps {
  documents: DocumentItem[];
  onUploadFile: (file: File) => void;
  onOpenDocumentDrawer: (doc: DocumentItem, chunk?: Chunk) => void;
  onDeleteDocument: (docId: string) => void;
  onReindexDocument: (docId: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onUploadFile,
  onOpenDocumentDrawer,
  onDeleteDocument,
  onReindexDocument
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.fileType === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalChunks = documents.reduce((acc, d) => acc + d.chunkCount, 0);
  const totalPages = documents.reduce((acc, d) => acc + d.pageCount, 0);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] mt-20 p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#13131a] text-[#e4e1eb]">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2931] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f1f26] border border-[#2a2931] text-[#41eec2] font-mono text-[11px] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#41eec2] animate-pulse"></span>
            PostgreSQL pgvector Catalog
          </div>
          <h1 className="text-[28px] font-bold text-[#e4e1eb]">Knowledge Base &amp; Embeddings</h1>
          <p className="text-[14px] text-[#c7c4d8] mt-1">
            Manage your parsed documents, inspect 768-dim embeddings, and audit semantic chunk coverage.
          </p>
        </div>

        {/* Global Corpus Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-[#1b1b22] border border-[#2a2931] font-mono text-right">
            <span className="text-[11px] text-[#c7c4d8] block">Documents</span>
            <span className="text-[18px] font-bold text-[#e4e1eb]">{documents.length}</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-[#1b1b22] border border-[#2a2931] font-mono text-right">
            <span className="text-[11px] text-[#c7c4d8] block">Total Chunks</span>
            <span className="text-[18px] font-bold text-[#41eec2]">{totalChunks}</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-[#1b1b22] border border-[#2a2931] font-mono text-right">
            <span className="text-[11px] text-[#c7c4d8] block">Ingested Pages</span>
            <span className="text-[18px] font-bold text-[#c4c0ff]">{totalPages}</span>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Section */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging
            ? 'bg-[#1f1f26] border-[#41eec2] scale-101'
            : 'bg-[#16161f] border-[#2a2931] hover:border-[#8781ff]/60 hover:bg-[#1b1b22]'
        }`}
      >
        <label className="w-full flex flex-col items-center cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.csv,.md,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onUploadFile(e.target.files[0]);
              }
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-[#8781ff]/15 text-[#c4c0ff] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[36px]">cloud_upload</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[#e4e1eb] mb-1">
            Upload new corporate document
          </h3>
          <p className="text-[13px] text-[#c7c4d8] max-w-md mb-4">
            Drag and drop PDF, DOCX, CSV, or Markdown up to 100MB. Automatic Tika parsing and Ollama{' '}
            <code className="text-[#41eec2] font-mono">nomic-embed-text</code> chunking will start immediately.
          </p>
          <div className="px-5 py-2.5 rounded-xl bg-[#8781ff] text-[#100069] font-medium text-[13px] shadow-lg hover:bg-[#c4c0ff] transition-all">
            Select Local Files
          </div>
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#918fa1] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or SHA..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#16161f] border border-[#2a2931] text-[#e4e1eb] placeholder-[#918fa1] text-[13px] focus:outline-none focus:border-[#8781ff]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <span className="text-[12px] font-mono text-[#c7c4d8] shrink-0">Filter:</span>
          {['all', 'pdf', 'docx', 'csv', 'markdown'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setTypeFilter(fmt)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-mono uppercase transition-all ${
                typeFilter === fmt
                  ? 'bg-[#2a2931] text-[#41eec2] border border-[#41eec2]'
                  : 'bg-[#1b1b22] text-[#c7c4d8] border border-[#2a2931] hover:text-[#e4e1eb]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Document Inventory Table */}
      <div className="rounded-2xl bg-[#16161f] border border-[#2a2931] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#2a2931] bg-[#1b1b22] text-[#c7c4d8] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Size &amp; Pages</th>
                <th className="py-3.5 px-4">Chunks</th>
                <th className="py-3.5 px-4">pgvector Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2931]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#1f1f26]/60 transition-colors">
                  <td className="py-4 px-4 font-medium text-[#e4e1eb]">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-[#ffb2b8]">
                        {doc.fileType === 'pdf' ? 'picture_as_pdf' : 'description'}
                      </span>
                      <div className="truncate max-w-xs md:max-w-md">
                        <span className="block truncate font-mono">{doc.title}</span>
                        <span className="text-[11px] text-[#918fa1] font-mono block">SHA: {doc.sha256}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#2a2931] text-[#c4c0ff] font-mono text-[11px] uppercase">
                      {doc.fileType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#c7c4d8] font-mono text-[12px]">
                    {doc.fileSize} • {doc.pageCount} pgs
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-[#41eec2]">
                    {doc.chunkCount} chunks
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono ${
                        doc.status === 'INDEXED'
                          ? 'bg-[#41eec2]/10 text-[#41eec2] border border-[#41eec2]/30'
                          : doc.status === 'PROCESSING'
                          ? 'bg-[#8781ff]/10 text-[#c4c0ff] border border-[#8781ff]/30 animate-pulse'
                          : 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          doc.status === 'INDEXED' ? 'bg-[#41eec2]' : 'bg-amber-400 animate-ping'
                        }`}
                      ></span>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenDocumentDrawer(doc)}
                        className="px-3 py-1.5 rounded-lg bg-[#2a2931] hover:bg-[#34343c] text-[#c4c0ff] font-mono text-[11px] transition-colors border border-[#34343c]"
                      >
                        Inspect Chunks
                      </button>
                      <button
                        onClick={() => onReindexDocument(doc.id)}
                        title="Re-embed document in pgvector"
                        className="p-1.5 rounded-lg bg-[#2a2931] hover:bg-[#34343c] text-[#c7c4d8] hover:text-[#41eec2] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">sync</span>
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        title="Remove from knowledge base"
                        className="p-1.5 rounded-lg bg-[#2a2931] hover:bg-[#ff506f]/20 text-[#c7c4d8] hover:text-[#ffb2b8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
