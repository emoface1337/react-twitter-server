import express from 'express'
import { UserController } from './src/controllers/UserController'
import { registerValidator } from './src/validators/registerValidator'
import dotenv from 'dotenv'

dotenv.config()

require('./src/core/db')

const cors = require('cors')

const app = express()
const port = 6666

app.use(cors())
app.use(express.json())

app.get('/users', UserController.index)
app.post('/users', registerValidator, UserController.create)

app.listen(port, (): void => {
    return console.log(`server is listening on ${port}`)
})