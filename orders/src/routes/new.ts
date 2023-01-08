import express, { Request, Response } from "express";
import { body } from 'express-validator'
import { requireAuth, validateRequest, BadRequestError, OrderStatus, NotFoundError } from '@ticket_hub/common';
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60 // 15min

router.post('/api/orders', requireAuth, [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('TicketId must be valid'),
    body('number').isFloat({gt: 0})
], validateRequest,async(req: Request, res: Response) => {
    const { ticketId, number } = req.body
    const ticket = await Ticket.findById(ticketId)

    if(!ticket){
        throw new NotFoundError()
    }

    // due to the delay (someone almost hand in the order simultaneously) -> check the ticket number in db through db method
    const canBeReserved = await ticket.canBeReserved(number)
    if(!canBeReserved){
        throw new BadRequestError('The ticket number user want to reserve exceeds the stock')
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expireAt: expiration,
        ticket: ticket,
        number: number
    })
    await order.save()

    ticket.number -= number
    await ticket.save()

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        number: order.number,
        expireAt: order.expireAt.toISOString(),
        userId: order.userId,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    })

    res.status(201).send(order)
})

export { router as newOrderRouter }