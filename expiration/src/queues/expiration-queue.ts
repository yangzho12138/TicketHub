import Queue from 'bull'

const expirationQueue = new Queue('order:expiration', {
    redis:{
        host: process.env.REDIS_HOST,
    }
})

// process the job (parameters) passed in the queue
expirationQueue.process(async(job) => {
    
})

export {expirationQueue}