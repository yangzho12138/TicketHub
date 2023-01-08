import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@ticket_hub/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async() => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        id: (new mongoose.Types.ObjectId()).toHexString(),
        title: 'concert',
        price: 100,
        number: 100,
    })
    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        price: 120,
        userId: "ashuaihsc",
        version: ticket.version + 1,
        number: 80,
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('update and save a ticket', async() =>{
    const { listener, data, msg } = await setup()

    // listen -> execute onMessage()
    await listener.onMessage(data, msg)

    const updateTicket = await Ticket.findById(data.id)

    expect(updateTicket!.title).toEqual(data.title)
    expect(updateTicket!.price).toEqual(data.price)
    expect(updateTicket!.number).toEqual(data.number)
})

it('acks the message', async() => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if there is wrong version number', async() => {
    const { listener, ticket, data, msg } = await setup()

    // wrong ticket version
    data.version = ticket.version

    try{
        await listener.onMessage(data, msg)
    }catch(err){

    }

    expect(msg.ack).not.toHaveBeenCalled()
})