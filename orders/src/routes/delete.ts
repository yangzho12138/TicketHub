import express, { Request, Response } from 'express'
import { requireAuth,  NotAuthorizedError, NotFoundError, OrderStatus } from '@ticket_hub/common';
import { Order } from '../models/order';

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

    const ticket = order.ticket
    ticket.number += order.number
    await ticket.save()

    res.status(204).send(order)
})

export { router as deleteOrderRouter }