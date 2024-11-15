import { NatsConnection, StringCodec, connect } from 'nats';

const NATS_SERVER = process.env.NATS_SERVER || 'nats://localhost:4222';
const SUBJECT = process.env.SUBJECT || 'subject';
const QUEUE = process.env.QUEUE || 'queue';

const sc = StringCodec();

export class Consumer {
  private constructor() {}

  public static async init(callback: (msg: any) => Promise<any>) {
    const nc: NatsConnection = await connect({ servers: NATS_SERVER });
    const sub = nc.subscribe(SUBJECT, {
      queue: QUEUE
    });

    for await (const msg of sub) {
      const res = await callback(msg.json());
      msg.respond(sc.encode(JSON.stringify(res)));
    }
  }
}
