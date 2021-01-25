import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { UserController } from './src/controllers/UserController'
import { registerValidator } from './src/validators/registerValidator'

require('./src/core/db')

const cors = require('cors')

const app = express()
const port = process.env.PORT || 6666

app.use(cors())
app.use(express.json())

app.get('/users', UserController.getAllUsers)
app.get('/users/verify', UserController.verifyUser)
app.get('/users/:id', UserController.getUser)
app.post('/users', registerValidator, UserController.createNewUser)

app.listen(port, (): void => {
    return console.log(`server is listening on ${port}`)
})