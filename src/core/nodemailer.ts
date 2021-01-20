import nodemailer from 'nodemailer'
import SMTPConnection from 'nodemailer/lib/smtp-connection'

const options: SMTPConnection.Options = {
    host: process.env.NODEMAILER_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.NODEMAILER_PORT) || 2525,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
}
export const transport = nodemailer.createTransport(options)