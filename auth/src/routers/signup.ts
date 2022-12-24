import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router();

router.post('/api/users/signup', [
    // if there is something wrong, errors will be appended to the req, and use validationResult can get errors
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20}).withMessage('Password is invalid')
],(req : Request, res : Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(errors.array())
    }

    const { email, password } = req.body

    res.send({email, password})
})

export { router as signupRouter }