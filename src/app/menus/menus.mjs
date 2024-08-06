import { app, Menu, Tray } from 'electron'
import Windows from './../windows.mjs'
import App from './../app.mjs'

export default class Menus {
	static instance = null
	#_menus = {
		menu: null,
		jumplist: null,
		thumbar: [],
		tray: null
	}

	constructor() {}

	static getInstance() {
		if (!Menus.instance) {
			Menus.instance = new Menus()
		}
		return Menus.instance
	}

	// APPLICATION MENU --------------------------------------------------------
	getMenu() { return this.#_menus.menu }

	async loadMenu(template = 'default') {
		try {
			const m = await import(`./menu/${template}.mjs`)
			this.#_menus.menu = Menu.setApplicationMenu(
				Menu.buildFromTemplate(m.default)
			)
			return this.#_menus.menu
		} catch (e) {console.log(e)}
		return false
	}

	// JUMPLIST ----------------------------------------------------------------
	getJumplist() { return this.#_menus.jumplist }

	async loadJumplist(template = 'default') {
		if (process.platform != "win32") return false
		try {
			const m = await import(`./jumplist/${template}.mjs`)
			this.#_menus.jumplist = app.setJumpList(m.default)
			return this.#_menus.jumplist
		} catch (e) {console.log(e)}
		return false
	}

	// THUMBAR -----------------------------------------------------------------
	getThumbar() { return this.#_menus.thumbar }

	async loadThumbar(window = 'main', template = 'default') {
		if (process.platform != "win32") return false
		let a = (Windows.getInstance()).get(window)

		//console.log(a)
		try {
			const m = await import(`./thumbar/${template}.mjs`)
			this.#_menus.thumbar[window] = !a ? false : a.setThumbarButtons(m.default)
			return this.#_menus.thumbar[window]
		} catch (e) {console.log(e)}
		return false
	}

	// TRAY --------------------------------------------------------------------
	getTray() { return this.#_menus.tray }

	async loadTray(
		template = 'default', 
		icon = null, 
		tooltip = null, 
		onClick = null, 
		onBalloon = null
	) {
		try {
			this.#_menus.tray = new Tray(icon || App.path.public + '/img/tray/icon.png')
			
			const m = await import(`./tray/${template}.mjs`)
			this.#_menus.tray.setContextMenu(Menu.buildFromTemplate(m.default))
			this.#_menus.tray.setToolTip(tooltip || 'Note')

			this.#_menus.tray.on('click', 
				() => {
					if (onClick) return onClick
					const win = App.windows.get('main')
					win.show()
					win.center()
				}
			)
			this.#_menus.tray.on('balloon-click', 
				() => {
					if(onBalloon) return onBalloon
					const win = App.windows.get('main')
					win.show()
					win.center()
				}
			)
		} catch (e) {console.log(e)}

		return this.#_menus.tray
	}

}