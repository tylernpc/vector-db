# RAG w/Langchain - Summarization app
<img width="2764" height="1792" alt="SSOne" src="https://github.com/user-attachments/assets/dc98d568-ed86-4be4-98c7-fb6a3f5be541" />
<img width="1537" height="320" alt="image" src="https://github.com/user-attachments/assets/e263cfaa-e2ca-4215-9d11-74fb94ef4689" />
# Vector DB App

A Next.js application for embedding documents into a vector database and summarizing text using OpenAI models.

## Features

- **Text Summarization** — Summarize any text using GPT-4o-mini via a live demo UI or REST API
- **Document Embedding** — Embed documents with OpenAI and store them in Supabase (pgvector) for future similarity search

## Architecture

```mermaid
flowchart TD
    User([Client])

    subgraph Frontend["Frontend — Next.js Page (src/app/page.js)"]
        SumForm[Summarization Form]
        DocForm[Save Document Form]
    end

    subgraph API["API Routes (Next.js serverless)"]
        SumRoute["POST /api/summarization"]
        DocRoute["POST /api/documents"]
    end

    subgraph OpenAI["OpenAI API"]
        Chat["GPT-4o-mini\n(chat completion)"]
        Embed["text-embedding-ada-002\n(embeddings)"]
    end

    subgraph Supabase["Supabase (PostgreSQL + pgvector)"]
        DB[("documents table\n─────────────\nid · UUID\ncontent · text\nmetadata · JSONB\nembedding · vector(1536)\ncreated_at · timestamp")]
    end

    User -->|"types message"| SumForm
    User -->|"types content + source"| DocForm

    SumForm -->|"POST {message}"| SumRoute
    DocForm -->|"POST {content, metadata}"| DocRoute

    SumRoute -->|"invoke() with prompt"| Chat
    Chat -->|"summary text"| SumRoute
    SumRoute -->|"{result: summary}"| SumForm
    SumForm -->|"displays summary"| User

    DocRoute -->|"embedQuery(content)"| Embed
    Embed -->|"vector[1536]"| DocRoute
    DocRoute -->|"insert row"| DB
    DB -->|"document id"| DocRoute
    DocRoute -->|"{id: uuid}"| DocForm
    DocForm -->|"displays success + id"| User
```

## Data Flow Summary

| Flow | Input | Processing | Output |
|------|-------|------------|--------|
| Summarization | User text | GPT-4o-mini via LangChain | Summary string |
| Document Save | Text + optional source | OpenAI embedding → Supabase insert | Document UUID |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js + React 19 |
| Styling | Tailwind CSS v4 |
| LLM | OpenAI GPT-4o-mini |
| Embeddings | OpenAI text-embedding-ada-002 |
| Abstraction | LangChain OpenAI |
| Database | Supabase (PostgreSQL + pgvector) |

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in your keys:
   ```
   OPENAI_API_KEY=...
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## API Reference

### `POST /api/summarization`
```json
// Request
{ "message": "Text to summarize" }

// Response
{ "result": "Summarized text..." }
```

### `POST /api/documents`
```json
// Request
{ "content": "Document text", "metadata": { "source": "optional-source" } }

// Response
{ "id": "uuid-of-stored-document" }
```
