export interface ResponseQueueParameters {
    result: string;
    status: Number;
}

export interface RunQueueParameters {
    requestId: string;
    dockerImage: string;
    parameter: string;
}