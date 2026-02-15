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
    result: unknown;
}

export type PendingRequest = {
    resolve: (result: unknown ) => void;
    reject: (reason: Error) => void;
}
