import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models/users';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../utils/password';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password can not be empty')
], validateRequest, async (req : Request, res : Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if(!existingUser){
        throw new BadRequestError('Invalid email or password')
    }

    // compare password
    const matchPassword = await Password.compare(existingUser.password, password)
    if(!matchPassword){
        throw new BadRequestError('Invalid email or password')
    }

    // generate token
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!, {
        expiresIn: "0.25h"
    })
    // store token in cookie
    req.session = {
        jwt: userJwt
    }

    if(!existingUser.status){
        // TODO
        // send message to event-bus to different services --> the coming 15min not allowed the given user to get service
    }
    
    res.status(200).send(existingUser)
})

export { router as signinRouter }