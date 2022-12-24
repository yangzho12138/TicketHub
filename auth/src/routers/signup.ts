import express from 'express'

const router = express.Router();

router.post('/api/users/signop', (req, res) => {
    res.send('sign up')
})

export { router as signupRouter }