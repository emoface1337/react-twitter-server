import { model, Schema, Document } from 'mongoose'

export type TweetModelType = {
    _id?: string
    text: string
    user: string | undefined
}

export type TweetModelDocumentType = TweetModelType & Document

const TweetSchema = new Schema<TweetModelDocumentType>({
        text: {
            required: true,
            type: String,
            maxlength: 280
        },
        user: {
            required: true,
            ref: 'User',
            type: Schema.Types.ObjectId
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

// TweetSchema.set('toJSON', {
//     transform: function (_: any, ret: any) {
//         delete ret.password
//         delete ret.confirmHash
//         return ret
//     }
// })

export const TweetModel = model<TweetModelDocumentType>('Tweet', TweetSchema)