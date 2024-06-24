import amqp from "amqplib";

async function init() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("checkout", { durable: true });
    await channel.consume("checkout", async function (message: any) {
        const input = JSON.parse(message.content.toString());

        // TODO: Implement the checkout logic here
        console.log(input);
        channel.ack(message);
    });
}

init();