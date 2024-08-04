import Queue from "./Queue";
import amqp from 'amqplib';

export default class RabbitMQAdapter implements Queue {

    connection: any;

    constructor () {

    }
    async connect(): Promise<any> {
        this.connection = await amqp.connect('amqp://localhost');
    }
    
    async on(queueName: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        await channel.consume(queueName, async function (message: any) {
            const input = JSON.parse(message.content.toString());
            try {
                await callback(input);
            } catch (error: any) {
                throw new Error(error.message);
            }
            channel.ack(message);
        });
        
    }
    async publish(queueName: string, data: any): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    }
}