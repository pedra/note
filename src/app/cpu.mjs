
import os from 'os-utils'
import { app, ipcMain } from 'electron'
import Windows from './windows.mjs'

export default class Cpu {

	windows = null
	node = null

	constructor() {
		this.windows = Windows.getInstance()
	}

	start () {
		this.node = setInterval(() => {
			let Main = this.windows.get('main')
			if (!Main || Main.isDestroyed()) return false // Prevent destroyed

			os.cpuUsage(v => {
				let data = {
					cpu: (v * 100).toFixed(2),
					mem: (os.freememPercentage() * 100).toFixed(2),
					tmem: (os.totalmem() / 1024).toFixed(2)
				}

				if (!Main || Main.isDestroyed()) return false
				Main.webContents.send('cpu', JSON.stringify(data))
			})
		}, 1000)
	}

	stop () {
		clearInterval(this.node)
	}
}



