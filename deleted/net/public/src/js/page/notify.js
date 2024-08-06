

const _Notify = function (config) {
    url = {}
    html = {}
    notifies = []

    const show = () => {
        var h = ''

        if (!notifies || notifies == []) {
            h = 'Nenhuma mensagem nova!'
        } else {
            notifies.map(n => {
                var online = n.token && n.token != ''
                h += `<div class="ntf-card" id="ntf-card-${n.id}" onclick="App.Notify.on(${n.id})">
                    <div class="avatar">
                        <img src="${n.avatar}" alt="avatar">
                    </div>
                    <div class="data">
                        <h2>${n.name}</h2>
                        <div class="props">
                            <span class="status${online ? ' on' : ''}">${online ? 'online' : 'offline'}</span>
                            <span class="notify">${n.message} mensagem(s)</span>
                        </div>
                    </div>
                    <div class="icon${online ? ' on' : ''}">
                        <i class="material-icons">chevron_right</i>
                    </div>
                </div>`
            })
        }

        _(html.container).innerHTML = h
    }

    const on = id => {
        _(html.cardId + id).classList.add('on')
        var n = notifies.filter(n => n.id == id)

        App.Page.show('chat', n = !n ? false : n[0])
    }

    const getMessages = async () => {
        var id = App.Me.get('id')
        notifies = await __get({ url: url.list, param: id })
        show()
    }

    // Array com as últimas notificações
    const get = () => notifies

    const construct = () => {
        url = config.url
        html = config.html
        getMessages()
    }
    construct()

    return { on, get }
}