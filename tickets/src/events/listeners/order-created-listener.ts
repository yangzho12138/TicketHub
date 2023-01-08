import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@ticket_hub/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-update-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if(!ticket){
            throw new Error("Ticket not found")
        }

        ticket.set({ 
            orderId: ticket.orderId!.push(data.id),
            number: ticket.number - data.number
        })
        await ticket.save()

        // ticket update -> invoke ticket update publish
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            number: ticket.number
        })

        msg.ack()
    }

}
