import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTstrategy, ExtractJwt as ExtractJWT } from 'passport-jwt'
import { UserModel, UserModelDocumentType, UserModelType } from '../models/UserModel'
import { generateMD5 } from '../utils/hashGenerator'

passport.initialize()

passport.use(new LocalStrategy(
    async (username, password, done): Promise<void> => {
        await UserModel.findOne({ $or: [{ email: username }, { username }] }, (err: Error | null, user: UserModelDocumentType) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: 'Неверный логин или пароль.' })
            }
            if (!user.confirmed) {
                return done(null, false, { message: 'Пользователь не подтверждён.' })
            }
            if (user.password !== generateMD5(password + process.env.SECRET_KEY)) {
                return done(null, false, { message: 'Неверный логин или пароль.' })
            }
            done(null, user)
        })
    }
))

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.SECRET_KEY || 'twitter',
            jwtFromRequest: ExtractJWT.fromHeader('token')
        },
        async (payload: { data: UserModelType }, done) => {
            UserModel.findById(payload.data._id, (err: Error | null, user: UserModelDocumentType) => {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, { message: 'Неверный логин или пароль.' })
                }
                done(null, user)
            })
        }
    )
)

passport.serializeUser<any, any>((user: UserModelType, done: any) => {
    done(null, user?._id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: Error | null, user: UserModelType) => {
        done(err, user)
    })
})


export { passport }