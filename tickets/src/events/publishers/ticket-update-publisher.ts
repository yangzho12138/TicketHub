import { Publisher, Subjects, TicketUpdatedEvent } from '@ticket_hub/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    // readonly -> not allowed to change
    readonly subject = Subjects.TicketUpdated
}