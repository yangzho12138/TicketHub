import { Listener, OrderCancelledEvent, Subjects } from '@ticket_hub/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-update-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject= Subjects.OrderCancelled;
    queueGroupName= queueGroupName


    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if(!ticket){
            throw new Error("Ticket not found")
        }


        ticket.orderId = ticket.orderId!.filter(item => item !== data.id)
        ticket.set({ 
            orderId: ticket.orderId,
            number: ticket.number + data.number
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