import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@sigticketing/common";
import { body } from 'express-validator';
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
        body('ticketId')
            .not()
            .isEmpty()
            .withMessage('Ticket id must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        //Find the ticket user is trying to order in the database
        const ticket = await Ticket.findById(ticketId)
        if (!ticket) {
            throw new NotFoundError();
        }

        //Make sure ticket is not reserved
        const isReserved = await ticket.isReserved()
        if (isReserved) {
            throw new BadRequestError('ticket is already reserved')
        }

        //Calculate an expiration date for the order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        //Build the order and save to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })

        await order.save()

        //Publish and event saying that order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        })

        res.status(201).send(order)
    })

export { router as newOrderRouter }