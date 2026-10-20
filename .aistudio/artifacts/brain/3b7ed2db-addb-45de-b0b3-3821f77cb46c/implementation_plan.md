# DocMind Enterprise RAG Engine — UI & UX Frontend

Comprehensive, high-fidelity UI/UX frontend implementation for DocMind RAG Engine v2.0 matching the design specifications from the provided screens, styled with the "Luminous Intelligence" dark cyber-glassmorphism theme and architected to work both with realistic interactive client simulation and plug-and-play REST endpoints for the user's custom Spring Boot backend.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed they have their own Spring Boot backend and specifically requested the UI and UX. This plan focuses on delivering the complete visual system, responsive multi-screen views, interactive workbench demonstrations, and configurable backend connectivity without coupling to mandatory cloud databases.

- **Confirmed Architecture**: Complete client-side UI/UX for DocMind RAG Engine matching the exact visual aesthetics of the provided HTML/PNG references.
- **Backend Connectivity Strategy**: Dedicated API Settings configuration panel with pre-configured default `http://localhost:8081/api/v1` (matching the top bar indicator in the design) plus an integrated mock fallback mode so all interactive features (streaming RAG, document parsing, chunk inspection, similarity scoring) work out of the box in the browser even when the local Spring Boot service is offline.
- **Screen Coverage**: 4 full primary screens accessible via top navigation + modal flows:
  1. **Landing Page**: Complete hero with ambient glowing gradients, interactive split-screen workbench preview with clickable citation chips & chunk highlighting, 4-step pipeline explanation, bento grid of engine capabilities, tech stack showcases, and drag-and-drop teaser.
  2. **Chat Studio**: Dedicated interactive RAG workspace featuring session sidebar, streaming query synthesizer, inline citation chips, document inspection drawer, similarity metrics, and query input with model/temperature selectors.
  3. **Documents (Knowledge Base)**: Document inventory with upload dropzone, status lifecycle tracking (`UPLOADING` ➔ `PARSING` ➔ `INDEXED`), pgvector chunk visualizer, metadata filters, and document deletion/re-indexing triggers.
  4. **Settings & Spring Boot API Gateway**: Endpoint URL configurator (`http://localhost:8081/api/v1`), health check ping test, embedding model selection (`nomic-embed-text`), LLM gateway settings, and active session manager.
  5. **Auth & Sandbox Modals**: Guest Sandbox UUID switcher and transparent account claim/registration modal.

***

### 1. Overview & Core Concept

- **What It Does**: DocMind is a high-throughput enterprise Retrieval-Augmented Generation (RAG) workspace. It allows technical teams, researchers, and compliance operators to upload complex documents (PDFs, DOCX, CSV, Markdown), inspect extracted vector chunks in PostgreSQL/pgvector, and query synthesized intelligence with mathematically verifiable source citations.
- **Target Audience / Persona**: Engineers, enterprise researchers, legal & compliance auditors, and AI developers building or using Spring Boot RAG backends who demand precise citation tracking rather than opaque AI responses.
- **Key Value**: Delivers an elite, production-grade visual experience with zero dead buttons, pixel-perfect dark obsidian aesthetics, interactive citation exploration, and instant readiness for Spring Boot REST API integration.

***

### 2. User Experience & Visual Design

#### Key User Flows
1. **Explore Landing & Live Workbench**:
   - Visitors land on the obsidian hero with ambient electric purple and hyper-teal lighting.
   - They interact with the split-screen workbench demo: clicking citation pills highlights the exact source chunk in the left document preview sheet and displays similarity rankings.
   - Clicking "Try in Guest Mode", "Open Chat Studio", or dropping a file in the CTA launches directly into the interactive workspace.
2. **Chat Studio & Citation Interrogation**:
   - Users view conversation threads with preloaded enterprise queries (e.g. disaster recovery SLAs, SOC2 controls) or type new inquiries.
   - Responses stream in real-time with simulated or live Spring Boot SSE tokens.
   - Inline citation badges (e.g., `(RTO < 3 mins) p.14`, `(RPO = 0) #chunk-8821`) are reactive: clicking them opens a synchronized document drawer revealing raw chunk text, metadata, and cosine similarity distance.
3. **Document Ingestion & Chunk Inspection**:
   - Users drag and drop or browse files (PDF, DOCX, CSV, Markdown) up to 100MB.
   - Documents progress through an animated multi-phase pipeline (`Async Upload` ➔ `Ollama Chunking` ➔ `pgvector Indexed`).
   - Clicking any indexed document opens the Vector Chunk Inspector displaying dense embeddings, tokens, and chunk boundaries.
4. **Spring Boot Backend Gateway Configuration**:
   - The user visits the Settings tab to test connectivity against their local Spring Boot server (`http://localhost:8081/api/v1`).
   - The UI provides real-time connection status polling, request latency benchmarks, and toggles between live Spring Boot API calls and local mock simulation.

