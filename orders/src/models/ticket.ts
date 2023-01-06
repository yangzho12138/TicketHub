import mongoose from "mongoose";

interface TicketAttri{
    title: string
    price: number
    number: number
}

export interface TicketDoc extends mongoose.Document{
    title: string
    price: number
    number: number
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attri : TicketAttri) : TicketDoc
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        number: {
            type: Number,
            required: true,
            min: 0
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

ticketSchema.statics.build = (attri: TicketAttri) => {
    return new Ticket(attri)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }