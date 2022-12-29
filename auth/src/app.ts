import express from 'express'
import { json } from 'body-parser'
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
    secure: process.env.NODE_ENV !== 'test' // need https request (test env: false -> http)
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }