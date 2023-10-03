'use strict';

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        if (!connection) throw new Error(`Connection not established!`);

        const channel = await connection.createChannel();

        return { connection, channel };
    } catch (error) {
        console.error(`Connect to RabbitMQ error:: `, error);
        throw error;
    }
};

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ();

        // Publish message to a queue
        const queue = 'test-queue';
        const message = 'Hello, shopDEV by Son Nguyen';

        await channel.assertQueue(queue);
        await channel.sendToQueue(queue, Buffer.from(message));

        // Close the connection
        await connection.close();
    } catch (error) {
        console.error(`Connect to RabbitMQ for test error:: `, error);
        throw error;
    }
};

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true });
        console.log(`Waiting for messages...`);
        channel.consume(
            queueName,
            (msg) => {
                console.log(`Received message: ${queueName}::`, msg.content.toString());
            },
            {
                noAck: true,
            }
        );
    } catch (error) {
        console.error(`Consumer queue error:: `, error);
        throw error;
    }
};

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue,
};
