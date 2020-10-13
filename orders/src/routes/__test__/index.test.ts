import request from 'supertest'
import { app } from '../../app'
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()
    return ticket;
}

it('fetches orders for an particular user', async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signin()
    const user2 = global.signin()

    //for user #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            ticketId: ticket1.id
        })
        .expect(201)

    //for user #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket2.id
        })
        .expect(201)

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket3.id
        })
        .expect(201)

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket1.id
        })
        .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
    expect(response.body[0].ticket.id).toEqual(ticket2.id)
    expect(response.body[1].ticket.id).toEqual(ticket3.id)
})