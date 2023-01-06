import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose'
import { Ticket } from "../../models/ticket";

it('return an error with invalid ticketId', async() => {
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
        ticketId: '12345',
        number: 1
    })
    .expect(400)

    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
        ticketId: new mongoose.Types.ObjectId,
        number: -1
    })
    .expect(400)

    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({})
    .expect(400)
})

it('return an error if the ticket is not exist', async() => {
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
        ticketId: new mongoose.Types.ObjectId,
        number: 1
    })
    .expect(404)
})

it('return an error if there is no ticket left', async() => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        number: 10
    })
    await ticket.save()

    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
        ticketId: ticket.id,
        number: 11
    })
    .expect(400)
})

it('reserve tickets successfully', async() => {
    const availableNumber = 10
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        number: availableNumber
    })
    await ticket.save()

    const reserveNumber = 7
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
        ticketId: ticket.id,
        number: reserveNumber
    })
    .expect(201)

    const ticketUpdate = await Ticket.findById(ticket.id)

    expect(ticketUpdate!.number).toEqual(availableNumber - reserveNumber)
})