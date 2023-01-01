import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../models/users';
import { BadRequestError, validateRequest } from '@ticket_hub/common';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/api/users/signup', [
    // if there is something wrong, errors will be appended to the req, and use validationResult can get errors
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20}).withMessage('Password is invalid')
], validateRequest,async (req : Request, res : Response) => {
    const { email, password, isAdmin } = req.body
    
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new BadRequestError('The email address has been used')
    }

    const newUser = User.build({email, password, isAdmin})
    await newUser.save()

    // generate token
    const userJwt = jwt.sign({
        id: newUser.id,
        email: newUser.email
    }, process.env.JWT_KEY!,{
        expiresIn: "0.25h"
    })
    // store token in cookie
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(newUser);
    
})

export { router as signupRouter }