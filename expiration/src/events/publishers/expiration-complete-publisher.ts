import { ExpirationCompleteEvent, Publisher, Subjects } from '@ticket_hub/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject= Subjects.ExpirationComplete;
}