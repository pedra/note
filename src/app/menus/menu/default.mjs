import { app, shell } from 'electron'
import App from '../../app.mjs'

const menu = [
    {
        label: '&Arquivo',
        submenu: [
            { label: 'Diretório base' },
            { type: 'separator' },
            { label: 'Salvar backup', enabled: false },
            { label: 'Carregar backup', enabled: false },
			{ 
				label: 'Overlay', 
				click: () => {
				App.windows.get('main')
					.setOverlayIcon(App.path.view + '/img/tray/g_old.png', 'Overlay')
				} 
			},
			{
				label: "Thumbar",
				click: () => {
					App.windows.get('main').setThumbarButtons([
						{
							tooltip: 'button1',
							icon: App.path.view + '/img/tray/chat32.png',
							click() { console.log('button1 clicked') }
						}, {
							tooltip: 'button2',
							icon: App.path.view + '/img/tray/globe32.png',
							flags: ['enabled', 'dismissonclick'],
							click() { console.log('button2 clicked.') }
						}
					])
				}
			},
            { label: 'Explorador de arquivo' },
            { type: 'separator' },
            { label: 'Fechar janela', role: 'close' },
            {
                label: 'Desligar a Aplicação',
				icon: App.path.view + '/img/tray/x.png',
                click: () => app.exit()
            }
        ]
    }, {
        label: '&Usuário',
        submenu: [
            { label: 'Criar usuário' },
            { label: 'Resetar senha' },
            { label: 'Bloquear usuário' },
            { type: 'separator' },
            { label: 'Zerar contadores', enabled: false },
            { label: 'Visualizar usuários do sistema' }
        ]
    }, {
        label: '&Mensagens',
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
        label: '&Relatório',
        submenu: [
            { label: 'Mensagens por usuário' },
            { type: 'separator' },
            { label: 'Downloads por usuário' },
            { label: 'Uploads por usuário' },
            { label: 'Login/acessos por usuário' }
        ]
    }, {
        label: '&Electronizer',
        submenu: [
            {
                label: 'Github do projeto',
				icon: App.path.view + '/img/tray/icon16.png',
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