import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { UploadingFile } from '../types';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (files: File[]) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <FileText className="w-5 h-5 text-[#ffb2b8]" />;
  if (ext === 'csv') return <FileSpreadsheet className="w-5 h-5 text-[#41eec2]" />;
  if (ext === 'docx') return <FileText className="w-5 h-5 text-[#8781ff]" />;
  return <File className="w-5 h-5 text-[#918fa1]" />;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [fileQueue, setFileQueue] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const added: UploadingFile[] = Array.from(newFiles).map((f) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      file: f,
      progress: 0,
      status: 'pending'
    }));
    setFileQueue((prev) => [...prev, ...added]);
  };

  const handleRemoveQueueItem = (id: string) => {
    setFileQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartUpload = async () => {
    if (fileQueue.length === 0 || isUploading) return;
    setIsUploading(true);

    const uploadedFiles: File[] = [];

    for (let i = 0; i < fileQueue.length; i++) {
      const item = fileQueue[i];
      setFileQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading' } : f))
      );

      // Animate progress
      for (let p = 20; p <= 100; p += 30) {
        setFileQueue((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, progress: p } : f))
        );
        await new Promise((r) => setTimeout(r, 80));
      }

      setFileQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'done', progress: 100 } : f))
      );
      uploadedFiles.push(item.file);
    }

    onUploadSuccess(uploadedFiles);
    setIsUploading(false);
    setTimeout(() => {
      setFileQueue([]);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#16161f] border border-[#2a2931] rounded-3xl shadow-2xl p-6 relative space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#2a2931] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#41eec2]/10 border border-[#41eec2]/30 text-[#41eec2] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#e4e1eb]">Ingest Documents</h3>
              <p className="text-[12px] text-[#c7c4d8]">
                Upload PDF, DOCX, CSV or Markdown to vectorize
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#2a2931] text-[#918fa1] hover:text-[#e4e1eb] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileChange(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'bg-[#1f1f26] border-[#41eec2] scale-102'
              : 'bg-[#0e0e14]/70 border-[#2a2931] hover:border-[#8781ff]/60 hover:bg-[#13131a]'
          }`}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.csv,.md,.txt"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-[#8781ff]/15 text-[#c4c0ff] flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-[14px] font-semibold text-[#e4e1eb] mb-1">
            Choose files or drag &amp; drop
          </p>
          <p className="text-[12px] text-[#918fa1]">
            PDF, DOCX, CSV, TXT or Markdown up to 100MB per file
          </p>
        </label>

        {/* File Queue List */}
        {fileQueue.length > 0 && (
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            <div className="text-[11px] font-mono uppercase text-[#918fa1]">
              Queued Files ({fileQueue.length})
            </div>
            {fileQueue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#1b1b22] border border-[#2a2931] flex items-center justify-between gap-3 text-[12px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getFileIcon(item.file.name)}
                  <div className="min-w-0">
                    <span className="font-medium text-[#e4e1eb] truncate block font-mono">
                      {item.file.name}
                    </span>
                    <span className="text-[11px] text-[#918fa1] font-mono">
                      {formatBytes(item.file.size)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'uploading' && (
                    <div className="flex items-center gap-1.5 text-[#8781ff] font-mono text-[11px]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{item.progress}%</span>
                    </div>
                  )}

                  {item.status === 'done' && (
                    <span className="flex items-center gap-1 text-[#41eec2] font-mono text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  )}

                  {item.status === 'pending' && !isUploading && (
                    <button
                      onClick={() => handleRemoveQueueItem(item.id)}
                      className="p-1 rounded-lg text-[#918fa1] hover:text-[#ffb2b8] hover:bg-[#ff506f]/20 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2a2931]">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl text-[13px] text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#1f1f26] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartUpload}
            disabled={fileQueue.length === 0 || isUploading}
            className="px-5 py-2.5 rounded-xl bg-[#41eec2] hover:bg-[#55fcd0] disabled:opacity-40 text-[#00382b] font-semibold text-[13px] transition-all flex items-center gap-2 shadow-lg active:scale-95"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Vectors...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Process &amp; Vectorize ({fileQueue.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
