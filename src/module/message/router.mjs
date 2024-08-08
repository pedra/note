import { Router } from "express"

const Msg = Router()

Msg.get('/', (req, res) => {
    res.send('msg::index')
})


export default Msg