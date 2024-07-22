
const { app } = require('electron')
var router = require('express').Router()
const { tokey } = require(app.Config.path + '/util')
const db = new require('./db')()

/** ERROS
 *  u1: login ou password não informado
 *  u2: login ou password não correspondem
 * 
 */


// Login
router.post('/login', (req, res) => {
    const login = (req.body.login || '').trim()
    const password = (req.body.password || '').trim()

    // Não enviou login ou password
    if (login == '' || password == '') return res.json({ error: 'u1' })

    db.login(login, password, data => {
        if (data.length > 0) {
            r = data[0]
            r.token = tokey()
            r.access++
            db.set({ token: r.token, access: r.access }, r.id, () => res.json(r))
        } else {
            res.json({ error: 'u2' })
        }
    })
})

// Logout the user
router.post('/logout', (req, res) => {
    const id = (req.body.id || 0)
    if (id == 0) return res.json({ error: 'u3' })
    db.set({ token: '', key: '', socket: '' }, id, error => res.json({ error }))
})


// Change user theme... 
router.post('/theme', (req, res) => {
    const theme = (req.body.theme || 'light').trim()
    const id = (req.body.id || 0)
    if (id == 0) return res.json({ error: 'u4' })
    db.set({ theme }, id, error => res.json({ error }))
})


module.exports = router