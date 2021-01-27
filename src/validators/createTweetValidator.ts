import { body } from 'express-validator'

export const createTweetValidator = [
    body('text', 'Введите текст твита')
        .isString()
        .isLength({
            max: 280
        }).withMessage('Недопустимое количество символов')
]