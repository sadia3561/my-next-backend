import amqp from "amqplib";

export async function publishEvent(routingKey: string, payload: any) {
  try {
    const conn = await amqp.connect(process.env.RMQ_URL || "amqp://rabbitmq:5672");
    const ch = await conn.createChannel();
    const exchange = "events";
    await ch.assertExchange(exchange, "topic", { durable: true });
    ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), { persistent: true });
    setTimeout(()=>{ ch.close(); conn.close(); }, 500);
  } catch(err){ console.error("mq err", err); }
}
