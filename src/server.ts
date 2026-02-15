import express from "express";
import 'dotenv/config';

import path from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";

import type { ChildWorkerMessage, PendingRequest } from "./types.js";

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../generated/prisma/client.js";

// In-memory storage for pending requests
const pendingLLMRequests = new Map<string, PendingRequest>();

// LLM worker thread
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workerPath = path.join(__dirname, "worker.js");
const LLMWorker = new Worker(workerPath);

let LLMIsReady = false;

LLMWorker.on("message", (msg: ChildWorkerMessage) => {
    switch (msg.status) {
        case "ready": {
            LLMIsReady = true;

            console.log("LLM is loaded and ready to use!");
            return;
        }
        case "error": {
            const record = pendingLLMRequests.get(msg.id);
            if (record === undefined) {
                console.error(`Error: LLM returned an error for unknown request ID ${msg.id}`);
                return;
            }

            record.reject(new Error(msg.error));
            pendingLLMRequests.delete(msg.id);
            return;
        }
        case "ok": {
            const record = pendingLLMRequests.get(msg.id);
            if (record === undefined) {
                console.error(`LLM returned ok for unknown request ID ${msg.id}`);
                return;
            }

            record.resolve(msg.result);
            pendingLLMRequests.delete(msg.id);
            return;
        }
        default:
            console.error("Unknown message status from LLM worker");
    }
})

// Prisma client
const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

// Server setup
const app = express();
app.use(express.json());

app.get("/api/healthcheck", (_req, res) => {
    res.json({ status: "ok", llmLoaded: LLMIsReady });
});

app.post("/api/analyze", requireLLMReadyMiddleware, async (req, res) => {
    const message = req.body.message;
    if (message === undefined || message === "" || message.length > 1024) {
        res.status(400).json({ error: "Message is missing or more than 1024 characters long" });
        return;
    }

    const requestId = crypto.randomUUID();
    const promise = new Promise<unknown>((resolve, reject) => {
        pendingLLMRequests.set(requestId, {resolve, reject});
    });

    LLMWorker.postMessage({ id: requestId, input: message });

    try {
        const result = await promise as { chart: unknown, title: string, type: string };
        await prisma.request.create({
            data: {
                input_text: message,
                title: result.title,
                status: "success",
                type: result.type,
                config: result as object,
            },
        });
        res.json({ success: true, echartsConfig: result });
    } catch (err) {
        const errorMessage = (err as Error).message;
        await prisma.request.create({
            data: {
                input_text: message,
                title: null,
                status: "error",
                type: null,
                config: { error: "Failed to generate response", details: errorMessage },
            },
        });
        res.status(500).json({
            success: false,
            error: "Failed to generate response",
            details: errorMessage
        });
    }
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

// Middleware: require LLM to be ready
function requireLLMReadyMiddleware(_req: express.Request, res: express.Response, next: express.NextFunction) {
    if (LLMIsReady) {
        next();
        return;
    }

    res.status(503).json({ error: "LLM is not loaded yet, please wait" });
}
