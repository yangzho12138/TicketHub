import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@ticket_hub/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';

const setup = async() => {
    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = await Ticket.build({
        title: 'concert',
        price: 100,
        userId: 'test',
        number: 100
    })

    await ticket.save()

    const data: OrderCreatedEvent['data'] = {
        id: (new mongoose.Types.ObjectId()).toHexString(),
        version: 0, // each order instance id independent -> version is unnecessary
        status: OrderStatus.Created,
        number: 1,
        expireAt: 'test',
        userId: 'test',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('set the userId of the ticket', async() => {
    const { listener, ticket, data, msg } = await setup()
    
    await listener.onMessage(data, msg)

    const updateTicket = await Ticket.findById(ticket.id)

    expect(updateTicket!.orderId![0]).toEqual(data.id)
})

it('acks the message', async() => {
    const { listener, data, msg } = await setup()
    
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publish a ticket updated event after listen to the order created', async() => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})