#### Visual Identity & Theme Tokens (From "Luminous Intelligence" Spec)
- **Palette**:
  - Root Canvas: `#13131a` (Obsidian void) / `#0e0e14` (Lowest container)
  - Surface Containers: `#1b1b22` (Low), `#1f1f26` (Mid), `#2a2931` (High), `#34343c` (Highest)
  - Primary Accent: `#c4c0ff` (Luminous Indigo / Electric Violet) with `#8781ff` container
  - Secondary Accent: `#41eec2` (Hyper Teal) with `#00d1a7` container (Grounded citation status)
  - Tertiary Accent: `#ffb2b8` / `#ff506f` (Alerts & PDF document marks)
  - Text & Contrast: `#e4e1eb` (High contrast text), `#c7c4d8` (Muted metadata)
- **Typography & Font Pairings**:
  - Display & Headings: `Inter` with optical weight balancing (`text-wrap: balance`, tight tracking)
  - Telemetry & Data: `JetBrains Mono` with `tabular-nums` for similarity metrics, chunk IDs, and latency benchmarks.
- **Top Bar Contract**:
  - Zone 1: DocMind logo + brand title + `RAG Engine v2.0` badge.
  - Zone 2: Single-line navigation links (`Landing`, `Chat Studio`, `Documents`, `Settings`) with clear active highlight state.
  - Zone 3: Guest session pill, Spring Boot API connection status pulse, and Login/Register action triggers.

***

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Mode Backend Integration (Live Spring Boot + Browser Simulation)**
  - *Chosen Approach*: The frontend issues REST calls to `http://localhost:8081/api/v1` (with standard endpoints like `/api/v1/chat/stream`, `/api/v1/documents`, `/api/v1/health`), and automatically gracefully falls back to local high-fidelity mock data if the user's Spring Boot server isn't actively running during testing.
  - *Why*: Allows immediate visual evaluation without blocking on local server boot, while providing real HTTP client hooks ready for the user's Spring Boot backend.
  - *Alternatives Considered*: Hardcoding dummy data with no network requests (poor developer utility) vs. failing if localhost isn't reachable (broken preview).
- **Decision 2: Comprehensive Multi-View SPA Navigation**
  - *Chosen Approach*: Implement a lightweight client router supporting all screens (`landing`, `chat-studio`, `documents`, `settings`, plus login/register modals).
  - *Why*: The design explicitly features links to all 4 primary views and guest session states. Providing full functional depth across every screen turns the static design into a usable enterprise product.
- **Decision 3: Zero-Dependency Font & Icon Strategy**
  - *Chosen Approach*: Load Google Fonts (`Inter` and `JetBrains Mono`) and use Lucide React icons matching the Material Symbols glyphs in the reference HTML, ensuring 100% reliable rendering without broken external asset dependencies.

***

### 4. Technical Architecture & Data Strategy

#### Component Hierarchy & Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DocMind App Shell                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navigation Header (Brand, Links, Guest UUID, API Status, Auth)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│           ┌────────────────────────┼────────────────────────┐          │
│           ▼                        ▼                        ▼          │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │   LandingView    │    │  ChatStudioView  │    │  DocumentsView   │  │
│  │ ──────────────── │    │ ──────────────── │    │ ──────────────── │  │
│  │ • Hero & Ambient │    │ • Thread History │    │ • File Dropzone  │  │
│  │ • Split Preview  │    │ • SSE Streamer   │    │ • Ingestion Ring │  │
│  │ • 4-Step RAG     │    │ • Citation Chips │    │ • Chunk Inspector│  │
│  │ • Bento Matrix   │    │ • Source Drawer  │    │ • Search/Filter  │  │
│  │ • Tech Banner    │    │ • Query Toolbar  │    │ • Status Badges  │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│                          ┌──────────────────┐                          │
│                          │   SettingsView   │                          │
│                          │ ──────────────── │                          │
│                          │ • Spring Boot URL│                          │
│                          │ • Health Probe   │                          │
│                          │ • Model Selector │                          │
│                          │ • Session Tokens │                          │
│                          └──────────────────┘                          │
│                                    │                                   │
│  ┌─────────────────────────────────┴────────────────────────────────┐  │
│  │ Global State & API Service Layer (api.ts / ragStore.ts)          │  │
│  │ • Fallback Mock Data Store (Enterprise Risk & SOC2 Reports)      │  │
│  │ • Spring Boot Fetch Client (/api/v1 endpoints)                   │  │
│  │ • Guest Session UUID Generator & State Persistence                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### State Stores & Entities
- `Document`: `{ id, title, type, size, pages, chunkCount, status, uploadedAt, sha256, chunks: Chunk[] }`
- `Chunk`: `{ id, chunkIndex, pageNumber, content, similarity, tokenCount, vectorDim }`
- `ChatMessage`: `{ id, sender, text, timestamp, citations: Citation[], similarityScore, model }`
- `Citation`: `{ documentTitle, pageNumber, chunkId, matchPercentage }`
- `BackendConfig`: `{ apiUrl: 'http://localhost:8081/api/v1', mode: 'auto' | 'mock' | 'live', isConnected: boolean, latencyMs: number }`

***

### Verification & Polish Steps
1. Verify exact visual reproduction of the hero section, interactive split workbench, 4-step pipeline, and bento grid against `Image_1_ecddb523.png` and `Image_2_cc2a834b.html`.
2. Test responsive layout across mobile (375px), tablet (768px), and desktop (1440px).
3. Validate all interactive controls: tab switching, citation drawer opening, file upload simulation, query submission with token streaming, and API configuration test.
4. Execute `compile_applet` to guarantee error-free TypeScript build.
