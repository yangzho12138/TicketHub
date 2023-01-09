import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@ticket_hub/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    readonly subject= Subjects.ExpirationComplete;
    queueGroupName= queueGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')

        if(!order){
            throw new Error('Order not found')
        }

        if(order.status !== OrderStatus.Complete){
            order.set({
                status: OrderStatus.Cancelled
            })
            await order.save()
            // publish order cancelled
            await new OrderCancelledPublisher(natsWrapper.client).publish({
                id: order.id,
                number: order.number,
                version: order.version,
                ticket: {
                    id: order.ticket.id
                }
            })
        }

        msg.ack()
    }
    
}