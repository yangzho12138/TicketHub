import { Listener, PaymentCompleteEvent, Subjects, OrderStatus } from '@ticket_hub/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCompleteListener extends Listener<PaymentCompleteEvent>{
    readonly subject= Subjects.PaymentComplete;
    queueGroupName= queueGroupName

    async onMessage(data: PaymentCompleteEvent['data'], msg: Message) {
        const { orderId } = data
        const order = await Order.findById(orderId)
        if(!order){
            throw new Error('Order not found')
        }

        order.set({
            status: OrderStatus.Complete
        })
        await order.save() 

        msg.ack()
    }

}