import { app } from 'electron'
import { autoUpdater } from 'electron-updater'
import { Notify } from './notify'


export default class Updater {

	static instance = null
    constructor() {
        this.UpTimer = null
        this.autoUpdater = null
    }

	static getInstance() {
		if (!Updater.instance) {
			Updater.instance = new Updater()
		}
		return Updater.instance
	}
}

/* TODO: Create this controller

	Old reference script... 👇

*/

// module.exports = function () {

//     // Se estiver em modo de desenvolvimento
//     if (process.env.ELECTRON_ENV == 1) return { UpTimer: false, autoUpdater: false, }

//     // Checa por update na inicialização do aplicativo
//     autoUpdater.checkForUpdatesAndNotify()
//     let Window = app.Window.get('main')

//     // Checa por update a cada 3 minutos (60s * 3 * 1000 = 180.000) - 10 minutos em produção (600.000)
//     let UpTimer = setInterval(() => {
//         autoUpdater.checkForUpdatesAndNotify()
//         //Window.webContents.send('message', 'checkUpdate - 3 minutos')
//     }, 180000) // 3 minutos = 3 x 60 x 1000ms


//     autoUpdater.on('checking-for-update', () => {
//         console.log('Updater: checking-for-update')
//         //Window.webContents.send('message', 'Checking for update...')
//     })

//     autoUpdater.on('update-available', (info) => {
//         //Window.webContents.send('message', 'Update available.')
//         Notify('Nova Versão Disponível!', 'Notificarei quando estiver pronta para ser instalada.')
//     })

//     autoUpdater.on('update-not-available', (info) => {
//         console.log('Updater: update-not-available')
//         //Window.webContents.send('message', 'Update not available.')
//     })

//     autoUpdater.on('error', (err) => {
//         //Window.webContents.send('message', 'Error in auto-updater. ' + err)
//     })

//     autoUpdater.on('download-progress', (progressObj) => {
//         let log_message = "Download speed: " + progressObj.bytesPerSecond
//         log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
//         log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
//         //Window.webContents.send('message', log_message)
//         //Window.setProgressBar(parseFloat(progressObj.percent / 100))
//     })

//     autoUpdater.on('update-downloaded', (info) => {
//         console.log('Updater: update-downloaded')
//         //Window.webContents.send('message', 'Update downloaded')
//         //Window.setProgressBar(-1)

//         Notify('Pronto para Atualização?!', 'Vou reiniciar e instalar a nova versão agora.')
//         setTimeout(() => autoUpdater.quitAndInstall(), 10000)
//     })

//     return { UpTimer, autoUpdater }
// }