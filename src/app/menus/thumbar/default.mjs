
import { app, shell } from 'electron'
import App from '../../app.mjs'

const menu = [
    {
        label: 'Play',
        tooltip: 'button1',
        icon: App.path.view + '/img/tray/icon16.png',
        click() { console.log('button1 clicked') }
    }, {
        tooltip: 'button2',
        icon: App.path.view + '/img/tray/g_old.png',
        click() { console.log('button2 clicked.') }
    }
]

export default menu