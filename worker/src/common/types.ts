export interface RunQueueParameters {
    requestId: string;
    dockerImage: string;
    parameter: string;
}

export interface ResponseQueueParameters {
    result: string;
    status: Number;
}