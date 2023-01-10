import mongoose from 'mongoose'

interface PaymentAttri{
    orderId: string
    chargeId: string
}

interface PaymentDoc extends mongoose.Document{
    orderId: string
    chargeId: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build(attri: PaymentAttri) : PaymentDoc
}

const paymentSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: true
    },
    chargeId: {
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id
            delete ret.id
        }
    }
})

paymentSchema.statics.build = (attri: PaymentAttri) => {
    return new Payment(attri)
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }