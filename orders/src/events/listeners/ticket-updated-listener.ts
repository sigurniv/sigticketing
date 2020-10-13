import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from "@sigticketing/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const { id, title, price, userId } = data;
        const ticket = await Ticket.findById(id)

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        ticket.set({ title, price })
        await ticket.save()

        msg.ack()
    }
}
