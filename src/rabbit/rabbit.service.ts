import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { QUEUE_NAME } from './rabbit.constants';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    const RABBITMQ_URL = process.env.RABBITMQ_URL;
    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(QUEUE_NAME);
      console.log('✅ RabbitMQ connected!');
    } catch (err) {
      console.error('❌ RabbitMQ connection error:', err);
    }
  }

  async sendMessage(message: string) {
    await this.channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
  }

  async receiveMessages() {
    await this.channel.consume(QUEUE_NAME, (msg) => {
      if (msg) {
        console.log('Received:', msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
