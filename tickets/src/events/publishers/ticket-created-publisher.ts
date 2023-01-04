import { Publisher, Subjects, TicketCreatedEvent } from '@ticket_hub/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    // readonly -> not allowed to change
    readonly subject = Subjects.TicketCreated
}