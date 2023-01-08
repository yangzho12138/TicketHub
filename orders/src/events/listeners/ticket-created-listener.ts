import { Listener, Subjects, TicketCreatedEvent } from "@ticket_hub/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
    queueGroupName = queueGroupName

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price, number } = data

        const ticket = await Ticket.build({
            id,
            title,
            price,
            number
        })

        await ticket.save()

        msg.ack()
    }

}