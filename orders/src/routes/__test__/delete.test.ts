import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose'
import { Order } from "../../models/order";
import { OrderStatus } from '@ticket_hub/common';
import { natsWrapper } from '../../nats-wrapper';

it('return an error if a user wants to delete another users order', async() => {
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
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})

it('return an error if the delete order is not exist', async() => {
    const orderId = new mongoose.Types.ObjectId
    await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('mark the order as cancelled', async() => {
    const availableNumber = 10
    const ticket = Ticket.build({
        id: (new mongoose.Types.ObjectId()).toHexString(),
        title: 'concert',
        price: 10,
        number: availableNumber
    })
    await ticket.save()

    const user = global.signin()

    const reserveNumber = 7
    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
        ticketId: ticket.id,
        number: reserveNumber
    })
    .expect(201)

    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

    const updateOrder = await Order.findById(order.id).populate('ticket')

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an order cancelled event', async() => {
    const availableNumber = 10
    const ticket = Ticket.build({
        id: (new mongoose.Types.ObjectId()).toHexString(),
        title: 'concert',
        price: 10,
        number: availableNumber
    })
    await ticket.save()

    const user = global.signin()

    const reserveNumber = 7
    const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
        ticketId: ticket.id,
        number: reserveNumber
    })
    .expect(201)

    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})