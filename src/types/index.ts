export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'INDEXED' | 'FAILED';

export interface CitationDto {
  documentId: string;
  fileName: string;
  chunkIndex: number;
  pageNumber: number | null;
  snippet: string;
  similarityScore: number;
  metadata?: Record<string, unknown>;
}

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
  filename?: string;
  fileType: 'pdf' | 'docx' | 'csv' | 'markdown' | 'txt';
  contentType?: string;
  fileSize: string;
  fileSizeBytes?: number;
  pageCount: number;
  chunkCount: number;
  status: DocumentStatus;
  uploadedAt: string;
  createdAt?: string;
  sha256: string;
  chunks: Chunk[];
  summary?: string;
}

export interface DocumentMetadataDto {
  id: string;
  filename: string;
  contentType: string;
  fileSize: number;
  totalPages: number | null;
  totalChunks: number | null;
  status: DocumentStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentResponseDto {
  id: string;
  fileName: string;
  fileSize: number;
  status: DocumentStatus;
  chunksCreated: number | null;
  message: string;
}

export interface ChatRequestDto {
  question: string;
  documentId?: string;
  topK?: number;
  minSimilarity?: number;
  conversationId?: string;
}

export interface ChatResponseDto {
  answer: string;
  conversationId: string;
  citations: CitationDto[];
  responseTimeMs: number;
}

export interface SearchRequestDto {
  query: string;
  documentId?: string;
  topK?: number;
  similaritySearch?: number;
}

export interface SearchResultDto {
  query: string;
  totalMatches: number;
  matches: CitationDto[];
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export interface ConversationMessage {
  id: string;
  messageType: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
  citations?: CitationDto[];
  responseTimeMs?: number;
  isStreaming?: boolean;
}

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
  result?: DocumentResponseDto;
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

export type NavigationTab = 'landing' | 'chat-studio' | 'documents' | 'settings';
export type AppTab = 'chat' | 'search' | 'chunks' | 'overview' | 'settings';
