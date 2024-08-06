/**
 * Interface de controle da página de CHAT com socket
 * @param {Array} config Configuração da aplicação
 * @returns {void} 
 */
const _Chat = function (config) {

    let url = {},
        html = {},
        channel = '',
        socket = null,
        mem_msg = '***',
        qzc = {
            type: 'msg',
            error: false,
            id: '0',
            from: '0',
            to: '0',
            created: '',
            content: {
                text: '',
                attached: 0,
                cite: 0
            }
        },
        me = { id: 0, name: '', avatar: '' },
        to = { id: 0, name: '', avatar: '' },
        loading = true,
        scrollH = 0,
        lowerMsgId = 1,
        firstMsgId = 1,
        amount = 10


    /**
     * Fecha a conexão com o socket
     */
    const hide = () => {
        if (socket != null) socket.close()
        _(html.content).innerHTML = ''
    }

    /**
     * Inicializa o chat (socket, etc)
     * @param {Object} data Objeto contendo os dados do usuário no chat.
     * @returns void
     */
    const init = data => {
        if (data === false) return false

        // Gravando o usuário da conversa 
        to.id = data.id
        to.name = data.name
        to.avatar = data.avatar
        _(html.name).innerHTML = data.name
        _(html.avatar).src = data.avatar

        // Eu (usuário logado)
        me.id = App.Me.get('id')
        me.name = App.Me.get('name')
        me.avatar = App.Me.get('avatar')
        firstMsgId = 1
        lowerMsgId = 1

        if (socket != null) socket.close()
        socket = io() // Criando a conexão MSG

        _(html.send).onclick = send
        _(html.text).onkeypress = function (e) {
            if (e.shiftKey && e.charCode == 13) return true
            if (e.charCode == 13) {
                send()
                return false
            }
        }
        _(html.text).onkeyup = e => {
            if (e.shiftKey && (e.keyCode == 40 || e.keyCode == 38)) {
                _(html.text).innerHTML = mem_msg
            }
        }

        // Emojis Panel
        _(html.emoji).onclick = () => _(html.emojis).classList.add('on')
        _(html.emojis).onclick = e => {
            if (e.target.nodeName == 'SPAN') {
                _(html.text).innerHTML += e.target.innerHTML
            }
            e.currentTarget.classList.remove('on')
        }

        _(html.content).onscroll = onScroll
        socket.on(channel, on)
    }

    /**
     * Recebe e gerencia as mensagens do SOCKET.
     * @param {Object} msg Dados da mensagem 
     * @returns void
     */
    const on = msg => {
        if (msg.type == 'init') {
            _(html.content).innerHTML = ''
            firstMsgId = 1
            lowerMsgId = 1
            return socket.emit(channel, { type: 'initClient', id: me.id, to: to.id })
        }
        if (msg.type == 'list') return msgList(msg.data, true)
        if (msg.type == 'viewed') return msgSetViewed(msg)
        if (msg.type == 'msg') return stamp(msg)
    }

    /**
     * Recebe o aviso de que uma mensagem foi visualizada e 
     * modifica no display do chat daquela mensagem (se estiver carregada)
     * @param {Object} msg Dados da mensagem a ser modificadas
     */
    const msgSetViewed = msg => {
        var s = _(`${html.msg}-${msg.id} ${html.status}`)
        if (s) s.classList.add('viewed')
    }

    /**
     * Envia mensagem digitada pelo usuário.
     * @returns void
     */
    const send = () => {
        var txt = __ttoh(_(html.text).innerText.trim().toString())
        if (txt.length == 2 && txt.charCodeAt(0) > 55356) {
            txt = '<span class="emojis-one">' + txt + '</span>'
        }

        mem_msg = txt // Gravando a última mensagem na memória

        if (txt == '') return false
        _(html.text).innerHTML = ''

        var msg = { ...qzc } // clonando o padrão
        msg.from = me.id
        msg.to = to.id
        msg.content.text = txt
        msg.created = new Date()

        socket.emit(channel, msg)
    }

    /**
     * Recebe a listagem de mensagens e gerencia a exibição
     * @param {Array} data Array de mensagens
     * @param {Boolean} init True se estiver vindo da função INITO
     * @returns void
     */
    const msgList = (data, init) => {
        if (!data || data.length == 0) return false

        for (var i in data) {
            stamp(data[i], true)
        }

        firstMsgId = data[data.length - 1].id

        setTimeout(() => {
            loading = false
        }, 400)

        if (init === true) {
            scrollH = _(html.msg).scrollHeight
            scroll()
        } else {
            _(html.content).scrollTop = parseInt(_(html.content).scrollHeight - scrollH - 100)
            scrollH = _(html.content).scrollHeight
        }
    }

    /**
     * Imprime uma mensagem na corpo do chat
     * @param {Object} msg Dados da mensagem a ser impressa
     * @param {Boolean} before True indica que essa mensagem será colocada ANTES das demais
     */
    const stamp = (msg, before) => {
        if (msg.to == me.id && msg.viewed == null)
            socket.emit(channel, { type: 'viewed', id: msg.id, from: msg.from })

        var e = msg.content.text.indexOf('<span class="emojis-one"') != -1 ? ' emojis-tr' : ''

        var m = `<div class="cht-msg${msg.from == me.id ? ' me' : ''}${e}" id="cht-msg-${msg.id}">
                    <div class="cht-msg-text">${msg.content.text}</div>
                    <div class="cht-msg-data">
                        <span class="cht-date">${(new Date(msg.created)).toLocaleString()}</span>
                        <span class="cht-status${msg.viewed == null ? '' : ' viewed'}">
                            <i class="material-icons">check_circle_outline</i>
                        </span>
                    </div>
                </div>`

        if (before === true) {
            _(html.content).innerHTML = m + _(html.content).innerHTML
        } else {
            _(html.content).innerHTML += m
            scroll()
        }

        setTimeout(() => {
            _(html.msg + '-' + msg.id).classList.add('on')
        }, 10)
    }

    /**
     * Efeito de scroll
     * @param {Number} tm Fator de aceleração do scroll a
     */
    const scroll = (tm) => {
        tm = tm || 0.2
        let c = _(html.content),
            f = c.scrollHeight - c.offsetHeight,
            t = setTimeout(() => {
                if (c.scrollTop < f) {
                    c.scrollTop += 10
                    scroll(tm / (3000 / f))
                } else {
                    clearTimeout(t)
                }
            }, tm)
    }

    /**
     * Observa o scroll até que atinja o TOP: carrega mensagens mais antigas, se tiver.
     * @returns void
     */
    const onScroll = () => {

        if (loading || firstMsgId - lowerMsgId <= 0) return false

        if (_(html.content).scrollTop == 0) {
            _(html.content).innerHTML = '<div class="separator"></div>' + _(html.content).innerHTML
            _(html.loader).classList.remove('hide')

            loading = true // Liga a flag

            __get(`${url.get}/${me.id}/${to.id}/${(firstMsgId - 1)}/${amount}`).then(m => {

                if (m.length == 0) {
                    lowerMsgId = firstMsgId
                    _(html.content).innerHTML =
                        '<div class="chat-final">That\'s all folks!</div>' + _(html.content).innerHTML
                } else {
                    msgList(m)
                }

                _(html.loader).classList.add('hide')
                loading = false
            })
        }
    }

    const construct = () => {
        channel = config.chat.channel
        avatar = config.user.url.avatar
        url = config.chat.url
        html = config.chat.html
    }
    construct()

    return { init, hide }
}