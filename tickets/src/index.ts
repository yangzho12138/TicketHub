import mongoose from 'mongoose'
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async() => {
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined");
    }

    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined");
    }

    try{
        await natsWrapper.connect('ticketing', '12345', 'http://nats-srv:4222')
        // due the heartbeat, after close a client -> nats will still send msg to it until it not response heartbeat
        // shutdown the client immediately after it is closed
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connect success!")
    }catch (err){
        console.error(err)
    }

    app.listen(3000, () => {
        console.log("Port 3000 is running!!!")
    })
} 

start()