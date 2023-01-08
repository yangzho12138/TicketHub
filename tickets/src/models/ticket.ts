import mongoose  from "mongoose"
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttri {
    title: string
    price: number
    userId: string
    number: number
}

interface TicketDoc extends mongoose.Document{
    title: string
    price: number
    userId: string
    version: number
    number: number
    orderId?: Array<string>
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attri : TicketAttri): TicketDoc
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        userId: {
          type: String,
          required: true,
        },
        number: {
          type: Number,
          required: true
        },
        orderId: {
          type: Array,
          default: []
        }
      },
      {
        timestamps: true,
        toJSON: {
          transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
          },
        },
      }
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attri : TicketAttri) => {
    return new Ticket(attri)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }