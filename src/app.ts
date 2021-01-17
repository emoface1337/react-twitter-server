import express from 'express'

const app = express()
const port = 6666

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello')
})

app.listen(port, () => {
    return console.log(`server is listening on ${port}`)
})
