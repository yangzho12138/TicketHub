import { Listener, Subjects, TicketUpdatedEvent } from "@ticket_hub/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, number, version } = data

        const ticket = await Ticket.findOne({
            id: id,
            version: version - 1 // update event version == db version + 1
        })

        if(!ticket){
            throw new Error('Ticket Not Found')
        }

        ticket.set({
            title,
            price,
            number
        })

        await ticket.save()

        msg.ack()
    }

}