import React, { useState } from 'react';
import {
  FileText,
  MessageSquare,
  Search,
  Upload,
  Trash2,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  File,
  FileSpreadsheet
} from 'lucide-react';
import { DocumentItem, Conversation, DocumentStatus } from '../types';
import { ChatsPanel } from './ChatsPanel';

interface SidebarProps {
  isOpen: boolean;
  documents: DocumentItem[];
  selectedDocumentId: string | null;
  onSelectDocument: (id: string | null) => void;
  onDeleteDocument: (id: string) => void;
  onUploadClick: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onClose?: () => void;
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  INDEXED: {
    icon: <CheckCircle className="w-3 h-3 text-[#41eec2]" />,
    color: 'text-[#41eec2] bg-[#41eec2]/10 border-[#41eec2]/20',
    label: 'Indexed'
  },
  PROCESSING: {
    icon: <Loader2 className="w-3 h-3 text-[#c4c0ff] animate-spin" />,
    color: 'text-[#c4c0ff] bg-[#8781ff]/10 border-[#8781ff]/20',
    label: 'Processing'
  },
  UPLOADING: {
    icon: <Clock className="w-3 h-3 text-amber-400" />,
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    label: 'Uploading'
  },
  FAILED: {
    icon: <AlertCircle className="w-3 h-3 text-red-400" />,
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
    label: 'Failed'
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  documents,
  selectedDocumentId,
  onSelectDocument,
  onDeleteDocument,
  onUploadClick,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClose
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'documents' | 'chats'>('documents');
  const [searchDocQuery, setSearchDocQuery] = useState('');

  if (!isOpen) return null;

  const handleDocumentSelect = (id: string | null) => {
    onSelectDocument(id);
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  const handleConversationSelect = (id: string) => {
    onSelectConversation(id);
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchDocQuery.toLowerCase())
  );

  const getDocIcon = (type: string) => {
    if (type === 'pdf') return <FileText className="w-4 h-4 text-[#ffb2b8]" />;
    if (type === 'csv') return <FileSpreadsheet className="w-4 h-4 text-[#41eec2]" />;
    if (type === 'docx') return <FileText className="w-4 h-4 text-[#8781ff]" />;
    return <File className="w-4 h-4 text-[#918fa1]" />;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="md:hidden fixed inset-0 top-16 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed md:relative inset-y-16 md:inset-y-auto left-0 md:left-auto w-72 lg:w-80 h-[calc(100vh-64px)] md:h-full bg-[#0e0e14] border-r border-[#2a2931] flex flex-col shrink-0 z-50 md:z-30 transition-all select-none shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
        {/* Top Segment Switcher: Documents / Chats */}
        <div className="p-3 border-b border-[#2a2931] bg-[#13131a] flex items-center justify-between gap-2">
          <div className="grid grid-cols-2 p-1 bg-[#1b1b22] border border-[#2a2931] rounded-xl flex-1">
            <button
              onClick={() => setActiveSidebarTab('documents')}
              className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                activeSidebarTab === 'documents'
                  ? 'bg-[#2a2931] text-[#41eec2] shadow-sm'
                  : 'text-[#c7c4d8] hover:text-[#e4e1eb]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents ({documents.length})</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('chats')}
              className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                activeSidebarTab === 'chats'
                  ? 'bg-[#2a2931] text-[#8781ff] shadow-sm'
                  : 'text-[#c7c4d8] hover:text-[#e4e1eb]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chats ({conversations.length})</span>
            </button>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[#c7c4d8] hover:text-[#e4e1eb] hover:bg-[#2a2931] transition-colors"
              title="Close drawer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSidebarTab === 'chats' ? (
            <ChatsPanel
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleConversationSelect}
              onNewConversation={() => {
                onNewConversation();
                if (window.innerWidth < 768 && onClose) onClose();
              }}
              onDeleteConversation={onDeleteConversation}
            />
        ) : (
          <div className="flex flex-col h-full">
            {/* Search Documents Input */}
            <div className="p-3 border-b border-[#2a2931]/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#918fa1]" />
                <input
                  type="text"
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  placeholder="Filter ingested documents..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#16161f] border border-[#2a2931] text-[12px] text-[#e4e1eb] placeholder-[#918fa1] focus:outline-none focus:border-[#8781ff]"
                />
              </div>
            </div>

            {/* Ingested Documents List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-8 px-4 text-[#918fa1] text-[13px]">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No documents found.</p>
                  <button
                    onClick={onUploadClick}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2931] hover:bg-[#34343c] text-[#41eec2] font-mono text-[11px]"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Document</span>
                  </button>
                </div>
              ) : (
                filteredDocs.map((doc) => {
                  const isSelected = selectedDocumentId === doc.id;
                  const statusInfo = STATUS_CONFIG[doc.status] || STATUS_CONFIG.INDEXED;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleDocumentSelect(isSelected ? null : doc.id)}
                      className={`group p-3 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#1b1b22] border-[#41eec2] shadow-[0_0_12px_rgba(65,238,194,0.15)] ring-1 ring-[#41eec2]/50'
                          : 'bg-[#16161f] border-[#2a2931] hover:border-[#34343c] hover:bg-[#1b1b22]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          {getDocIcon(doc.fileType)}
                          <span
                            className={`text-[13px] font-medium truncate ${
                              isSelected ? 'text-[#41eec2]' : 'text-[#e4e1eb]'
                            }`}
                            title={doc.title}
                          >
                            {doc.title}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(doc.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#918fa1] hover:text-[#ffb2b8] hover:bg-[#ff506f]/20 transition-all"
                          title="Delete from knowledge base"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#c7c4d8] pt-1">
                        <span>{doc.fileSize} • {doc.chunkCount} chunks</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Upload CTA Bar */}
            <div className="p-3 border-t border-[#2a2931] bg-[#16161f]">
              <button
                onClick={onUploadClick}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#2a2931] hover:bg-[#34343c] border border-[#34343c] text-[#e4e1eb] hover:text-[#41eec2] text-[12px] font-medium transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-[#41eec2]" />
                <span>Upload New Corpus</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  </>
  );
};
