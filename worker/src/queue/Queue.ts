import { QueueParameters } from "../common/types";

export interface Queue {
    subscribe(queueName: string, callback: (message: QueueParameters) => void): void;
    unsubscribe(queueName: string, callback: (message: any) => void): void;
}