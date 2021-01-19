import express from 'express'
import { UserModel } from '../models/UserModel'
import { validationResult } from 'express-validator'
import { generateMD5 } from '../utils/hashGenerator'

class UserControllerClass {
    async index(_: any, res: express.Response): Promise<void> {
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

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400).json({
                    status: 'error',
                    errors: errors.array()
                })
                return
            }

            const data = {
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                confirm_hash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }

            const user = UserModel.create(data)

            res.json({
                status: 'success',
                data: user
            })

        } catch (e) {
            res.json({
                status: 'error',
                message: JSON.stringify(e)
            })
        }
    }
}

export const UserController = new UserControllerClass()