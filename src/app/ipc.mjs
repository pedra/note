import { app, ipcMain } from 'electron'
import App from './app.mjs'
import Cpu from './utils/cpu.mjs'

export default class Ipc {

	constructor() {		
		this.start()
	}

	start() {

		// senders ...
		this.cpu()
				// next sender ...


		// receivers ...
		ipcMain.handle('ping', this.ping)
		ipcMain.handle('close', this.close)
		ipcMain.handle('appExit', this.appExit)

		ipcMain.handle('wins', this.wins)
				// Next received event ...
	}

	// Event Sender Handlers -----------------------------------------------------
	cpu() {
		const cpu = new Cpu()
		cpu.start()
	}


	
	// Event receiver handlers --------------------------------------------------
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

	async close(e, w = 'main') {
		const win = App.windows.get(w)
		if(win) win.close()
	}

	async appExit() {
		// console.log('appExit (src/app/ipc.mjs:53)')
		app.exit()
	}

	async wins() {
		console.log('wins: ', App.windows.wins)
	}


}