import express, { Request, Response } from 'express'
import { OrderStatus, requireAuth, validateRequest, BadRequestError, NotAuthorizedError } from '@ticket_hub/common';
import { body } from 'express-validator'
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCompletePublisher } from '../events/publisher/payment-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty().withMessage('Token can not be empty'),
    body('orderId').not().isEmpty().withMessage('OrderId can not be empty')
], validateRequest, async(req: Request, res: Response) => {
    const { orderId, token } = req.body

    const order = await Order.findById(orderId)

    if(!order){
        throw new Error('Order not found')
    }

    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError('Can not pay for a cancelled order')
    }

    if(order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    const charge = await stripe.charges.create({
        amount: order.price * order.number * 100,
        currency: 'usd',
        source: token
    })

    const payment = Payment.build({
        orderId,
        chargeId: charge.id
    })
    await payment.save()

    // publish payment complete
    new PaymentCompletePublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: orderId,
        chargeId: charge.id
    })

    res.status(201).send(payment)

})

export { router as CreateChargeRouter}