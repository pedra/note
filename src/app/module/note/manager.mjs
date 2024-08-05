import App from '../../app.mjs'

class manager {
	static instance = null

	ICO = App.path.view + '/img/ico/16/w'
	IMG = App.path.view + '/img'

	constructor() { }

	static getInstance() {
		if (!manager.instance) manager.instance = new manager()
		return manager.instance
	}

	async show() {
		const win = App.windows.get('main')
		win.loadFile(App.path.view + '/html/main.html')
	}
}

const NoteManager = manager.getInstance()
export default NoteManager