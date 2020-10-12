import { Publisher, Subjects, TicketCreatedEvent } from "@sigticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}