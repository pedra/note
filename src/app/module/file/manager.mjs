import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { Config } from '../../db/config.mjs'
import App from '../../app.mjs'

class manager {
	static instance = null

	ICO = App.path.view + '/img/ico/16/w'
	IMG = App.path.view + '/img'

	constructor() {
	}

	static getInstance() {
		if (!manager.instance) manager.instance = new manager()
		return manager.instance
	}

	async setBaseDirectory() {
		const d = await dialog.showOpenDialog({ properties: ['openDirectory'] })
		const baseDir = d.filePaths.length ? d.filePaths[0] : false

		// if (!baseDir) return dialog.showErrorBox('Canceled', 'No directory selected')
		if (!baseDir) {
			const a = await dialog.showMessageBox({
				type: 'error',
				icon: this.IMG + '/icon.png',
				title: 'Canceled',
				message: 'No directory selected!',
				detail: 'You need to select a directory to continue.',
				buttons: ['OK'],
				noLink: false,
				checkboxLabel: 'Return to default value.'
			})

			if (a.checkboxChecked) App.config.getItem('basedir').reset()
		}
		App.config.getItem('basedir').set(baseDir)
	}

	async show () {
		const win = App.windows.get('main')
		win.loadFile(App.path.view + '/html/file.html')
	}
}

const FileManager = manager.getInstance()
export default FileManager