## 📚 PagePal: Your AI-Powered Reading Companion

PagePal is an **AI-powered reading companion** designed to transform your reading experience. It uses **state-of-the-art vector embeddings and RAG (Retrieval Augmented Generation)** for accurate knowledge retrieval and contextual responses across your documents.

---

### ✨ Key Features - Vector Embeddings & RAG

* **AI-Powered Recaps:** Instantly summarize pages or the "story so far" of the content.
* **Smart Page Simplification:** Easily understand complex passages with natural language **explanations**.
* **Interactive Chat Companion:** Engage in real-time **Q&A and topic discovery**.

PagePal's accuracy and context rely on advanced methods:

| Technology | Description |
| :--- | :--- |
| **Vector Embeddings** | Advanced models convert text and queries into **high-dimensional vectors** for fast, accurate **semantic search** (retrieving relevant text based on meaning). |
| **RAG** (Retrieval Augmented Generation) | Combines the precise retrieval of **semantic search** with the power of generative AI for highly **contextual and accurate** responses. |

---

### ⚙️ Docker Compose Services

The platform is orchestrated via Docker Compose for scalability, utilizing key services:

* **Qdrant:** High-speed **vector database** for storing and searching text embeddings.
* **Valkey:** In-memory data store (Redis-compatible) for **caching and session management**.

### 🚀 Getting Started

## 🛠️ 1. Prerequisites

Ensure you have the following installed on your system:

* **Node.js** (and **npm**)
* **Git** for repository management
* **Docker** for running the docker images

---

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/hardikn1112/PagePal.git](https://github.com/hardikn1112/PagePal.git)
    ```
    
2.  **Component Setup**

    You will need three separate terminal windows open to run the Client, Server, and Worker processes concurrently.    
    **Client Setup (Terminal 1)**
    
    This runs the frontend application
    ```bash
    cd client
    npm install
    npm run dev
    ```
    
    **Server Setup (Terminal 2)**
    
    This runs the backend API.
    ```bash
    cd server
    npm install
    npm run dev
    ```
    
    **Worker Setup (Terminal 3)**
    
    This runs the background task processor.
    ````bash
    cd worker
    npm install
    npm run dev:worker
    ````
    
3.  **Running Docker Compose (Terminal 4)**
    
    Make sure you have docker installed and added as PATH variable on your desktop and is up and running.
    ````bash
    docker compose up
    ````
    
