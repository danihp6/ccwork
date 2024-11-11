import { connect, NatsConnection, StringCodec, Subscription } from 'nats';

import { Queue } from './Queue';
import { QueueParameters } from '../common/types';

export class NatsQueue implements Queue {
    private nc!: NatsConnection;
    private sc = StringCodec();
    private subscriptions: Map<string, Subscription> = new Map();

    constructor() {
        this.init();
    }

    private async init() {
        this.nc = await connect({ servers: 'nats://localhost:4222' });
        console.log('Connected to NATS');
    }

    async subscribe(queueName: string, callback: (message: QueueParameters) => void): Promise<void> {
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
                    const queueMessage: QueueParameters = JSON.parse(message);
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
}