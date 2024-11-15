import { NatsConnection, connect } from 'nats';

const NATS_SERVER = process.env.NATS_SERVER || 'nats://localhost:4222';
const SUBJECT = process.env.SUBJECT || 'subject';
const QUEUE = process.env.QUEUE || 'queue';

export class Consumer {
  private constructor() {}

  public static async init(callback: (msg: any) => void) {
    const nc: NatsConnection = await connect({ servers: NATS_SERVER });
    const sub = nc.subscribe(SUBJECT, {
      queue: QUEUE
    });

    for await (const msg of sub) {
      callback(msg.json());
    }
  }
}
