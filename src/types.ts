export type ParentWorkerMessage = {
    id: string;
    input: string;
}

export type ChildWorkerMessage = {
    status: "ready";
} | {
    status: "error";
    id: string;
    error: string;
} | {
    status: "ok";
    id: string;
    result: { chart: unknown; title: string; type: string };
}

export type PendingRequest = {
    resolve: (result: { chart: unknown; title: string; type: string } ) => void;
    reject: (reason: Error) => void;
}
