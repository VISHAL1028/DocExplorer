/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppTab,
  DocumentItem,
  Chunk,
  Conversation,
  ConversationMessage,
  BackendConfig
} from './types';
import {
  loadInitialDocuments,
  saveDocumentsToStorage,
  conversationApi,
  testBackendHealth,
  setApiBaseUrl,
  chatApi
} from './services/api';
import { defaultBackendConfig } from './services/springBootApi';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { SearchView } from './components/SearchView';
import { ChunksView } from './components/ChunksView';
import { UploadDialog } from './components/UploadDialog';
import { LandingView } from './views/LandingView';
import { SettingsView } from './views/SettingsView';
import { DocumentChunkDrawer } from './components/DocumentChunkDrawer';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [documents, setDocuments] = useState<DocumentItem[]>(loadInitialDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const list = conversationApi.list('guest');
    if (list.length > 0) return list;
    return [
      {
        id: 'conv-default',
        title: 'Cloud Infrastructure & RTO SLAs',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 2
      }
    ];
  });
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-default');
  const [messages, setMessages] = useState<ConversationMessage[]>(() => {
    const stored = conversationApi.getMessages('guest', 'conv-default');
    if (stored.length > 0) return stored;
    return [
      {
        id: 'msg-init-1',
        messageType: 'USER',
        content: 'What are our disaster recovery commitments and failover targets for the vector database?',
        createdAt: new Date().toISOString()
      },
      {
        id: 'msg-init-2',
        messageType: 'ASSISTANT',
        content: `Based on your verified internal document, the architecture implements dual-availability failovers triggered within **45 seconds** of anomaly detection.\n\nSpecifically, the disaster recovery commitment establishes a Recovery Time Objective (**RTO < 3 mins**) and maintains a Recovery Point Objective of zero (**RPO = 0**) specifically guarded for all pgvector stores.\n\nFurthermore, automated health checks poll heartbeat services every 500 milliseconds, and replication pipelines enforce ISO/IEC 27001 zero-trust controls across all staging tiers.`,
        createdAt: new Date().toISOString(),
        responseTimeMs: 242,
        citations: [
          {
            documentId: 'doc-risk-2025',
            fileName: 'Q3_FY2025_Risk_Assessment.pdf',
            chunkIndex: 21,
            pageNumber: 14,
            similarityScore: 0.984,
            snippet: 'The disaster recovery strategy guarantees a Recovery Time Objective (RTO) under 3 minutes and a Recovery Point Objective (RPO) of zero for all pgvector semantic knowledge stores.'
          },
          {
            documentId: 'doc-infra-sla',
            fileName: 'Infra_SLA_Doc.docx',
            chunkIndex: 12,
            pageNumber: 4,
            similarityScore: 0.892,
            snippet: 'Vector Search Latency commitments specify p99 response times beneath 18 milliseconds on collections up to 10 million vectors using HNSW cosine index configuration in PostgreSQL.'
          }
        ]
      }
    ];
  });

  // User and Backend config
  const [guestUuid] = useState('8f9b-4e12');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(defaultBackendConfig);
  const [isStreaming, setIsStreaming] = useState(false);

  // Dialog and Drawer state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerDoc, setDrawerDoc] = useState<DocumentItem | null>(null);
  const [drawerChunk, setDrawerChunk] = useState<Chunk | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);

  // Save documents whenever updated
  useEffect(() => {
    saveDocumentsToStorage(documents);
  }, [documents]);

  // When active conversation changes, load its messages
  useEffect(() => {
    if (activeConversationId) {
      const stored = conversationApi.getMessages(userEmail || 'guest', activeConversationId);
      if (stored.length > 0) {
        setMessages(stored);
      }
    }
  }, [activeConversationId, userEmail]);

  // Save messages to active conversation
  const updateMessages = (newMessages: ConversationMessage[]) => {
    setMessages(newMessages);
    if (activeConversationId) {
      conversationApi.saveMessages(userEmail || 'guest', activeConversationId, newMessages);
      // Update conversation timestamp
      const conv = conversations.find((c) => c.id === activeConversationId);
      if (conv) {
        const updatedConv: Conversation = {
          ...conv,
          updatedAt: new Date().toISOString(),
          messageCount: newMessages.length
        };
        conversationApi.saveConversation(userEmail || 'guest', updatedConv);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversationId ? updatedConv : c))
        );
      }
    }
  };

  const handleSendMessage = async (
    text: string,
    topK: number = 3,
    minSimilarity: number = 0.65
  ) => {
    const userMsg: ConversationMessage = {
      id: `usr-${Date.now()}`,
      messageType: 'USER',
      content: text,
      createdAt: new Date().toISOString()
    };

    const nextMessages = [...messages, userMsg];
    updateMessages(nextMessages);
    setIsStreaming(true);

    try {
      // Query RAG via API layer (Spring Boot or smart vector simulation)
      const res = await chatApi.query(
        {
          question: text,
          documentId: selectedDocumentId || undefined,
          topK,
          minSimilarity,
          conversationId: activeConversationId
        },
        documents
      );

      const assistantMsg: ConversationMessage = {
        id: `ast-${Date.now()}`,
        messageType: 'ASSISTANT',
        content: res.answer,
        createdAt: new Date().toISOString(),
        citations: res.citations,
        responseTimeMs: res.responseTimeMs
      };

      updateMessages([...nextMessages, assistantMsg]);

      // If active conversation title is generic, update it with first prompt
      if (messages.length === 0 || activeConversationId === 'conv-default') {
        const titleSnippet = text.length > 32 ? text.slice(0, 32) + '...' : text;
        const currentConv = conversations.find((c) => c.id === activeConversationId);
        if (currentConv) {
          const renamed: Conversation = { ...currentConv, title: titleSnippet };
          conversationApi.saveConversation(userEmail || 'guest', renamed);
          setConversations((prev) =>
            prev.map((c) => (c.id === activeConversationId ? renamed : c))
          );
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ConversationMessage = {
        id: `err-${Date.now()}`,
        messageType: 'ASSISTANT',
        content: 'Failed to generate response. Please check your backend connection in Settings.',
        createdAt: new Date().toISOString()
      };
      updateMessages([...nextMessages, errorMsg]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0
    };
    conversationApi.saveConversation(userEmail || 'guest', newConv);
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
    setActiveTab('chat');
  };

  const handleDeleteConversation = (id: string) => {
    conversationApi.remove(userEmail || 'guest', id);
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeConversationId === id) {
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  const handleUploadFiles = (files: File[]) => {
    const newItems: DocumentItem[] = files.map((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileType =
        ext === 'pdf' ? 'pdf' : ext === 'csv' ? 'csv' : ext === 'md' ? 'markdown' : 'docx';

      return {
        id: `doc-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        title: file.name,
        fileType: fileType as any,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pageCount: Math.max(1, Math.floor(file.size / 40000)),
        chunkCount: Math.max(3, Math.floor(file.size / 20000)),
        status: 'INDEXED',
        uploadedAt: 'Just now',
        sha256: `e${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        summary: `Parsed and vectorized document: ${file.name}`,
        chunks: [
          {
            id: `chunk-${Math.floor(Math.random() * 9000 + 1000)}`,
            chunkIndex: 1,
            pageNumber: 1,
            similarity: 0.952,
            tokenCount: 390,
            vectorDim: 768,
            vectorPreview: [0.041, -0.118, 0.088, 0.231, -0.018, 0.305, -0.092, 0.058],
            content: `Ingested content from ${file.name}. Processed via Apache Tika and mapped into 768-dimensional dense vector embeddings in PostgreSQL pgvector.`
          }
        ]
      };
    });

    setDocuments((prev) => [...newItems, ...prev]);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    if (selectedDocumentId === docId) {
      setSelectedDocumentId(null);
    }
  };

  const handleOpenDocumentDrawer = (doc: DocumentItem, chunk?: Chunk) => {
    setDrawerDoc(doc);
    setDrawerChunk(chunk || doc.chunks[0] || null);
    setIsDrawerOpen(true);
  };

  const handleTestConnection = async (url: string) => {
    setApiBaseUrl(url);
    const res = await testBackendHealth(url);
    setBackendConfig((prev) => ({
      ...prev,
      apiUrl: url,
      isConnected: res.isConnected,
      latencyMs: res.latencyMs
    }));
    return res;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f172a] text-[#e4e1eb] font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        documents={documents}
        selectedDocumentId={selectedDocumentId}
        setSelectedDocumentId={setSelectedDocumentId}
        onUploadClick={() => setIsUploadOpen(true)}
        backendConfig={backendConfig}
        userEmail={userEmail}
        guestUuid={guestUuid}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Collapsible Sidebar (Documents & Chats) */}
        <Sidebar
          isOpen={isSidebarOpen}
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onSelectDocument={setSelectedDocumentId}
          onDeleteDocument={handleDeleteDocument}
          onUploadClick={() => setIsUploadOpen(true)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            setActiveTab('chat');
          }}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Viewport Router */}
        <main className="flex-1 overflow-hidden bg-[#13131a] relative">
          {activeTab === 'chat' && (
            <ChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              onClearSelectedDocument={() => setSelectedDocumentId(null)}
              isStreaming={isStreaming}
              onStopStreaming={() => setIsStreaming(false)}
              onOpenDocumentDrawer={handleOpenDocumentDrawer}
            />
          )}

          {activeTab === 'search' && (
            <SearchView
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              onOpenDocumentDrawer={handleOpenDocumentDrawer}
            />
          )}

          {activeTab === 'chunks' && (
            <ChunksView
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={setSelectedDocumentId}
            />
          )}

          {activeTab === 'overview' && (
            <div className="h-full overflow-y-auto">
              <LandingView
                onTabChange={(tab) => {
                  if (tab === 'chat-studio') setActiveTab('chat');
                  else if (tab === 'documents') setActiveTab('chunks');
                  else if (tab === 'settings') setActiveTab('settings');
                }}
                onOpenDocumentDrawer={handleOpenDocumentDrawer}
                documents={documents}
                onUploadFile={(file) => handleUploadFiles([file])}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="h-full overflow-y-auto">
              <SettingsView
                config={backendConfig}
                onUpdateConfig={(cfg) => {
                  const updated = { ...backendConfig, ...cfg };
                  setBackendConfig(updated);
                  if (cfg.apiUrl) setApiBaseUrl(cfg.apiUrl);
                }}
                onTestConnection={handleTestConnection}
              />
            </div>
          )}
        </main>
      </div>

      {/* Multi-file Upload Dialog */}
      <UploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadFiles}
      />

      {/* Grounded Document & Vector Chunk Drawer */}
      <DocumentChunkDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        document={drawerDoc}
        selectedChunk={drawerChunk}
        onSelectChunk={setDrawerChunk}
      />

      {/* Auth & Sandbox Claiming Dialog */}
      <AuthModal
        isOpen={authModalMode !== null}
        mode={authModalMode || 'login'}
        onClose={() => setAuthModalMode(null)}
        guestUuid={guestUuid}
        onSuccess={(email) => {
          setUserEmail(email);
        }}
      />
    </div>
  );
}
