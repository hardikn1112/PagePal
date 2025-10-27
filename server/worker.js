import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
require('dotenv').config();

const GEMINI_API = process.env.GEMINI_API_KEY;

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    const data = JSON.parse(job.data);

    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: GEMINI_API,
      model: "models/gemini-embedding-001",
      outputDimensionality: 768,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: "http://localhost:6333",
      collectionName: "langchainjs-testing",
    });

    await vectorStore.addDocuments(docs);
    console.log(`All docs are added to the vector store`);
  },
  {
    concurrency: 100,
    connection: { host: "localhost", port: "6379" },
  }
);
