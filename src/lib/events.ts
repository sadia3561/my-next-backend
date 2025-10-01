// src/lib/events.ts
export function publishEvents(eventsName: string, payload: any) {
  console.log("Events published:", eventsName, payload);
  // यहाँ पर तुम RabbitMQ, Kafka या किसी service को call कर सकते हो
}
