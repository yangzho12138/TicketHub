import mongoose  from "mongoose"

interface TicketAttri {
    title: string
    price: number
    userId: string
}

interface TicketDoc extends mongoose.Document{
    title: string
    price: number
    userId: string
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

ticketSchema.statics.build = (attri : TicketAttri) => {
    return new Ticket(attri)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }