import express from 'express'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { TweetModel, TweetModelDocumentType, TweetModelType } from '../models/TweetModel'
import { UserModelType } from '../models/UserModel'

class TweetsControllerClass {

    async getAllTweets(_: any, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find({}).populate('user').sort({ 'createdAt': '-1' }).exec()
            res.json({
                status: 'success',
                data: tweets
            })
        } catch (e) {
            res.json({
                status: 'error',
                message: e
            })
        }
    }

    async getTweet(req: express.Request, res: express.Response): Promise<void> {
        try {

            const tweetId = req.params.id

            if (!mongoose.Types.ObjectId.isValid(tweetId)) {
                res.status(400).send()
                return
            }

            await TweetModel.findById(tweetId, async (error: Error | null, tweet: TweetModelDocumentType) => {

                if (!tweet) {
                    res.status(404).send('Такого твита не существует.')
                    return
                } else if (error) {
                    res.status(500).send()
                    return
                } else {
                    res.json({
                        status: 'success',
                        data: await tweet.populate('user').execPopulate()
                    })
                }
            })

        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }

    async createNewTweet(req: express.Request, res: express.Response): Promise<void> {

        try {

            const user = req.user as UserModelType

            if (user?._id) {

                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        status: 'error',
                        errors: errors.array()
                    })
                    return
                }

                const data: TweetModelType = {
                    text: req.body.text,
                    user: user._id
                }

                const tweet = await TweetModel.create(data)

                res.json({
                    status: 'success',
                    data: await tweet.populate('user').execPopulate()
                })
            }
        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }

    async deleteTweet(req: express.Request, res: express.Response): Promise<void> {

        try {

            const user = req.user as UserModelType

            if (user) {

                const tweetId = req.params.id

                if (!mongoose.Types.ObjectId.isValid(tweetId)) {
                    res.status(400).send()
                    return
                }

                const tweet: TweetModelDocumentType = await TweetModel.findById(tweetId).exec()

                if (tweet) {

                    if (tweet.user?.toString() !== user._id?.toString()) {
                        res.status(400).send('Нет прав для удаление данного твита.')
                        return
                    }

                    tweet.remove()
                    res.json({
                        status: 'success'
                    })
                } else {
                    res.status(404).send()
                    return
                }
            }
        } catch
            (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }

    async updateTweet(req: express.Request, res: express.Response): Promise<void> {

        try {

            const user = req.user as UserModelType

            if (user) {

                const tweetId: string = req.params.id

                if (!mongoose.Types.ObjectId.isValid(tweetId)) {
                    res.status(400).send()
                    return
                }

                const tweet: TweetModelDocumentType = await TweetModel.findById(tweetId).exec()

                if (tweet) {

                    if (tweet.user?.toString() !== user._id?.toString()) {
                        res.status(400).send('Нет прав для удаление данного твита.')
                        return
                    }

                    tweet.text = req.body.text
                    await tweet.save()

                    res.json({
                        status: 'success',
                        data: tweet
                    })
                } else {
                    res.status(404).send()
                    return
                }
            }
        } catch
            (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }

}

export const TweetsController = new TweetsControllerClass()