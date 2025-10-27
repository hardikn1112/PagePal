
PagePal
PagePal is an AI-powered reading companion that enhances your reading experience with instant recaps, spoiler-free character guides, smart page simplification, and interactive dialogue. The platform uses state-of-the-art vector embeddings and RAG (Retrieval Augmented Generation) methods for semantic search and accurate knowledge retrieval throughout your documents.

Features
AI-Powered Recaps: Instantly summarize pages or the “story so far” without any spoilers.

Character & Story Guides: Get spoiler-free references to characters and key plot elements.

Smart Page Simplification: Easily understand complex passages through natural language explanations.

Interactive Chat Companion: Engage in real-time Q&A and topic discovery.

Semantic Search: Utilizes vector embeddings to represent and retrieve relevant text based on semantic similarity.

Retrieval Augmented Generation (RAG): Combines semantic search with generative AI for contextual responses.

Vector Embeddings & RAG
PagePal uses advanced embedding models to convert text and queries into high-dimensional vectors.

Vector embeddings facilitate fast and accurate semantic similarity searches over books and documents.

The retrieval pipeline leverages these embeddings to fetch the most relevant information, improving answer accuracy and conversational context.

Docker Compose Services
PagePal employs multiple services orchestrated through Docker Compose for scalability and performance:

Qdrant: High-speed vector database storing and searching embeddings for semantic retrieval.

Valkey: In-memory data store compatible with Redis, optimizes caching and session management.

Backend API: Node.js/Express server for embedding computation, orchestration, and chat management.

Frontend: React client for the user interface and API interaction.

Getting Started
Clone the repository:

bash
git clone https://github.com/hardikn1112/PagePal.git
Install dependencies:

bash
npm install
Run the application:

bash
npm start
Or start with Docker Compose:

bash
docker compose up
License
This project is licensed under the MIT License. See the LICENSE file for details.

