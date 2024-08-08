import { Router } from "express"
import Note from './note/router.mjs'
import Msg from './message/router.mjs'

const router = Router()

router.use('/note', Note)
router.use('/msg', Msg)


export default router