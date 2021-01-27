import { model, Schema, Document } from 'mongoose'

export type UserModelType = {
    _id?: string
    email: string,
    fullname: string,
    username: string,
    password: string,
    confirmHash: string,
    confirmed?: boolean,
    location?: string,
    about?: string,
    website?: string
}

export type UserModelDocumentType = UserModelType & Document

const UserSchema = new Schema<UserModelDocumentType>({
        email: {
            unique: true,
            required: true,
            type: String
        },
        fullname: {
            required: true,
            type: String
        },
        username: {
            unique: true,
            required: true,
            type: String
        },
        location: {
            type: String
        },
        password: {
            required: true,
            type: String
            // select: false
        },
        confirmed: {
            type: Boolean
        },
        confirmHash: {
            required: true,
            type: String
            // select: false
        },
        about: {
            type: String
        },
        website: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

UserSchema.set('toJSON', {
    transform: function (_: any, ret: any) {
        delete ret.password
        delete ret.confirmHash
        return ret
    }
})

export const UserModel = model<UserModelDocumentType>('User', UserSchema)