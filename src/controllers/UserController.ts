import express from 'express'
import { UserModel } from '../models/UserModel'

class UserController {
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
}

export const UC = new UserController()