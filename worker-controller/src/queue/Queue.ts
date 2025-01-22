import { ResponseQueueParameters, RunQueueParameters } from "../common/types";
import WorkerController from "../controller/WorkerController";

export interface Queue {
    subscribe(queueName: string, workerController: WorkerController): void;
    unsubscribe(queueName: string, callback: (message: any) => void): void;
}