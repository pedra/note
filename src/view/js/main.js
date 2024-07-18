const { ipcRenderer } = require('electron')
let contador = 0
window.onload = () => {

	const ping = setInterval(() => {
		ipcRenderer.invoke('ping').then(r => { console.log("Ping: ", r) })
		contador++
		_('#status-msg').innerHTML = 'Ping - ' + contador
	}, 1000)

	ipcRenderer.on('cpu', (e, data) => {
		i = JSON.parse(data)
		_('#status-cpu').innerHTML = `CPU ${i.cpu}%`
		_('#status-mem').innerHTML = `Mem ${i.mem}% - ${i.tmem}GB`
	})

	// mostra ou esconde a barra de controle (para janelas sem frame)
	ipcRenderer.on('menu', (e, show) => {
		console.log('Menu: ', e, show)
		_('#tb-title-bar').classList[show ? 'remove' : 'add']('on')
	})
}

const showMenu = show => ipc.invoke('menu', { window: 'about', show })

const winClose = () => ipc.invoke('close', 'about')

const teste = () => console.log('TESSSSTEEEEE')