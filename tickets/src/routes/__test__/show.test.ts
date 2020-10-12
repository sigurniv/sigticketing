import request from 'supertest'
import { app } from '../../app';
import mongoose from 'mongoose'

it('returns 404 if the ticket is not found', async () => {
    const response = await request(app)
        .post(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .send()
        .expect(404);
})

it('returns the ticket if the ticket is found', async () => {
    const title = 'concert'
    const price = 20
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: price
        })
        .expect(201)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(200)

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})