'use strict';

const { connectToRabbitMQ, consumerQueue } = require('../dbs/init.rabbitmq');

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error(`Error consumer to queue:: `, error);
        }
    },
};

module.exports = messageService;
