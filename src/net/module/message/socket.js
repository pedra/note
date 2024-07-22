/**
 * Sockets manager
 */
const { app } = require('electron')
const { Server } = require("socket.io")
const db = require('./db')()
const channel = app.Config.net.socket.channel

module.exports = () => {
    let io

    /**
     * Inicia o socket
     * @param {Object} server Um servidor iniciados
     */
    this.listen = (server) => {

        io = new Server(server)

        io.on('connection', socket => {
            var userId = socket.id

            this.userOn(socket)
            socket.on(channel, (m) => this.message(socket, m))
            socket.on('disconnect', (socket) => this.userOff(userId))
        })
    }

    /**
     * Emite a informação sobre um usuário conectado
     * @param {Object} socket 
     * @returns void
     */
    this.userOn = (socket) => socket.emit(channel, { type: 'init', id: socket.id })

    /**
     * Gerenciamento das mensagens recebidas pelo servidor socket
     * @param {Object} socket 
     * @param {Object} m A mensagem recebida
     */
    this.message = (socket, m) => {

        switch (m.type) {
            case 'initClient': // inicializando um usuário e enviando as últimas mensagens 
                db.setSocket(m.id, m.to, socket.id, e => {
                    db.msgByUserAndId(m.id, m.to, null, null,
                        r => io.to(socket.id).emit(channel, { type: 'list', data: r }))
                })
                break

            case 'viewed': // Confirmação de visualização
                m['date'] = new Date()
                db.setParam(m.id, 'viewed', m.date, () => null);
                db.popMsg(m.from, s => s !== false ? io.to(s).emit(channel, m) : false)
                break

            default: // Registrando mensagem no DB e enviando
                db.pushMsg(m, id => {
                    if (id != 0) {
                        m.id = id
                        db.popMsg(m.to, s => {
                            io.to(socket.id).emit(channel, m)
                            if (s !== false) io.to(s).emit(channel, m)
                        })
                    }
                })
        }
    }

    /**
     * Usuário desconectado
     * @param {String} userId Id do usuário desconectados
     * @returns void
     */
    this.userOff = userId => db.offSocket(userId, () => null)

    return this
}