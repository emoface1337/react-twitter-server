import express from 'express'

const server = express()
const port = 6666

server.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello')
})

server.listen(port, (): void => {
    return console.log(`server is listening on ${port}`)
})
