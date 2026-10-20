export interface Chunk {
  id: string;
  chunkIndex: number;
  pageNumber: number;
  content: string;
  similarity: number;
  tokenCount: number;
  vectorDim?: number;
  vectorPreview?: number[];
}

export interface DocumentItem {
  id: string;
  title: string;
  fileType: 'pdf' | 'docx' | 'csv' | 'markdown';
  fileSize: string;
  pageCount: number;
  chunkCount: number;
  status: 'INDEXED' | 'PROCESSING' | 'UPLOADING';
  uploadedAt: string;
  sha256: string;
  chunks: Chunk[];
  summary?: string;
}

export interface Citation {
  documentTitle: string;
  pageNumber: number;
  chunkId: string;
  matchPercentage: number;
  exactQuote?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'human' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Citation[];
  similarityScore?: number;
  model?: string;
  streaming?: boolean;
}

export interface BackendConfig {
  apiUrl: string;
  mode: 'auto' | 'live' | 'mock';
  isConnected: boolean;
  latencyMs: number;
  lastChecked?: string;
  embeddingModel: string;
  activeLlm: string;
}

export type NavigationTab = 'landing' | 'chat-studio' | 'documents' | 'settings';
