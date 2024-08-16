import path from 'node:path'
import { app, globalShortcut, screen } from 'electron'
import { Config } from './db/config.mjs'
import Windows from './windows.mjs'
import Menus from './menus/menus.mjs'
import LAN from './lan.mjs'
import Ipc from './ipc.mjs'

class App {
	static instance = null
	tray = null
	path = {
		app: null,
		assets: null,
		view: null,
		db: null,
		module: null,
		public: null,
		page: null
	}
	config = null
	windows = null
	menus = null
	lan = null
	ipc = null
	subscription = {
		windowAllClosed: [],
		quit: [],
		willQuit: []
	}

	constructor() {
		this.path.app = path.resolve(process.env['ELECTRON_ENV'] == 1 ? './src' : './resources/app.asar')
		this.path.module = this.path.app + '/module'
		this.path.public = this.path.app + '/public'
		this.path.page = this.path.app + '/app/page'

		this.path.view = this.path.app + '/view'
		this.path.assets = path.resolve('./assets')
		this.path.db = this.path.assets + '/db/database.db'

		this.windows = Windows.getInstance()
		this.menus = Menus.getInstance()
		this.lan = LAN.getInstance()
		this.ipc = new Ipc()

		if (!app.requestSingleInstanceLock()) app.quit()
		else app.on('second-instance', () => {
			const Window = this.windows.get('main')
			if (Window.isMinimized()) Window.restore()
			Window.show()
			Window.focus()
		})

		app.on('ready', (e) => this.init(e))
		app.on('window-all-closed', (e) => this.onWindowAllClosed(e))
		app.on('will-quit', (e) => this.onWillQuit(e)) // Before quit ...
		app.on('quit', (e) => this.onQuit(e))
	}

	static getInstance() {
		if (!App.instance) App.instance = new App()
		return App.instance
	}

	async init(e) {
		this.config = await (Config.getInstance()).load()
		this.lan.init().start()
		this.windows.create('main')

		// Menus
		this.menus.loadTray()
		this.menus.loadMenu()
		this.menus.loadJumplist()
		this.menus.loadThumbar('main')
		/**
		 * ATT: quando abre a janela na inicialização, a Thumbar funciona.
		 * Ao fechar a janela e reabri-la, a Thumbar desaparece (teria que chamar novamente?!)
		 * Por outro lado, a Jumplist funcionou de forma invertida.
		 * 
		 * TODO: Testar...
		 */

		// Registra atalho global CTRL + ALT + SPACE
		globalShortcut.register('Alt+CmdOrCtrl+Space', () => {
			let cursor = screen.getCursorScreenPoint()
			let x = cursor.x
			let y = cursor.y

			let display = screen.getPrimaryDisplay()
			let w = display.workAreaSize.width
			let h = display.workAreaSize.height

			const win = this.windows.get('main')
			const [width = 400, height = 300] = win.getSize()
			if (x >= w - width) x = w - width
			if (y >= (h - height)) y = h - height
			if (y < 30) y = 40

			win.setSize(width, height)
			win.setPosition(x, y)
			win.show()
			win.focus()
		})
	}

	// Todas as janelas foram fechadas - window-all-closed
	onWindowAllClosed(e) {
		e.preventDefault()
		this.subscription.windowAllClosed.forEach(a => a.action(e))
	}

	// Quit application signal
	onQuit(e) {
		this.menus.getTray().destroy() // Destroy Tray
		this.subscription.quit.forEach(a => a.action(e))
	}

	// Antes de fechar tudo - will-quit
	onWillQuit(e) {
		e.preventDefault()
		this.subscription.willQuit.forEach(a => a.action(e))

		// Additional tasks before leaving...here!
		app.exit()
	}

	// Subscribe an event to 
	subscribe(event, name, action) {
		const a = {name, action}
		this.subscription[event].push(a)
	}

	// Unsubscribe an event
	unSubscribe(event, name) {
		this.subscription[event] = this.subscription[event].filter(b => b.name != name)
	}
}

export default App.getInstance()