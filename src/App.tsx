/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab, DocumentItem, Chunk, ChatMessage, BackendConfig } from './types';
import { INITIAL_DOCUMENTS, INITIAL_CHAT_MESSAGES } from './data/mockData';
import { springBootService, defaultBackendConfig } from './services/springBootApi';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingView } from './views/LandingView';
import { ChatStudioView } from './views/ChatStudioView';
import { DocumentsView } from './views/DocumentsView';
import { SettingsView } from './views/SettingsView';
import { DocumentChunkDrawer } from './components/DocumentChunkDrawer';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('landing');
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [guestUuid] = useState('8f9b-4e12');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(defaultBackendConfig);
  const [isStreaming, setIsStreaming] = useState(false);

  // Chunk Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerDoc, setSelectedDrawerDoc] = useState<DocumentItem | null>(null);
  const [selectedDrawerChunk, setSelectedDrawerChunk] = useState<Chunk | null>(null);

  // Auth modal state
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);

  const handleOpenDocumentDrawer = (doc: DocumentItem, chunk?: Chunk) => {
    setSelectedDrawerDoc(doc);
    setSelectedDrawerChunk(chunk || doc.chunks[0] || null);
    setIsDrawerOpen(true);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'human',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // Placeholder message for streaming tokens
    const assistantId = `ast-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: backendConfig.activeLlm,
      streaming: true
    };
    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      const response = await springBootService.queryRag(
        text,
        documents,
        (partialText) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: partialText } : m))
          );
        }
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...response, id: assistantId, streaming: false } : m))
      );
    } catch (err) {
      console.error('Query synthesis error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: 'Error connecting to synthesis pipeline. Check Spring Boot endpoint configuration in Settings.',
                streaming: false
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleUploadFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileType =
      ext === 'pdf' ? 'pdf' : ext === 'csv' ? 'csv' : ext === 'md' ? 'markdown' : 'docx';

    const newDocId = `doc-${Date.now()}`;
    const newDoc: DocumentItem = {
      id: newDocId,
      title: file.name,
      fileType: fileType as any,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      pageCount: Math.max(1, Math.floor(file.size / 45000)),
      chunkCount: Math.max(4, Math.floor(file.size / 15000)),
      status: 'UPLOADING',
      uploadedAt: 'Just now',
      sha256: `a${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      summary: `Parsed text extracted from ${file.name}. Embeddings stored in pgvector.`,
      chunks: [
        {
          id: `chunk-${Math.floor(Math.random() * 9000 + 1000)}`,
          chunkIndex: 1,
          pageNumber: 1,
          similarity: 0.965,
          tokenCount: 380,
          vectorDim: 768,
          vectorPreview: [0.038, -0.114, 0.092, 0.245, -0.021, 0.312, -0.088, 0.064],
          content: `Ingested content from ${file.name}. Sections parsed via Apache Tika and mapped into 768-dimensional dense vector embeddings with HNSW indexing.`
        }
      ]
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Simulate pipeline phases: UPLOADING -> PROCESSING -> INDEXED
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === newDocId ? { ...d, status: 'PROCESSING' } : d))
      );
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) => (d.id === newDocId ? { ...d, status: 'INDEXED' } : d))
        );
      }, 1500);
    }, 1200);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleReindexDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'PROCESSING' } : d))
    );
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: 'INDEXED' } : d))
      );
    }, 1200);
  };

  const handleTestConnection = async (url: string) => {
    const res = await springBootService.testConnection(url);
    setBackendConfig((prev) => ({
      ...prev,
      apiUrl: url,
      isConnected: res.isConnected,
      latencyMs: res.latencyMs
    }));
    return res;
  };

  return (
    <div className="min-h-screen bg-[#13131a] text-[#e4e1eb] flex flex-col font-sans selection:bg-[#8781ff]/30 selection:text-[#c4c0ff]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        guestUuid={guestUuid}
        backendConfig={backendConfig}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        userEmail={userEmail}
      />

      {/* Main Screen Body */}
      <main className="flex-1 w-full">
        {currentTab === 'landing' && (
          <LandingView
            onTabChange={setCurrentTab}
            onOpenDocumentDrawer={handleOpenDocumentDrawer}
            documents={documents}
            onUploadFile={handleUploadFile}
          />
        )}

        {currentTab === 'chat-studio' && (
          <ChatStudioView
            messages={messages}
            onSendMessage={handleSendMessage}
            documents={documents}
            onOpenDocumentDrawer={handleOpenDocumentDrawer}
            backendConfig={backendConfig}
            isStreaming={isStreaming}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentsView
            documents={documents}
            onUploadFile={handleUploadFile}
            onOpenDocumentDrawer={handleOpenDocumentDrawer}
            onDeleteDocument={handleDeleteDocument}
            onReindexDocument={handleReindexDocument}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            config={backendConfig}
            onUpdateConfig={(cfg) => {
              const updated = { ...backendConfig, ...cfg };
              setBackendConfig(updated);
              springBootService.updateConfig(updated);
            }}
            onTestConnection={handleTestConnection}
          />
        )}
      </main>

      {/* Footer (shown on Landing, Documents, and Settings) */}
      {currentTab !== 'chat-studio' && (
        <Footer onTabChange={setCurrentTab} latencyMs={backendConfig.latencyMs} />
      )}

      {/* Synchronized Document & Chunk Inspector Drawer */}
      <DocumentChunkDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        document={selectedDrawerDoc}
        selectedChunk={selectedDrawerChunk}
        onSelectChunk={setSelectedDrawerChunk}
      />

      {/* Auth & Sandbox Claiming Modal */}
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
