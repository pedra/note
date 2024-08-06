const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(app.Config.external.db + '/magic.db')
const USER_TABLE = 'user'
const MESSAGE_TABLE = 'message'

module.exports = function () {

    const getMessageById = ($id, cb) => {
        db.all(`
        select 
            m.user_from id, 
            u.name, 
            u.avatar,
            u.token,
            count(m.id) message,
            m.id last,
            m.content

        from ${USER_TABLE} u
        inner join ${MESSAGE_TABLE} m
        on m.user_from = u.id

        where  m.user_to = $id

        group by m.user_from
        order by m.user_from`,
            { $id },
            (e, r) => {
                if (e || r.length == 0) return cb([])

                // Trazendo o campo content de json para objeto
                let msg = []
                r.map(m => {
                    msg.push({
                        id: m.id,
                        name: m.name,
                        avatar: m.avatar,
                        token: m.token,
                        message: m.message,
                        last: m.last,
                        content: JSON.parse(m.content)
                    })
                })
                return cb(msg)
            }
        )
    }


    // Retorna um número de mensagens (amount) a partir de um determinado registro (reg) para trás, 
    // entre o usuário atual (user) e outro usuário indicado (another).
    const msgByUserAndId = ($user, $another, $reg, $amount, cb) => {
        $reg = $reg || 0 // se não for declarado, pega os últimos registros
        $amount = $amount || 10 // se não for declado, retorna 20 registros

        var t = db.all(
            `select id, user_from, user_to, created, viewed, deleted, content
             from ${MESSAGE_TABLE}
             where type="chat"
             and (id <= $reg OR 0 = $reg)
             and ((user_to=$user and user_from=$another) or (user_to=$another and user_from=$user))
             and deleted is null
             order by id desc
             limit $amount`,
            { $user, $another, $reg, $amount },
            (e, r) => {
                if (e || r.length == 0) return cb([])

                // Corrigindo os nomes dos campos from & to, 
                //  e convertendo o campo content para json
                let msg = []
                r.map(m => {
                    msg.push({
                        id: m.id,
                        from: m.user_from,
                        to: m.user_to,
                        created: m.created,
                        viewed: m.viewed,
                        deleted: m.deleted,
                        content: JSON.parse(m.content)
                    })
                })
                return cb(msg)
            }
        )
    }

    const setSocket = (user, to, socket, cb) => {
        var stm = db.prepare(`update ${USER_TABLE} set socket=$socket where id=$user`)
            .run({ $socket: socket, $user: user }, e => cb(e ? 0 : stm.lastID))
    }


    const offSocket = (socket, cb) => {
        var stm = db.prepare(`UPDATE ${USER_TABLE} SET socket=NULL WHERE socket=$socket`)
            .run({ $socket: socket }, e => cb(e ? 0 : stm.lastID))
    }


    const pushMsg = (m, cb) => {
        var stm = db.prepare(`INSERT INTO ${MESSAGE_TABLE} 
			(user_to, user_from, created, type, content) 
			VALUES ($user_to, $user_from, $created, $type, $content)`)
            .run(
                {
                    $user_to: m.to,
                    $user_from: m.from,
                    $created: new Date(),
                    $type: 'chat',
                    $content: JSON.stringify(m.content)
                },
                e => cb(e ? 0 : stm.lastID)
            )
    }

    const popMsg = (user, cb) =>
        db.all('SELECT socket FROM ' + USER_TABLE + ' WHERE id=$user',
            { $user: user },
            (e, r) => cb(!e && r && r[0] ? r[0].socket : false))

    const setParam = (id, param, value, cb) => {
        var stm = db.prepare('UPDATE ' + MESSAGE_TABLE + ' SET ' + param + '=$value WHERE id=$id')
            .run(
                { $value: value, $id: id },
                e => cb(e ? 0 : stm.lastID)
            )
    }

    const getParam = (id, param, cb) =>
        db.all('SELECT id, $param FROM ' + MESSAGE_TABLE + ' WHERE id=$id',
            { $id: id, $param: param },
            (e, r) => cb(e || (r && r.length == 0) ? false : r[0]))

    return {
        getMessageById, msgByUserAndId,
        setSocket, offSocket,
        pushMsg, popMsg,
        setParam, getParam
    }
}