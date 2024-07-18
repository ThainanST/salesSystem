import amqp from "amqplib";
import { checkout } from "./Checkout";

async function init() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("checkout", { durable: true });
    await channel.consume("checkout", async function (message: any) {
        const input = JSON.parse(message.content.toString());
        try {
            const output = await checkout(input);
        } catch (error: any) {
            throw new Error(error.message);
        }
        channel.ack(message);
    });
}

init();