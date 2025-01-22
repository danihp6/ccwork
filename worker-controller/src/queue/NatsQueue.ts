import { connect, NatsConnection, StringCodec, Subscription } from 'nats';

import { Queue } from './Queue';
import { ResponseQueueParameters, RunQueueParameters } from '../common/types';
import WorkerController from '../controller/WorkerController';

const NATS_SERVER = process.env.NATS_SERVER || 'nats://localhost:4222';


export class NatsQueue implements Queue {
    private nc: NatsConnection | undefined;
    private sc = StringCodec();
    private subscriptions: Map<string, Subscription> = new Map();

    constructor() {
        this.init().catch((err) => {
            console.error(`Error connecting to NATS: ${err.message}`);
        });
    }

    private async init() {
        this.nc = await connect({ servers: NATS_SERVER });
        console.log('Connected to NATS');
    }

    isConnected(): boolean {
        return this.nc !== undefined;
    }

    async subscribe(queueName: string, workerController: WorkerController): Promise<void> {
        console.log(`Attempting to subscribe to ${queueName}`);
        
        if (!this.nc) {
            throw new Error('Not connected to NATS');
        }

        if (this.subscriptions.has(queueName)) {
            console.error(`Already subscribed to ${queueName}. Continuing...`);
            return;
        }
        
        const sub = this.nc.subscribe(queueName, {
            callback: (err, msg) => {
                if (err) {
                    console.error(`Error receiving message: ${err.message}`);
                    return;
                }
                
                const message = this.sc.decode(msg.data);
                const queueMessage: RunQueueParameters = JSON.parse(message);
                workerController.process(queueMessage).then((output) => {
                    msg.respond(this.sc.encode(JSON.stringify({
                        result: output,
                        status: 200,
                    })));
                }).catch((err) => {
                    msg.respond(this.sc.encode(JSON.stringify({
                        result: err.json.message || 'Internal server error',
                        status: err.statusCode || 500,
                    })));
                    console.error('Error processing message:', err);
                });
            }
        });

        this.subscriptions.set(queueName, sub);

        console.log(`Subscribed to ${queueName}`);
    }

    // Unused method
    async unsubscribe(queueName: string): Promise<void> {
        const sub = this.subscriptions.get(queueName);
        if (sub) {
            await sub.drain();
            this.subscriptions.delete(queueName);
            console.log(`Unsubscribed from ${queueName}`);
        } else {
            console.error(`No subscription found for ${queueName}`);
        }
    }

    // Unused method
    async publish(queueName: string, message: ResponseQueueParameters): Promise<void> {
        if (!this.nc) {
            console.error('Not connected to NATS');
            return;
        }

        console.log(`Publishing message to ${queueName}: ${JSON.stringify(message)}`);

        this.nc.request(queueName, JSON.stringify(message)).then((res) => {
            console.log(`Received response: ${res}`);
            return res.json();
        }).catch((err) => {
            throw err;
        });
    }
}