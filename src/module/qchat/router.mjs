import { Router } from "express"

const Note = Router()

Note.get('/', (req, res) => {
    res.send('index')
})


export default Note