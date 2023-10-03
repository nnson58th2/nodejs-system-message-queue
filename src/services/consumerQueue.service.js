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
    // Case processing
    consumerToQueueNormal: async () => {
        try {
            const { channel } = await connectToRabbitMQ();
            const notificationQueue = 'notificationQueueProcess'; // assertQueue

            const timeExpired = 15000;
            setTimeout(() => {
                channel.consume(notificationQueue, (msg) => {
                    console.log(`SEND NOTIFICATION SUCCESSFULLY PROCESSED::`, msg.content.toString());
                    channel.ack(msg);
                });
            }, timeExpired);
        } catch (error) {
            console.error(`ConsumerToQueueNormal error:: `, error.message);
        }
    },
    // Case failed processing
    consumerToQueueFailed: async () => {
        try {
            const { channel } = await connectToRabbitMQ();

            const notificationExchangeDLX = 'notificationExDLX'; // notificationExDLX direct
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';
            const notificationHandler = 'notificationQueueHotFix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true,
            });

            const queueResult = await channel.assertQueue(notificationHandler, {
                exclusive: false,
            });

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);
            await channel.consume(
                queueResult.queue,
                (msgFailed) => {
                    console.log(`This notification error, pls hot fix::`, msgFailed.content.toString());
                },
                {
                    noAck: true,
                }
            );
        } catch (error) {
            console.error(`ConsumerToQueueFailed error:: `, error.message);
        }
    },
};

module.exports = messageService;
