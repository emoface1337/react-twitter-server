import { transport } from '../core/nodemailer'
import { SentMessageInfo } from 'nodemailer'

type SendMailType = {
    emailFrom: string,
    emailTo: string,
    subject: string,
    html: string,
}

export const sendMail = ({ emailFrom, emailTo, subject, html }: SendMailType, callback?: (error: Error | null, info: SentMessageInfo) => void ) => transport.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: subject,
        html: html
    },
    callback || function (error: Error | null, info: SentMessageInfo) {
        if (error)
            console.log(error)
        else
            console.log(info)
    }
)