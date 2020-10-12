import { Publisher, Subjects, TicketUpdatedEvent } from "@sigticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}