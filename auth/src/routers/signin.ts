import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';
import jwt from 'jsonwebtoken'
import { User } from '../models/users';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../utils/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password can not be empty')
],async (req : Request, res : Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array())
    }

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
    }, process.env.JWT_KEY!)
    // store token in cookie
    req.session = {
        jwt: userJwt
    }
    
    res.status(200).send(existingUser)
})

export { router as signinRouter }