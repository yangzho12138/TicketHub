import express from 'express'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import 'express-async-errors' // 可以在async函数中throw error
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routers/current-user'
import { signinRouter } from './routers/signin'
import { signoutRouter } from './routers/signout'
import { signupRouter } from './routers/signup'
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

const app = express()
app.set('trust proxy', true) // https
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: true // need https request
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

const start = async() => {
    if(!process.env.JWT_KEY){
        throw new Error("JWT_KEY must be defined");
    }

    try{
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth")
        console.log("Database connect success!")
    }catch (err){
        console.error(err)
    }

    app.listen(3000, () => {
        console.log("Port 3000 is running!!!")
    })
} 

start()