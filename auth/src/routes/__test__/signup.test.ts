import request from "supertest";
import { app } from "../../app";

it('invalid email', async() => {
    return await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test',
        password: '123456'
    })
    .expect(400)
})

it('invalid password', async() => {
    return await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com',
        password: '12'
    })
    .expect(400)
})

it('success sign up', async() => {
    return await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(201)
})

it('duplicate email', async() => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(201)

    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(400)
})

it('set cookie after success signup', async() => {
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com',
        password: '123456'
    })
    .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
})

it('missing email or password', async() => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@example.com'
    })
    .expect(400)

    await request(app)
    .post('/api/users/signup')
    .send({
        password: '123456'
    })
    .expect(400)
})