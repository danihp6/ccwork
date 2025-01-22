export interface RunQueueParameters {
    dockerImage: string;
    parameter: string;
}

export interface ResponseQueueParameters {
    result: string;
    status: Number;
}