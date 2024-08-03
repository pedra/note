import { app, shell, BrowserWindow } from 'electron'
import App from '../../app.mjs'
import Notify from '../../utils/notify.mjs'
let modal = ''


const menu = [
	{
        label: 'Abrir Note',
        icon: App.path.view + '/img/tray/icon16.png',
		click: () => {
			const win = App.windows.get('main')
			win.show()
			win.center()
		}
    }, {
        label: 'Site da Aplicação',
        icon: App.path.view + '/img/tray/h.png',
        click: () => shell.openExternal('https://billrocha.netlify.app')
    }, {
        label: 'Chat (status)',
        icon: App.path.view + '/img/tray/a.png',
        title: 'Status de visualização do usuário',
        type: 'submenu',
        submenu: [
            {
                label: 'Ativo',
                icon: App.path.view + '/img/tray/on.png',
                enabled: true,
                click: () => (new Notify).show('Status do Chat', "O chat está desativado nessa versão!")
            }, {
                label: 'Ocupado',
                icon: App.path.view + '/img/tray/no.png',
                enabled: true,
                click: () => (new Notify).show('Status do Chat', 'O chat está desativado nessa versão!')
            }, {
                type: 'separator'
            }, {
                label: 'Desativado',
                icon: App.path.view + '/img/tray/off.png',
                enabled: true,
                click: () => (new Notify).show('Status do Chat', 'O chat está desativado nessa versão!')
            }
        ]
    }, {
        type: 'separator'
    }, {
        label: 'About',
        click: () => App.windows.create('about', { frame: false, maxWidth: 1920, maxHeight: 1080 }).show()
    }, {
        label: 'Fechar a janela "About"',
        click: () => {
            var about = App.windows.get('about')
            about && about.destroy()
        }
    }, {
        label: 'TESTE',
        click: () => {
            let w = App.windows.get('main')
            if (w) {
                w.setOverlayIcon(App.path.view + '/img/tray/on.png', 'Description for overlay')
                App.menus.loadThumbar('main')
                modal = w.openModal('https://billrocha.netlify.com', { frame: false, width: 360 })
            }
        }
    }, {
        label: 'Fechar modal',
        click: () => {
            let w = App.windows.get('main')
            if (w) w.closeModal(modal)
        }
    }, {
        label: 'GetWindow',
        click: () => {

            let w = App.windows.get('main')

            console.log('Id do Main: ', w.id)
            let b = BrowserWindow.fromId(w.id)
            console.log('Browser formId ', b)
        }
    }, {
        label: 'Clear all windows',
        click: () => App.windows.clear()
    }, {
        label: 'Desconectar (logout)',
        icon: App.path.view + '/img/tray/l.png',
        click: () => {
            let win = App.windows.get('main')
            win.webContents.send('logout', true)
            win.show()
        }
    }, {
        type: 'separator'
    }, {
        label: 'Sair e fechar',
        icon: App.path.view + '/img/tray/x.png',
        click: () => {
            App.windows.clear()
            app.quit()
        }
    }
]

export default menu