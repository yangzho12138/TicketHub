import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/users';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/api/users/signup', [
    // if there is something wrong, errors will be appended to the req, and use validationResult can get errors
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20}).withMessage('Password is invalid')
],async (req : Request, res : Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array())
    }

    const { email, password } = req.body
    
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new BadRequestError('The email address has been used')
    }

    const newUser = User.build({email, password})
    await newUser.save()

    // generate token
    const userJwt = jwt.sign({
        id: newUser.id,
        email: newUser.email
    }, process.env.JWT_KEY!)
    // store token in cookie
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(newUser);
    
})

export { router as signupRouter }