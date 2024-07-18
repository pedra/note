import { app, Tray, Menu, ipcMain } from 'electron'
import Windows from './windows.mjs'
import TemplateTray from './templateTray.mjs'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import IpcHandler from './ipchandler.mjs'
//import Cpu from './cpu.mjs'

import User from './db/user.mjs'

class App {
	static instance = null
	tray = null
	path = {
		app: null,
		assets: null,
		view: null,
		db: null
	}
	windows = null
	ipc = null

	constructor() {
		this.path.app = path.resolve(process.env['ELECTRON_ENV'] == 1 ? './src' : './resources/app.asar')
		this.path.view = this.path.app + '/view'
		this.path.assets = path.resolve('./assets')
		this.path.db = this.path.assets + '/db/database.db'	

		this.windows = Windows.getInstance()
		this.ipc = new IpcHandler()
		app.on('ready', (e) => this.init(e));

		if (!app.requestSingleInstanceLock()) app.quit()
		else app.on('second-instance', () => {
			const Window = this.windows.get('main')
			if (Window.isMinimized()) Window.restore()
			Window.show()
			Window.focus()
		})

		app.on('window-all-closed', (e) => this.onWindowAllClosed(e))
		app.on('will-quit', (e) => this.onWillQuit(e)) // Before quit ...
		app.on('quit', (e) => this.onQuit(e))
	}

	static getInstance() {
		if (!App.instance) App.instance = new App()
		return App.instance
	}

	async init(e) {
		this.windows.create('main')
		this.setTray()
		
/*  TODO: Testar User!

	* Carregar (load + loadByEmail) ...
	* Inserir (insert) ...
	* Atualizar (update) ...
	* Deletar (delete) ...
	* Autenticação (login) ...

	✔ TODOS PASSARAM ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
*/

		// const user = new User()

		// const login = await user.login('prbr@ymail.com', '12345678')
		// console.log("\n\n\nLogin: ", login, "\n\n\n")

		// // Insert
		// user.clear()
		// user.set({
		// 	name: 'Priscila dos Santos Valadão',
		// 	level: 200,
		// 	email: 'priscila@email.com',
		// 	password: '123456'
		// })
		// const insert = await user.save()
		// console.log("\n\nInsert: ", insert, "\n\n\n")

		// user.set('level', 33)
		// const update = await user.save()
		// console.log("\n\nUpdate: ", update, "\n\n\n")

		// const load = await user.load(2)
		// console.log("\n\nLoad: ", load, "\n\n\n")

		// const loadByEmail = await user.loadByEmail('prbr@ymail.com')
		// console.log("\n\nLoadByEmail: ", loadByEmail, "\n\n\n")

		// user.load(7)
		// const del = await user.del()
		// console.log("\n\nDelete: ", del, "\n\n\n")

/* 

	TODO: Criar classe Users (plural) e testar. 

	1 - Deve retornar uma array de User
	2 - Ter funções de busca (por nome, level, email) 
	3 - Deve ter busca em campo genérico (campo que ainda não existe nessa tabela USER [future])

*/
	}

	// EVENTS --------------------------------------------------------------------------------------------------------*/
	onWindowAllClosed(e){
		console.log('\nTodas as janelas foram fechadas - window-all-closed\n')
		e.preventDefault()
	}

	onQuit(e){
		console.log("---> Quit!")

		// Destroy Tray
		this.tray.destroy()
	}

	onWillQuit(e) {
		console.log('Antes de fechar tudo - will-quit')
		e.preventDefault()

		// TESTE .... 
		//setTimeout(() => { app.exit() }, 100)
		app.exit()
	}


	// TRAY ----------------------------------------------------------------------------------------------------------*/
	getTray() {
		return this.tray
	}
	setTray() {
		this.tray = new Tray(this.path.view + '/img/tray/icon.png')
		this.tray.setContextMenu(Menu.buildFromTemplate(TemplateTray.getTemplate()))
		this.tray.setToolTip('Título da Aplicação')
		this.tray.on('click', () => this.windows.get('main').show())
		this.tray.on('balloon-click', () => console.log('Clicou no balloon | main.ts:37'))
	}
}

export default App.getInstance()