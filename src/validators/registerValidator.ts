import { body } from 'express-validator'

export const registerValidator = [
    body('email', 'Введите e-mail')
        .isEmail().withMessage('Неверный e-mail')
        .isLength({
            min: 4,
            max: 40
        }).withMessage('Недопустимое количество символов'),

    body('fullname', 'Введите ваше имя')
        .isString()
        .isLength({
            min: 2,
            max: 40
        }).withMessage('Недопустимое количество символов'),

    body('username', 'Введите ваш логин')
        .isString()
        .isLength({
            min: 2,
            max: 40
        }).withMessage('Недопустимое количество символов'),

    body('password', 'Укажите пароль')
        .isString()
        .isLength({
            min: 6
        }).withMessage('Пароль слишком короткий')
        .custom((value, { req }) => {
            if (value !== req.body.password2) {
                throw new Error('Пароли не совпадают')
            } else {
                return value
            }
        })

]