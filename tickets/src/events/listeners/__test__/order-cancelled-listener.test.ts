import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { OrderCancelledEvent } from '../../../../../common/src/events/order_cancelled_event';

const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = await Ticket.build({
        title: 'concert',
        price: 100,
        userId: 'test',
        number: 100
    })
    ticket.set({orderId: [orderId]})
    await ticket.save()

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        number: 1,
        version: ticket.version,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { msg, data, ticket, orderId, listener };
}

it("updates the ticket, publishes an event, and acks the message", async () => {
    const { msg, data, ticket, listener } = await setup();
  
    await listener.onMessage(data, msg);
  
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual([])
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });