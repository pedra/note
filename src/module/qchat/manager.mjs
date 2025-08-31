import App from '../../app/app.mjs'

class manager {
	static instance = null

	ICO = App.path.public + '/img/ico/16/w'
	IMG = App.path.public + '/img'
	WIN = null

	constructor() {
		this.#init()
	}

	static getInstance() {
		if (!manager.instance) manager.instance = new manager()
		return manager.instance
	}

	#init () {
		if (!App.windows.get('qchat/index')) {
			this.WIN = App.windows.create('qchat/index', {
				width: 800,
				height: 800,
				minWidth: 400,
				minHeight: 300,
				icon: this.ICO + '/qchat.png',
				show: false,
				parent: App.windows.get('main'),
				webPreferences: {
					nativeWindowOpen: true,
					nodeIntegration: true,
					contextIsolation: false
				}
			})
		}
	}

	async show() {
		//if(!this.WIN) this.init()
		if(this.WIN) this.WIN.show()
	}

	async hide() {
		if (this.WIN) this.WIN.hide()
	}
}

const QchatManager = manager//.getInstance()
export default QchatManager