import express, { Request, Response } from 'express'
import { requireAuth,  NotAuthorizedError, NotFoundError, OrderStatus } from '@ticket_hub/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

router.delete('/api/orders/:orderId', requireAuth, async(req: Request, res: Response) => {
    const orderId = req.params.orderId

    const order = await Order.findById(orderId).populate('ticket')
    if(!order){
        throw new NotFoundError()
    }
    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    // ticket-update-listener will update the number, or the version will be affected
    // const ticket = order.ticket
    // ticket.number += order.number
    // await ticket.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        number: order.number,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })

    res.status(204).send(order)
})

export { router as deleteOrderRouter }