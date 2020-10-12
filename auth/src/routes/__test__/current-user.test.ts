import request from 'supertest';
import { app } from "../../app";

it('responds with current user details', async () => {
    const cookie = await global.signin();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.user.email).toEqual('test@test.com')
})

it('respond with auth error if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(401)
})