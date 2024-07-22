/**
 * Application
 */
const App = {
    // Libs ...
    Event: null,
    Storage: null,
    Page: null,
    Bmenu: null,

    // Entities ...
    Me: null,
    Chat: null,

    mount: () => {
        // Iniciando as libs ...
        App.Event = new _Event()
        App.Storage = new _Storage('elize')
        App.Page = new _Page(Config.pages)
        App.Bmenu = new _Bmenu(Config)

        // Entities ...
        App.Me = new _Me(Config)
        App.Chat = new _Chat(Config)
    },

    /**
     * Running this application.
     * @param {Object} e Event page onload
     */
    run: e => {
        App.mount() // Carregando os objetos

        // Instalando service worker ...
        if ('serviceWorker' in navigator) {
            navigator
                .serviceWorker
                .register(location.origin + '/sw.js', { scope: '/' })
                .then(sw => console.log("[SW: Instalado]"))
        } else { console.log("[SW: Não instalado]") }

        // Call page by user login/out ...
        App.Storage.me().then(a =>
            App.Page.show(a && a.id > 0 ? 'profile' : 'auth')
        )
    }
}