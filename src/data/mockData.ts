import { DocumentItem, ChatMessage } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-risk-2025',
    title: 'Q3_FY2025_Risk_Assessment.pdf',
    fileType: 'pdf',
    fileSize: '4.2 MB',
    pageCount: 48,
    chunkCount: 142,
    status: 'INDEXED',
    uploadedAt: '12 mins ago',
    sha256: 'd84fe98c412e84...c10b77a',
    summary: 'Comprehensive enterprise assessment of failover targets, data residency compliance, and vector database resilience.',
    chunks: [
      {
        id: 'chunk-8821',
        chunkIndex: 21,
        pageNumber: 14,
        similarity: 0.984,
        tokenCount: 412,
        vectorDim: 768,
        vectorPreview: [0.0421, -0.1284, 0.0892, 0.2155, -0.0142, 0.3811, -0.0914, 0.0512],
        content: 'The disaster recovery strategy guarantees a Recovery Time Objective (RTO) under 3 minutes and a Recovery Point Objective (RPO) of zero for all pgvector semantic knowledge stores. Primary data center failovers are executed across dual-availability regions within 45 seconds of signal degradation. Automated health checks poll heartbeat services every 500 milliseconds.'
      },
      {
        id: 'chunk-8822',
        chunkIndex: 22,
        pageNumber: 14,
        similarity: 0.941,
        tokenCount: 388,
        vectorDim: 768,
        vectorPreview: [-0.012, 0.091, 0.154, -0.038, 0.281, -0.114, 0.075, 0.023],
        content: 'Compliance mandates ISO/IEC 27001 zero-trust access control protocols throughout pipeline staging tiers and asynchronous webhook handlers. Replication queues employ durable transactional outboxes with WAL-level synchronization.'
      },
      {
        id: 'chunk-8823',
        chunkIndex: 23,
        pageNumber: 15,
        similarity: 0.876,
        tokenCount: 345,
        vectorDim: 768,
        vectorPreview: [0.081, -0.042, 0.211, 0.103, -0.054, 0.198, -0.088, 0.141],
        content: 'In the event of network partition degradation, read replicas serve stale reads with bounded staleness guarantees capped at 2.5 seconds while write arbitration completes.'
      }
    ]
  },
  {
    id: 'doc-infra-sla',
    title: 'Infra_SLA_Doc.docx',
    fileType: 'docx',
    fileSize: '1.8 MB',
    pageCount: 22,
    chunkCount: 68,
    status: 'INDEXED',
    uploadedAt: '1 hour ago',
    sha256: '9f23ac44d1872b...44a9e21',
    summary: 'Service Level Agreement specifications for internal vector embedding pipelines and inference endpoints.',
    chunks: [
      {
        id: 'chunk-3012',
        chunkIndex: 12,
        pageNumber: 4,
        similarity: 0.892,
        tokenCount: 295,
        vectorDim: 768,
        vectorPreview: [0.015, -0.082, 0.144, 0.192, -0.031, 0.299, -0.065, 0.078],
        content: 'Vector Search Latency commitments specify p99 response times beneath 18 milliseconds on collections up to 10 million vectors using HNSW cosine index configuration in PostgreSQL.'
      }
    ]
  },
  {
    id: 'doc-soc2-audit',
    title: 'SOC2_Audit_Report.pdf',
    fileType: 'pdf',
    fileSize: '8.4 MB',
    pageCount: 96,
    chunkCount: 284,
    status: 'INDEXED',
    uploadedAt: 'Yesterday',
    sha256: 'e14ab7710c98f2...004812a',
    summary: 'Third-party Type II SOC 2 compliance verification across data ingestion, storage encryption, and RAG prompt isolation.',
    chunks: [
      {
        id: 'chunk-5510',
        chunkIndex: 42,
        pageNumber: 32,
        similarity: 0.942,
        tokenCount: 430,
        vectorDim: 768,
        vectorPreview: [-0.024, 0.112, 0.089, -0.041, 0.321, -0.098, 0.061, 0.039],
        content: 'All user queries and synthesized LLM answers are bound to tenant isolation schemas. Ephemeral guest session data is cryptographically quarantined until authenticated claiming occurs.'
      }
    ]
  },
  {
    id: 'doc-dpa-agree',
    title: 'Data_Processing_Addendum.docx',
    fileType: 'docx',
    fileSize: '1.1 MB',
    pageCount: 18,
    chunkCount: 45,
    status: 'INDEXED',
    uploadedAt: '2 days ago',
    sha256: 'a381cd09094f31...98cc341',
    summary: 'Standard contractual clauses and data processing boundaries governing enterprise document vectorization.',
    chunks: [
      {
        id: 'chunk-1104',
        chunkIndex: 4,
        pageNumber: 8,
        similarity: 0.875,
        tokenCount: 310,
        vectorDim: 768,
        vectorPreview: [0.031, -0.065, 0.178, 0.142, -0.019, 0.245, -0.072, 0.091],
        content: 'Customer uploaded documents are processed without persistent external LLM model fine-tuning. Only transient contextual prompt injection is authorized.'
      }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'human',
    text: 'What are our disaster recovery commitments and failover targets for the vector database?',
    timestamp: '10:42 AM'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: 'Based on your verified internal document, the architecture implements dual-availability failovers triggered within 45 seconds of anomaly detection.\n\nSpecifically, the disaster recovery commitment establishes a Recovery Time Objective (RTO < 3 mins) and maintains a Recovery Point Objective of zero (RPO = 0) specifically guarded for all pgvector stores.\n\nFurthermore, automated health checks poll heartbeat services every 500 milliseconds, and replication pipelines enforce ISO/IEC 27001 zero-trust controls across all staging tiers.',
    timestamp: '10:42 AM',
    model: 'Gemma-2 9B-IT (pgvector grounded)',
    similarityScore: 0.984,
    citations: [
      {
        documentTitle: 'Q3_FY2025_Risk_Assessment.pdf',
        pageNumber: 14,
        chunkId: 'chunk-8821',
        matchPercentage: 98.4,
        exactQuote: 'The disaster recovery strategy guarantees a Recovery Time Objective (RTO) under 3 minutes and a Recovery Point Objective (RPO) of zero for all pgvector semantic knowledge stores.'
      },
      {
        documentTitle: 'Infra_SLA_Doc.docx',
        pageNumber: 4,
        chunkId: 'chunk-3012',
        matchPercentage: 89.2,
        exactQuote: 'Vector Search Latency commitments specify p99 response times beneath 18 milliseconds on collections up to 10 million vectors.'
      }
    ]
  }
];
