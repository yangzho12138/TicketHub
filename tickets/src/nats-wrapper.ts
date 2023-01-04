import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper{
    private _client ?: Stan

    // getter
    get client(){
        if(!this._client){
            throw new Error('Can not access NATS clinet before connecting')
        }
        return this._client
    }

    connect(clusterId : string, clientId : string, url : string){
        this._client = nats.connect(clusterId, clientId, {url})

        return new Promise<void>((resolve, reject) => {
            // getter
            this.client.on('connect', () => {
                console.log('Connect to NATS Streaming')
                resolve()
            })
            this.client.on('error', (err) => {
                reject(err)
            })
        })
    }
}

// return an instance --> any file in the microservice can access the same nat connection instance
export const natsWrapper = new NatsWrapper();