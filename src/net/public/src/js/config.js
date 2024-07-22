

// Pages
const Config = {
    app: {
        id: 'electronizer',
        version: '0.0.1',
        name: 'Electronizer',
        core: 'http://localhost',
        assets: 'http://localhost',
        html: {
            themestyle: '#themeStyle'
        }
    },

    user: {
        url: {
            login: '/auth/login',
            logout: '/auth/logout',
            avatar: '/msg/u/avatar.png'
        }
    },

    auth: {
        html: {
            logo: '#aut-logo',
            form: '#aut-form',
            login: '#aut-login',
            password: '#aut-password'
        }
    },

    file: {
        url: {
            list: 'file/list',
            download: '/file/download'
        },
        html: {
            fileName: '.file-name',
            menu: '#file-menu',
            menuTitle: '#file-menu-title',
            breadcrumbs: '#file-breadcrumbs',
            list: '#file-list',

        }
    },

    notify: {
        url: {
            list: '/msg/list'
        },
        html: {
            container: '.page.notify .container',
            card: '.ntf-card',
            cardId: '#ntf-card-'

        }
    },

    chat_deleteme: {
        url: {
            chanel: 'qzc',
            url: '/msg/qzm'
        },
        html: {
            content: '#chat-content',
            msg: '#chat-msg',
            loader: '#chat-loader',
            text: '#chat-text',
            send: '#chat-send',
            emojiBtn: '#chat-show-emoji',
            emoji: '#chat-emojis',
            msgId: '#chat-msgid'
        }
    },

    chat: {
        channel: 'qzc',
        url: {
            get: '/msg/get'
        },

        html: {
            name: '#cht-top-bar-name',
            avatar: '#cht-top-bar-avatar',
            content: '#cht-content',
            msg: '#cht-msg',
            loader: '#cht-loader',
            text: '#cht-text',
            send: '#cht-send',
            emojis: '#cht-emojis',
            emoji: '#cht-emoji',
            status: '.cht-status'
        }
    },

    profile: {
        setTheme: '/user/theme',
        html: {
            name: '#pfl-name',
            avatar: '#pfl-avatar',
            theme: '#pfl-theme',
            access: '#pfl-status-access',
            download: '#pfl-status-download',
            upload: '#pfl-status-upload'
        }
    },

    pages: [
        {
            id: false,
            auth: 'auth',
            root: 'profile'
        },
        {
            id: 'empty',
            title: 'Electronizer',
            efect: 'down',
            trail: false,
            bmenu: false,
            auth: false
        }, {
            id: 'auth',
            title: 'Login',
            efect: 'next',
            trail: false,
            bmenu: false,
            auth: false,
            onShow: () => App.Auth = new _Auth(Config.auth),
            onHide: () => App.Auth = null
        }, {
            id: 'profile',
            title: 'Profile',
            efect: 'backward',
            trail: false,
            bmenu: 'profile',
            auth: true,
            onShow: () => App.Profile = new _Profile(Config),
            onHide: () => App.Profile = null
        }, {
            id: 'file',
            title: 'File Manager',
            efect: 'up',
            trail: true,
            bmenu: 'file',
            auth: true,
            onShow: () => App.File = new _File(Config.file),
            onHide: () => App.File = null
        }, {
            id: 'chat',
            title: 'Chat',
            efect: 'back',
            trail: true,
            bmenu: false,
            auth: true,
            onShow: (data) => App.Chat.init(data),
            onHide: () => App.Chat.hide()
        }, {
            id: 'notify',
            title: 'Mensagens',
            efect: 'backward',
            trail: ['profile'],
            bmenu: 'msg',
            auth: true,
            onShow: () => App.Notify = new _Notify(Config.notify),
            onHide: () => App.Notify = null
        }
    ],

    bmenu: [
        { id: 'file', icon: 'folder', title: 'Arquivos', action: () => App.Page.show('file') },
        { id: 'msg', icon: 'chat', title: 'Mensagens', action: () => App.Page.show('notify') },
        { id: 'profile', icon: 'account_box', title: 'Home', action: () => App.Page.show('profile') },
        { id: 'auth', icon: 'exit_to_app', title: 'Sair', action: () => App.Me.logout() }
    ]
}