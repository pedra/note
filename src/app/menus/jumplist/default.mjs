import { app } from 'electron'
import App from '../../app.mjs'

const menu = [
    // { 
    //     type: 'custom',
    //     name: 'Recent Projects',
    //     items: [
	// Só funciona se o "path/arquivo alvo" for registrado para ser manipulado por este programa
	// 		{ 
	// 			type: 'file',
	// 			name: 'Notes',
	// 			program: 'notepad.exe', 
	// 			path: 'D:\\Projetos\\electronizer_to_skelf\\note\\debug.txt' 
	// 		},{ 
	//			type: 'file', 
	//			path: 'D:\\Projetos\\electronizer_to_skelf\\note\\README.md' 
	//		}
    //     ]
    // },
    {
		type: 'custom',
        name: 'Sites',
        items: [
            {
                type: 'task',
                title: 'Site da aplicação',
                program: 'https://billrocha.netlify.app',
                args: '',
                iconPath: App.path.view + '/img/ico/burn.ico',
                iconIndex: 0,
                description: 'Abrir o site da aplicação na rede local'
            },
            {
                type: 'task',
                title: 'Downloads (internet)',
				program: 'https://billrocha.netlify.app',
                args: '',
                iconPath: App.path.view + '/img/ico/icon.ico',
                iconIndex: 0,
                description: 'Abrir navegador na página de downloads do projeto (internet).'
            },{
                type: 'task',
                title: 'Tool A',
                program: process.execPath,
                args: '--run-tool-a',
                icon: process.execPath,
                iconIndex: 0,
                description: 'Runs Tool A'
            },{
                type: 'task',
                title: 'Tool B',
                program: process.execPath,
                args: '--run-tool-b',
                icon: process.execPath,
                iconIndex: 0,
                description: 'Runs Tool B'
            },{
				type: 'task',
				title: 'Notas do Projeto',
				program: 'notepad.exe',
				path: 'D:\\Projetos\\electronizer_to_skelf\\note\\debug.txt',
				args: 'D:\\Projetos\\electronizer_to_skelf\\note\\debug.txt',
				icon: process.execPath,
				iconIndex: 0,
				description: 'Abrir as notas do projeto.'
			}
        ]
    },
    { type: 'frequent' },
    { // has no name and no type so `type` is assumed to be "tasks"
        items: [
            {
                type: 'task',
                title: 'New Project',
                program: process.execPath,
                args: '--new-project',
                description: 'Create a new project.'
            },
            { type: 'separator' },
            {
                type: 'task',
                title: 'Recover Project',
                program: process.execPath,
                args: '--recover-project',
                description: 'Recover Project'
            }
        ]
    }, 
	{ type: 'recent' }
]

export default menu