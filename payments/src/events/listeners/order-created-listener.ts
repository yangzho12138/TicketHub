import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@ticket_hub/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListner extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName


    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const { id, status, number, userId, ticket, version } = data

        const order = Order.build({
            id,
            number,
            userId,
            price: ticket.price,
            status,
            version,
        })

        await order.save()

        msg.ack()

    }
    
}