import { connect, NatsConnection, StringCodec, Subscription } from 'nats';

import { Queue } from './Queue';
import { ResponseQueueParameters, RunQueueParameters } from '../common/types';

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

    async subscribe(queueName: string, callback: (message: ResponseQueueParameters) => void): Promise<void> {
        console.log(`Attempting to subscribe to ${queueName}`);
        
        if (!this.nc) {
            console.error('Not connected to NATS');
            return;
        }

        if (this.subscriptions.has(queueName)) {
            console.log(`Already subscribed to ${queueName}`);
            return;
        }
        
        const sub = this.nc.subscribe(queueName);
        this.subscriptions.set(queueName, sub);

        (async () => {
            for await (const msg of sub) {
                try {
                    const message = this.sc.decode(msg.data);
                    const queueMessage: ResponseQueueParameters = JSON.parse(message);
                    callback(queueMessage);
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(`Error processing message from ${queueName}: ${err.message}`);
                    } else {
                        console.error(`Error processing message from ${queueName}: ${err}`);
                    }
                }
            }
        })().catch((err) => {
            console.error(`Error processing messages from ${queueName}: ${err.message}`);
        });

        console.log(`Subscribed to ${queueName}`);
    }

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

    async request(queueName: string, message: RunQueueParameters): Promise<ResponseQueueParameters> {
        if (!this.nc) {
            console.error('Not connected to NATS');
            return { result: 'error', status: 503 };
        }

        console.log(`Publishing message to ${queueName}: ${JSON.stringify(message)}`);

        try {
            const res = await this.nc.request(queueName, this.sc.encode(JSON.stringify(message)), { timeout: 60000 });
            const decodedMessage = this.sc.decode(res.data);
            const queueMessage: ResponseQueueParameters = JSON.parse(decodedMessage);
            console.log(`Received response: ${queueMessage}`);
            return queueMessage;
        } catch (err) {
            console.error(`Error requesting message from ${queueName}: ${err instanceof Error ? err.message : err}`);
            return { result: `Internal server error: ${err instanceof Error ? err.message : err}`, status: 500 };
        }
    }
}