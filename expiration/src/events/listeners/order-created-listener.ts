import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@ticket_hub/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName


    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const delay = new Date(data.expireAt).getTime() - new Date().getTime()
        expirationQueue.add(
            {
                // job
                orderId: data.id
            },
            {
                // delay time to process the job
                delay,
            }
        )

        msg.ack()
    }

}