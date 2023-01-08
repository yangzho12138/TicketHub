import { Publisher, OrderCreatedEvent, Subjects } from "@ticket_hub/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
}