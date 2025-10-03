import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  async onModuleInit() {
    try {
      // CloudAMQP URL from env
      const amqpUrl = process.env.RABBITMQ_URL;
      if (!amqpUrl) throw new Error('RABBITMQ_URL not set in environment');

      // Connect to RabbitMQ
      this.connection = await amqplib.connect(amqpUrl);
      this.channel = await this.connection.createChannel();

      console.log('✅ RabbitMQ connected successfully');

      // Optional: declare a test queue
      await this.channel.assertQueue('test_queue', { durable: true });
    } catch (err) {
      console.error('❌ RabbitMQ connection failed:', err.message);
      process.exit(1); // exit if cannot connect
    }
  }

  async sendToQueue(queue: string, message: string) {
    if (!this.channel) throw new Error('Channel is not initialized');
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async consumeQueue(queue: string, callback: (msg: string) => void) {
    if (!this.channel) throw new Error('Channel is not initialized');
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg) => {
      if (msg) {
        callback(msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
    console.log('RabbitMQ connection closed');
  }
}
