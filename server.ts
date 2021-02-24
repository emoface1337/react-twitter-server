import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer'


dotenv.config()

import { UserController } from './src/controllers/UserController'
import { registerValidator } from './src/validators/registerValidator'
import { passport } from './src/core/passport'
import { TweetsController } from './src/controllers/TweetsController'
import { createTweetValidator } from './src/validators/createTweetValidator'
import { UploadController } from './src/controllers/UploadFileController'

require('./src/core/db')

const cors = require('cors')

const app = express()
const port = process.env.PORT || 6666

app.use(cors())
app.use(express.json())
app.use(passport.initialize())


const storage = multer.memoryStorage()
const upload = multer({ storage })

// auth
app.get('/auth/verify', UserController.verifyUser)
app.get('/auth/me', UserController.isAuthorized)
app.post('/auth/signup', registerValidator, UserController.createNewUser)
app.post('/auth/signin', UserController.signIn)

// users
app.get('/users', UserController.getAllUsers)
app.get('/users/recommended', UserController.getRecommendedUsers)
app.get('/users/:id', UserController.getUser)

// tweets
app.get('/tweets', TweetsController.getAllTweets)
app.get('/tweets/:id', TweetsController.getTweet)
app.post('/tweets', passport.authenticate('jwt'), createTweetValidator, TweetsController.createNewTweet)
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsController.deleteTweet)
app.patch('/tweets/:id', passport.authenticate('jwt'), TweetsController.updateTweet)

// file upload
app.post('/upload', upload.single('file'), UploadController.uploadPhoto)


// themes


// recommended users


app.listen(port, (): void => {
    return console.log(`server is listening on ${port}`)
})