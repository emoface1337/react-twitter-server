import { model, Schema, Document } from 'mongoose'

export type UserModelType = {
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
        },
        confirmed: {
            type: Boolean
        },
        confirmHash: {
            required: true,
            type: String
        },
        about: {
            type: String
        },
        website: {
            type: String
        }
    },
    {
        versionKey: false
    }
)

export const UserModel = model<UserModelDocumentType>('User', UserSchema)