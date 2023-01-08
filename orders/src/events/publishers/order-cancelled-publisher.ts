import { Publisher, OrderCancelledEvent, Subjects } from "@ticket_hub/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
}