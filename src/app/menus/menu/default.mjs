import { app, shell, nativeImage } from 'electron'
import App from '../../app.mjs'
import FileManager from '../../module/file/manager.mjs'
import NoteManager from '../../module/note/manager.mjs'

const ICO = App.path.public + '/img/ico/16'
const IMG = App.path.public + '/img'
const menu = [
    {
        label: '&Arquivo',
        submenu: [
			{ label: 'Diretório base', 
				icon: ICO + '/bookmark_manager.png', 
				click: () => FileManager.setBaseDirectory() 
			},
            { type: 'separator' },
			{ label: 'Salvar backup', icon: ICO + '/database.png' },
            { label: 'Carregar backup', enabled: false },
			{ 
				label: 'Overlay', 
				click: () => {
				App.windows.get('main')
					.setOverlayIcon(App.path.public + '/img/tray/g_old.png', 'Overlay')
				} 
			},
			{
				label: "Thumbar",
				click: () => {
					App.windows.get('main').setThumbarButtons([
						{
							tooltip: 'button1',
							icon: App.path.public + '/img/tray/chat32.png',
							click() { console.log('button1 clicked') }
						}, {
							tooltip: 'button2',
							icon: App.path.public + '/img/tray/globe32.png',
							flags: ['enabled', 'dismissonclick'],
							click() { console.log('button2 clicked.') }
						}
					])
				}
			},
			{ label: 'Explorador de arquivo', icon: ICO + '/folder_open.png', click: () => FileManager.show() },
            { type: 'separator' },
			{ label: 'Close', role: 'close', icon: ICO + '/close.png' },
            {
                label: 'Poweroff',
				icon: ICO + '/power_settings_new.png',
                click: () => app.exit()
            }
        ]
    }, {
        label: '&Auth',
        submenu: [
            { label: 'Criar usuário' },
            { label: 'Resetar senha' },
            { label: 'Bloquear usuário' },
            { type: 'separator' },
            { label: 'Zerar contadores', enabled: false },
            { label: 'Visualizar usuários do sistema' }
        ]
    }, {
        label: '&Message',
        submenu: [
            { label: 'Criar mensagem para todos' },
            { label: 'Ver mensagens por usuário' },
            { type: 'separator' },
            { label: 'Enviar mensagem PUSH', enabled: false },
            { label: 'Abrir notificações' },
            { type: 'separator' },
            { label: 'Visualizar chat em tempo real', enabled: false },
            { label: 'Chat em modo espião', enabled: false }
        ]
	}, {
		label: '&Note',
		submenu: [
			{ label: 'Search', icon: ICO + '/search.png', click: () => NoteManager.show() },
			{ type: 'separator' },
			{ label: 'Add node', icon: ICO + '/docs_add_on.png' },
			{ label: 'Add audio annotation', icon: ICO + '/mic.png' },
			{ type: 'separator' },
			{ label: 'Import backup', icon: ICO + '/upload.png' },
			{ label: 'Export backup', icon: ICO + '/download.png' }
		]
	}, {
        label: '&Report',
        submenu: [
            { label: 'Mensagens por usuário', icon: ICO + '/bar_chart.png'  },
            { type: 'separator' },
			{ label: 'Downloads por usuário', icon: ICO + '/earthquake.png'  },
            { label: 'Uploads por usuário', icon: ICO + '/bar_chart.png'  },
            { label: 'Login/acessos por usuário', icon: ICO + '/bar_chart.png'  }
        ]
    }, {
        label: '&Electronizer',
        submenu: [
            {
                label: 'Github do projeto',
				icon: App.path.public + '/img/tray/icon16.png',
                click: async () => await shell.openExternal('https://github.com/pedra/electronizer')
            }, { label: 'Verificar atualização' },
            {
                label: 'Ajuda (online)',
                click: async () => await shell.openExternal('https://github.com/pedra/electronizer#readme')
            },
            { type: 'separator' },
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom', enabled: false },
            { role: 'zoomin', enabled: false },
            { role: 'zoomout', enabled: false },
            { type: 'separator' },
            { role: 'togglefullscreen', enabled: false },
            { role: 'minimize', enabled: false },
            { role: 'close' },
            { type: 'separator' },
            {
                label: 'Sobre o Electronizer',
                click: async () => await shell.openExternal('https://github.com/pedra/electronizer#readmer')
            }
        ]
    }
]

export default menu