import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose'

it('fetchs the order', async() => {
    const ticket = Ticket.build({
        id: (new mongoose.Types.ObjectId()).toHexString(),
        title: 'concert',
        price: 10,
        number: 10
    })
    await ticket.save()

    const user = global.signin()

    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
        ticketId: ticket.id,
        number: 1
    })
    .expect(201)

    const { body: fecthedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

    expect(fecthedOrder.id).toEqual(order.id)
})

it('return an error if a user wants to get another users order', async() => {
    const ticket = Ticket.build({
        id: (new mongoose.Types.ObjectId()).toHexString(),
        title: 'concert',
        price: 10,
        number: 10
    })
    await ticket.save()

    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
        ticketId: ticket.id,
        number: 1
    })
    .expect(201)

    await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})

it('return an error if the order is not exist', async() => {
    const orderId = new mongoose.Types.ObjectId
    await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

