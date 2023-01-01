import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

let mongo : any;
declare global {
    function signin(): string[]
}

beforeAll(async() => {
    process.env.JWT_KEY = "YangZhou12138";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri, {});
})

beforeEach(async() => {
    // delete all the info in db
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    // close the connection
    if (mongo) {
      await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    // there is no current user api in tickets service -> fake sign in for tests
    // build a jwt payload { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId(), // for different tests -> generate different id
        email: 'Yang@test.com'
    }
    // create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    // build session object, { jwt: MY_JWT }
    const session = { jwt: token }

    // turn session to JSON
    const sessionJson = JSON.stringify(session)

    // take JSON and encode it as base64
    const base64 = Buffer.from(sessionJson).toString('base64')

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`]

}