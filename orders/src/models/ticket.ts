import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttri{
    id: string // keep consistence with the ticket id in Ticket service
    title: string
    price: number
    number: number
}

export interface TicketDoc extends mongoose.Document{
    title: string
    price: number
    number: number
    version: number
    canBeReserved(reserveNumber : number) : Promise<boolean>
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attri: TicketAttri) => {
    return new Ticket(attri)
}

ticketSchema.methods.canBeReserved = async function(reserveNumber : number){
    const availabelTicket = await Ticket.findById(this.id)
    if(reserveNumber > availabelTicket!.number){
        return false
    }
    return true
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }