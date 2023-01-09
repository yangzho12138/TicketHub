import mongoose from 'mongoose';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { OrderStatus, ExpirationCompleteEvent } from '@ticket_hub/common';
import { Message } from 'node-nats-streaming';

const setup = async() => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        number: 10
    })
    await ticket.save()

    const order = Order.build({
        userId: 'test',
        status: OrderStatus.Created,
        expireAt: new Date(),
        number: 1,
        ticket,
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg }
}

it('update the order status to cancelled', async() => {
    const { listener, ticket, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updateOrder = await Order.findById(order.id)
    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("emit an OrderCancelled event", async () => {
    const { listener, data, msg } = await setup();
  
    await listener.onMessage(data, msg);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("ack the message", async () => {
    const { listener, data, msg } = await setup();
  
    await listener.onMessage(data, msg);
  
    expect(msg.ack).toHaveBeenCalled();
});