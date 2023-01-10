// we do not want to connect to NATS everytime during the test, so we want to mock nats-wrapper file to build an client
// build a __mocks__ folder in the same dir of the file you want to mock
// dive into nats-wrapper -> base_publisher, it gives a client that can invoke publish function
export const natsWrapper = {
    client:{
        // by writing like this -> we can write some codes to ensure the publish is executed
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
            // actual function that will be invoked when run publish
            callback()
        })
    }
}