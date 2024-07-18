/*
	Electronizer

	Copyright (c) 2021, Bill Rocha
	Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
	Git: https://github.com/pedra/electronizer

 */

import { app, BrowserWindow } from 'electron'
import App from './app.mjs'

class Windows {

	static instance = null
	option = {}
	config = {
		width: 480,
		minWidth: 370,
		maxWidth: 1800,
		height: 720,
		minHeight: 640,
		center: true,
		fullscreenable: false,
		maximizable: false,

		show: false,
		paintWhenInitiallyHidden: false,
		icon: '',

		backgroundColor:'#ffffff',
		frame: true,
		darkTheme: true,
		opacity: 1,

		parent: false,

		webPreferences: {
			nativeWindowOpen: true,
			nodeIntegration: true,
			contextIsolation: false
		}
	}
	wins = []

	downloadUrl = "https://billrocha.netlify.com"

	constructor() {
		
	}


	static getInstance() {
		if (!Windows.instance) {
			Windows.instance = new Windows()
		}
		return Windows.instance
	}

	/**
	 * Returns a window
	 * @param {String} name 
	 * @param {Number} id 
	 * @returns Object Returns the window
	 */
	get(name, id = null) {
		const b = this.wins.find(c => c.name == name || c.id == id)
		if (!b) return false

		const a = BrowserWindow.fromId(b.id)
		if (!a || a.isDestroyed()) return false
		return a
	}

	/**
	 * Create a window or return your previously created instance
	 * @param {String} name Name of the window
	 * @param {Object} option Options
	 * @returns Object Returns the window
	 */
	create(name, option = {}) {
		const b = this.wins.find(c => c.name == name)
		if (b) return false

		const a = this.build(name, option)
		this.wins.push({ name, id: a.id })
		return a
	}

	/**
	 * Destroy the window and remove from janelas list
	 * @param {String} name
	 * @param {Number} id
	 * @returns Boolean
	 */
	destroy(name, id = null) {
		const a = this.get(name, id)
		this.wins.splice(this.wins.findIndex(b => b.name == name || b.name == id), 1)
		if (a) a.destroy()
	}

	/**
	 * Clear and destroy all windows
	 */
	clear() {
		const a = []
		this.wins.map(b => a.push(b.id))
		this.wins = []
		a.map(b => BrowserWindow.fromId(b).destroy())
	}


	opt(key, def = null, origin = false) {
		const o = origin || this.option
		return null == o[key] || undefined == typeof o[key] ? def : o[key]
	}


	build(name, option = {}) {

		this.config.icon = App.path.view + '/img/icon.png' //TEMP DELETE - copy to constructor

		const config = {}
		for (const i in this.config) {
			config[i] = "undefined" == typeof option[i] ? this.config[i] : option[i]
		}

		// novo Browser...
		const win = new BrowserWindow(config)

		// TrumbarButtons - Windows only 
		if (option['tbutton']) win.setThumbarButtons(option['tbutton'])

		// Abre o DevTools - debug only
		if (option['devTools']) win.webContents.openDevTools()

		// Carrega o arquivo HTML da janela.
		win.loadFile(App.path.view + `/html/${name}.html`)

		// Mostra a janela
		win.once('ready-to-show', () => win.show())

		// ao minimizar, vai para o TRAY
		win.on('minimize', e => {
			e.preventDefault()
			win.hide()

			console.log(`\nminimize | (${name}) trabalhando em background!`)
		})

		// Ao fechar a janela ...
		win.on('close', e => {
			e.preventDefault()
			win.hide()

			console.log(`\nclose | (${name}) trabalhando em background!`)
		})

		// Emitido quando a janela é destruída.
		win.on('closed', e => {
			console.log(`\nclosed | A Janela (${name}) foi destruída!`)
			this.destroy(name)
		})

		// Quando mostrar a janela
		win.on('show', e => {
			console.log(`\nshow | (${name}) trabalhando com janela!`)
		})

		// Janela obteve foco
		win.on('focus', () => {
			console.log(`\nfocus | A Janela (${name}) obteve foco.`)
			setTimeout(() => !win.isDestroyed() ? win.flashFrame(false) : false, 1500)
		})

		// Janela perdeu foco
		win.on('blur', () => {
			console.log(`\nblur | A Janela (${name}) perdeu foco.`)
			if (!win.isDestroyed()) {
				win.flashFrame(true)
				setTimeout(() => !win.isDestroyed() ? win.flashFrame(false) : false, 1500)
			}
		})

		// Emitted when an App Command is invoked.
		win.on('app-command', (e, cmd) => console.log(name + ' - Command: ', cmd))


		// Public methods ------------------------------------------------- 

		/**
		 * Open a window modal over this window
		 * @param {String} url target
		 * @param {Object} option BrowserWindow Options
		 * @returns window
		 */
		win.openModal = (url, option = {}) => {
			option.parent = win
			option.modal = true
			option.show = false

			const child = new BrowserWindow(option)
			child.loadURL(url || this.downloadUrl)
			child.once('ready-to-show', () => child.show())
			return child
		}

		/**
		 * Close previous opened modal
		 * @param {Object} modal the modal
		 * @returns void
		 */
		win.closeModal = modal => modal ? modal.destroy() : false

		return win
	}
}

export default Windows

