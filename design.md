# Technical Design Document

## 1. Architecture Overview
NexusRetail follows a **Microservices-lite** architecture, decoupling the frontend presentation from the heavy AI processing logic. The system utilizes a **RAG (Retrieval-Augmented Generation)** pattern where the 01.AI model is grounded in the real-time data fetched by the application.

## 2. System Diagram (Mermaid)

```mermaid
graph TD
    Client[React Frontend] -->|JSON Request| API[FastAPI Gateway]
    
    subgraph "Backend Services"
        API -->|1. Fetch Data| DB[(SQLite/Store)]
        API -->|2. Send Context| AI_Service[AI Orchestrator]
        AI_Service -->|3. Prompt + Data| Yi[01.AI Yi-34B API]
        Yi -->|4. Analysis| AI_Service
    end
    
    subgraph "External Sources"
        Scraper[Data Scraper] -->|Update Prices| DB
    end

    AI_Service -->|5. Strategic Advice| API
    API -->|6. Response| Client