import { ipcMain } from 'electron'
import Cpu from './cpu.mjs'

export default class IpcHandler {

	cpu = null

	constructor() {
		(this.cpu = new Cpu()).start()

		this.start()
	}

	start() {
		ipcMain.handle('ping', this.ping)
	}



	async ping(e, w) {
		try {
			const f = await fetch('https://aft.freedomee.com/ping')
			const j = await f.json()
			j.id = '123'
			return j
		} catch (e) {
			return false
		}
	}



}