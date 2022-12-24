import express from 'express'
import { json } from 'body-parser'

import { currentUserRouter } from './routers/current-user'
import { signinRouter } from './routers/signin'
import { signoutRouter } from './routers/signout'
import { signupRouter } from './routers/signup'

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.listen(3000, () => {
    console.log("Port 3000 is running!!!")
})