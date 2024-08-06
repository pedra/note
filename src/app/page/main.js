const { ipcRenderer } = require('electron')
let contador = 0

const _ = id => document.querySelector(id)
//window.onload = () => {

	// const ping = setInterval(() => {
	// 	ipcRenderer.invoke('ping').then(r => { console.log("Ping: ", r) })
	// 	contador++
	// 	_('#status-msg').innerHTML = 'Ping - ' + contador
	// }, 1000)

	ipcRenderer.on('cpu', (e, data) => {
		let i = JSON.parse(data)
		_('#status-cpu').innerHTML = `CPU ${i.cpu}%`
		_('#status-mem').innerHTML = `Mem ${i.mem}% - ${i.tmem}GB`
	})

	// mostra ou esconde a barra de controle (para janelas sem frame)
	ipcRenderer.on('menu', (e, show) => {
		console.log('Menu: ', e, show)
		_('#tb-title-bar').classList[show ? 'remove' : 'add']('on')
	})

	_('#search').focus()
	setTimeout(() => _('#search').focus(), 200)
//}

window.showMenu = show => ipcRenderer.invoke('menu', { window: 'about', show }) // ?!?!
window.winClose = () => ipcRenderer.invoke('close', 'main')
window.appExit = () => ipcRenderer.invoke('appExit')
window.wins = () => {
	__report('Carregando janelas...', true, 1000000000)
	ipcRenderer.invoke('wins')
}

console.log('CARREGOU!')