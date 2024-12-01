import { ResponseQueueParameters, RunQueueParameters } from "../common/types";

export interface Queue {
    subscribe(queueName: string, callback: (message: ResponseQueueParameters) => void): void;
    unsubscribe(queueName: string, callback: (message: any) => void): void;
    publish(queueName: string, message: RunQueueParameters): Promise<void>
}