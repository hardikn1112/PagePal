import express from 'express';
import multer from 'multer';
import cors from 'cors';
import {Queue} from 'bullmq';
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";
require('dotenv').config();

const GEMINI_API = process.env.GEMINI_API_KEY;


const client = new GoogleGenAI({
    apiKey:GEMINI_API
});


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`); 
    }
});


const queue = new Queue("file-upload-queue");


const upload = multer({storage: storage})


const app = express()
app.use(cors());


app.get('/', (req,res) => res.json({status : 'All Good!'}))


app.post('/upload/pdf', upload.single('pdf'), async (req,res) => {
    const job = await queue.add('file-ready', 
        JSON.stringify({
            filename: req.file.originalname,
            destination: req.file.destination,
            path: req.file.path
    }));
    return res.json({message: 'Uploaded', jobId: job.id});
});


app.get('/status/:jobId', async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await queue.getJob(jobId);
        if (!job) {
            return res.status(404).json({ status: 'not_found' });
        }
        const state = await job.getState();
        return res.json({ status: state });
    } catch (err) {
        return res.status(500).json({ status: 'error' });
    }
});


app.get('/chat', async (req,res) => {
    const userQuery = req.query.message;
    //'Mention the achievements in the resume'


    const embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: GEMINI_API,
          model: "gemini-embedding-001",
          outputDimensionality: 768,
    });
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: "http://localhost:6333",
      collectionName: "langchainjs-testing",
    });
    const ret = vectorStore.asRetriever({
        k:2
    });
    const result = await ret.invoke(userQuery);


    const SYSTEM_PROMPT = `
    You are a helpful AI assistant who answers the user query based on the available context from the pdf file.
    conext:
    ${JSON.stringify(result)}
    `;

    // Use native Gemini chat interface (same structure preserved: one call returns a response message)
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        }
      ]
    });

    const chatResponse = await chat.sendMessage({ message: userQuery });
    const messageText = chatResponse.response?.text || chatResponse.text || '';

    return res.json({message: messageText, docs:result}); 
});


app.listen(8000, () => console.log(`Server started on PORT:${8000}`));
