import { Publisher, PaymentCompleteEvent, Subjects } from '@ticket_hub/common';

export class PaymentCompletePublisher extends Publisher<PaymentCompleteEvent>{
    readonly subject= Subjects.PaymentComplete;
}