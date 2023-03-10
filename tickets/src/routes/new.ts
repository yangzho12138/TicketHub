import { requireAuth } from '@ticket_hub/common'
import express, { Request, Response} from 'express'
import { body } from 'express-validator'
import { validateRequest } from '@ticket_hub/common'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'

const router = express.Router()

router.post("/api/tickets", requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt : 0 }).withMessage('Price must be greater than 0'),
    body('number').isFloat({ gt: 0 }).withMessage('Ticket available number must be greater than 0')
], validateRequest,async(req : Request, res : Response) => {
    const { title, price, number } = req.body

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
        number
    })

    await ticket.save()

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
        number,
    })

    res.status(201).send(ticket)
})

export { router as createTicketRouter }