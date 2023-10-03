'use strict';

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed } = require('./src/services/consumerQueue.service');

const queueName = 'test-topic';

// consumerToQueue(queueName)
//     .then(() => {
//         console.log(`Message consumer started ${queueName}`);
//     })
//     .catch((error) => {
//         console.error('Message consumer error:: ', error.message);
//     });

consumerToQueueNormal(queueName)
    .then(() => {
        console.log(`Message consumer normal started`);
    })
    .catch((error) => {
        console.error('Message consumer normal error:: ', error.message);
    });

consumerToQueueFailed(queueName)
    .then(() => {
        console.log(`Message consumer failed started`);
    })
    .catch((error) => {
        console.error('Message consumer failed error:: ', error.message);
    });
