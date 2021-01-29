import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { UserModel, UserModelDocumentType, UserModelType } from '../models/UserModel'
import { generateMD5 } from '../utils/hashGenerator'
import { sendMail } from '../utils/sendMail'

class UserControllerClass {

    async getAllUsers(_: any, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()
            res.json({
                status: 'success',
                data: users
            })
        } catch (e) {
            res.json({
                status: 'error',
                message: JSON.stringify(e)
            })
        }
    }

    async getUser(req: express.Request, res: express.Response): Promise<void> {
        try {

            const userId = req.params.id

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                res.status(400).send()
                return
            }

            await UserModel.findById(userId, (error: Error | null, user: UserModelDocumentType) => {

                if (!user) {
                    res.status(404).send('Пользователь не найден.')
                    return
                } else if (error) {
                    res.status(500).send()
                    return
                } else {
                    res.json({
                        status: 'success',
                        data: user
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

    async createNewUser(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400).json({
                    status: 'error',
                    errors: errors.array()
                })
                return
            }

            const data: UserModelType = {
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(req.body.email + process.env.SECRET_KEY || Math.random().toString()),
                confirmed: false
            }

            const user = await UserModel.findOne({ email: data.email }).exec()

            if (user) {
                res.status(400).json({
                    status: 'error',
                    message: 'Пользователь с таким email уже зарегистрирован'
                })
                return
            }

            await UserModel.create(data, (error: Error | null, result: UserModelDocumentType) => {
                if (error) {
                    res.status(500).json({
                        status: 'error',
                        message: error
                    })
                    return
                } else {
                    sendMail({
                            emailFrom: 'admin@twitter1337.com',
                            emailTo: data.email,
                            subject: 'Подтверждение почты',
                            html: `
                                    <div style="padding: 15px 15px">
                                        Чтобы подтвердить, перейдите <a href="http://localhost:${process.env.PORT || 6666}/auth/verify?hash=${data.confirmHash}">по этой ссылке</a>
                                    </div>
            `
                        },
                        (error: Error | null) => {
                            if (error) {
                                res.status(500).json({
                                    status: 'error',
                                    message: error
                                })
                            } else {
                                res.status(201).json({
                                    status: 'success',
                                    data: result
                                })
                            }
                        })
                }
            })
        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(e)
            })
        }
    }

    async verifyUser(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash

            if (!hash) {
                res.status(400).send('Не указан идентификатор подтверждения.')
                return
            }

            await UserModel.findOne({ confirmHash: hash.toString() }, (error: Error | null, user: UserModelDocumentType) => {
                if (!user) {
                    res.status(400).send('Пользователь не найден.')
                    return
                } else if (error) {
                    res.status(400).send('Произошла ошибка.')
                    return
                } else {
                    if (user.confirmed !== true) {
                        user.confirmed = true
                        user.save()
                        res.send('Пользователь подтверждён.')
                    } else {
                        res.send('Пользователь уже подтверждён.')
                    }
                }
            })

        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(e)
            })
        }
    }

    async afterLogin(req: express.Request, res: express.Response) {
        try {

            const user = req.user ? (req.user as UserModelDocumentType).toJSON() : undefined

            res.json({
                status: 'success',
                data: {
                    ...user,
                    token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || 'twitter', { expiresIn: '14 days' })
                }
            })
        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }

    async isAuthorized(req: express.Request, res: express.Response) {
        try {
            const user = req.user ? (req.user as UserModelDocumentType).toJSON() : undefined
            res.json({
                status: 'success',
                data: user
            })
        } catch (e) {
            res.status(500).json({
                status: 'error',
                message: e
            })
        }
    }
}

export const UserController = new UserControllerClass()