import { parentPort } from "node:worker_threads";
import {
    pipeline,
    TextGenerationPipeline,
} from "@huggingface/transformers";

import type { ParentWorkerMessage } from "./types.js";
import {
    extractChartDataSysPrompt,
    extractChartLabelsSysPrompt,
    extractChartTypeSysPrompt, extractTitleSysPrompt, generateChartConfigSysPrompt,
} from "./prompts.js";

// Load model on thread startup
let generator: TextGenerationPipeline;

try {
    console.log("From worker: Starting to load model");
    generator = await pipeline(
        "text-generation",
        "Xenova/Qwen1.5-0.5B-Chat",
    ) as any;

    if (parentPort) {
        parentPort.postMessage({ status: "ready" });
    }
} catch (error) {
    console.error("Worker: Failed to load model", error);
}

// Handle incoming messages from the main thread
if (parentPort) {
    const port = parentPort;

    const genOptions = {
        max_new_tokens: 128 as const,
        temperature: 0,
        do_sample: false,
        return_full_text: false,
    }


    port.on("message", async (payload: ParentWorkerMessage) => {
        console.log(`Step 0, receive payload: ${payload}`)

        const rawTitle = await generator([
            { role: "system", content: extractTitleSysPrompt },
            { role: "user", content: payload.input },
        ], genOptions);
        const title = (rawTitle[0] as any).generated_text.at(-1).content as string;

        const rawType = await generator([
            { role: "system", content: extractChartTypeSysPrompt },
            { role: "user", content: payload.input },
        ], genOptions);
        const chartType = (rawType[0] as any).generated_text.at(-1).content as string;


        const rawLabels = await generator([
            { role: "system", content: extractChartLabelsSysPrompt },
            { role: "user", content: payload.input },
        ], genOptions);
        const labels = (rawLabels[0] as any).generated_text.at(-1).content as string;

        const rawData = await generator([
            { role: "system", content: extractChartDataSysPrompt },
            { role: "user", content: payload.input },
        ], genOptions);
        const data = (rawData[0] as any).generated_text.at(-1).content as string;

        const chartconfig = await generator([
            { role: "system", content: generateChartConfigSysPrompt },
            { role: "user", content: `title: ${title}, type: ${chartType}, labels: ${labels}, data: ${data}` },
        ], genOptions);

        const chart = {
            chartconfig
        }

        port.postMessage({ status: "ok", id: payload.id, result: chart });
    });
}
