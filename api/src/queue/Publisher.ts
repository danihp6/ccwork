import { connect, NatsConnection, StringCodec } from 'nats';

const NATS_SERVER = process.env.NATS_SERVER || 'nats://localhost:4222';
const SUBJECT = process.env.SUBJECT || 'subject';

const sc = StringCodec();

export class Publisher {
  nc: NatsConnection;
  private constructor(nc: NatsConnection) {
    this.nc = nc;
  }

  public static async init() {
    const nc: NatsConnection = await connect({ servers: NATS_SERVER });
    return new Publisher(nc);
  }

  async publish(image: string, params: string) {
    const res = await this.nc.request(SUBJECT, sc.encode(JSON.stringify({
      dockerImage: image,
      parameter: params,
    })));
    return res.json();
  }
}