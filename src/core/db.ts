import mongoose from 'mongoose'

mongoose.connect(`mongodb+srv://userface:${process.env.DB_PASSWORD}@cluster0.cdzyo.mongodb.net/${process.env.DB_NANE}>?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(r => console.log('connected to MongoDB'))

const db = mongoose.connection

db.on('error', console.log.bind(console, 'connection error to MongoDB'))

export { db, mongoose }





