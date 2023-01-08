import mongoose from 'mongoose'
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';

const start = async() => {
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined");
    }

    if(!process.env.MONGO_URI){
        throw new Error("MONGO_URI must be defined");
    }

    if(!process.env.NATS_CLIENT_ID){
        throw new Error("NATS_CLIENT_ID must be defined");
    }

    if(!process.env.NATS_URL){
        throw new Error("NATS_URL must be defined");
    }

    if(!process.env.NATS_CLUSTER_ID){
        throw new Error("NATS_CLUSTER_ID must be defined");
    }

    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
        // due the heartbeat, after close a client -> nats will still send msg to it until it not response heartbeat
        // shutdown the client immediately after it is closed
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()

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