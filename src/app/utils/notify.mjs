import App from '../app.mjs'

export default class Notify {
	static instance = null

	constructor() { }

	static getInstance() {
		if (!Notify.instance) {
			Notify.instance = new Notify()
		}
		return Notify.instance
	}

	show(titulo, mensagem) {
		const tray = App.menus.getTray()

		if (tray) {
			titulo = titulo || 'Notes'
			mensagem = mensagem || 'Hello Word!'

			tray.setImage(App.path.view + '/img/tray/icon.png')

			tray.displayBalloon({
				icon: App.path.view + '/img/tray/icon.png',
				title: titulo,
				content: mensagem
			})

			tray.on('balloon-click', () => {
				App.windows.get('main').show()
			})
		}
	}
}