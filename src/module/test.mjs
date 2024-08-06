import { Router } from 'express'
import App from '../app/app.mjs'

const Test = Router()
Test.get('/', (req, res) => {
	App.windows.create('about')

	return res.json({ ok: true })
})


export default Test