import mongoose from "mongoose";
import { OrderStatus } from '@ticket_hub/common'
import { TicketDoc } from './ticket';

interface OrderAttri{
    userId: string
    status: OrderStatus
    expireAt: Date
    ticket: TicketDoc
    number: number
}

interface OrderDoc extends mongoose.Document{
    userId: string
    status: OrderStatus
    expireAt: Date
    ticket: TicketDoc
    number: number
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attri: OrderAttri) : OrderDoc
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
        expireAt: {
            type: mongoose.Schema.Types.Date
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        }
    },{
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id
                delete ret._id
            }
        }
    }
)

orderSchema.statics.build = (attri : OrderAttri) => {
    return new Order(attri)
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)

export { Order }