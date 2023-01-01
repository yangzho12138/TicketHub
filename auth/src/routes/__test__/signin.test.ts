import request from "supertest";
import { app } from "../../app";

it('invalid user', async() => {
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(400)
})

it('invalid password', async() => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@example.com',
        password: '12345'
    })
    .expect(400)
})

it('response a cookie when given valid credentials', async() => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(201)

    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})