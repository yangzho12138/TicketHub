import mongoose from 'mongoose';
import { OrderStatus } from '@ticket_hub/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface OrderAttri{
    id: String
    number: number
    userId: String
    price: String
    status: OrderStatus
    version: number
}

interface OrderDoc extends mongoose.Document{
    number: number
    userId: String
    price: String
    status: OrderStatus
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attri: OrderAttri) : OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: OrderStatus,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attri: OrderAttri) => {
    return new Order({
        _id: attri.id,
        version: attri.version,
        price: attri.price,
        userId: attri.userId,
        status: attri.status,
        number: attri.number
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)

export { Order }

