import { RunQueueParameters } from "../common/types";

export interface Queue {
    subscribe(queueName: string, callback: (message: RunQueueParameters) => void): void;
    unsubscribe(queueName: string, callback: (message: any) => void): void;
}