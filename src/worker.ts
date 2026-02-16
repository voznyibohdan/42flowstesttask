import { parentPort } from "node:worker_threads";
import {pipeline, TextGenerationPipeline,} from "@huggingface/transformers";

import {
    extractChartDataSysPrompt,
    extractChartLabelsSysPrompt,
    extractTitleWithTypeSysPrompt,
    generateChartConfigSysPrompt,
} from "./prompts.js";
import type { ParentWorkerMessage } from "./types.js";

// Load model on thread startup
let generator: TextGenerationPipeline;

try {
    console.log("From worker: Starting to load model");
    generator = await pipeline(
        "text-generation",
        "onnx-community/Qwen2.5-1.5B-Instruct",
    );

    if (parentPort) {
        parentPort.postMessage({ status: "ready" });
    }
} catch (error) {
    console.error("From worker: Failed to load model", error);
}

// Handle incoming messages from the main thread
if (parentPort) {
    const port = parentPort;

    const genOptions = {
        max_new_tokens: 400,
        temperature: 0,
        do_sample: false,
        return_full_text: false,
    }

    port.on("message", async (payload: ParentWorkerMessage) => {
        try {
            console.log(`Step 0, receive payload: ${payload}`);

            const rawTitleWithType = await generator([
                { role: "system", content: extractTitleWithTypeSysPrompt },
                { role: "user", content: payload.input },
            ], genOptions);
            const titleWithType = (rawTitleWithType[0] as any).generated_text.at(-1).content as string;
            const [title, type] = titleWithType.split(", ");
            console.log(`Step 1, title: ${title}, type: ${type}`);

            const rawLabels = await generator([
                { role: "system", content: extractChartLabelsSysPrompt },
                { role: "user", content: payload.input },
            ], genOptions);
            const labels = (rawLabels[0] as any).generated_text.at(-1).content as string;
            console.log(`Step 3, labels: ${labels}`)

            const rawData = await generator([
                { role: "system", content: extractChartDataSysPrompt },
                { role: "user", content: payload.input },
            ], genOptions);
            const data = (rawData[0] as any).generated_text.at(-1).content as string;
            console.log(`Step 4, data: ${data}`);

            const chartconfig = await generator([
                { role: "system", content: generateChartConfigSysPrompt },
                { role: "user", content: `title: ${title}, type: ${type}, labels: ${labels}, data: ${data}` },
            ], genOptions);
            const config = (chartconfig[0] as any).generated_text.at(-1).content as string;
            console.log(`Step 5, config: ${config}`);

            const cleanJsonString = config.replace(/^```json\s*|\s*```$/g, '');
            const echartsObject = JSON.parse(cleanJsonString);

            port.postMessage({
                status: "ok",
                id: payload.id,
                result: {
                    chart: echartsObject,
                    title,
                    type
                }
            });
        } catch (error) {
            port.postMessage({
                status: "error",
                id: payload.id,
                error: (error as Error).message
            });
        }
    });
}
