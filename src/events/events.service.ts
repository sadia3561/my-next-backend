import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class EventsService {
  private channel: amqp.Channel;

  async onModuleInit() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await connection.createChannel();
  }

  async publish(events: string, payload: any) {
    if (!this.channel) return;
    const exchange = 'events';
    await this.channel.assertExchange(exchange, 'fanout', { durable: true });
    this.channel.publish(exchange, '', Buffer.from(JSON.stringify({ events, payload })));
  }
}
