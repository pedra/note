const path = require('path')
const fs = require('fs')
const { app } = require('electron')
var express = require('express')
const db = new require('./db')()
var router = express.Router()

// Route to download a file -> http://localhost:5000/update/456
router.get('/download_old/:file', (req, res) => {
    res.download(path.join(app.Config.external.file, req.params.file))
})

router.get('/download', (req, res) => {
    if (!req.query.path) res.status(404).send('Required "file" param.')

    // Pegar basepath do banco
    db.getConfig('basepath', r => {
        if (r == []) return res.status(404).send('Basepath not found!')
        let basepath = r[0].basepath,
            file = path.resolve(basepath, req.query.path.replace(/^(\/)|(\/)$/g, ''))

        if (!fs.existsSync(file)) return res.status(404).send('File not exists!')
        res.download(file)
    })
})

router.get('/list', (req, res) => {
    if (!req.query.path) return res.json({ error: 1 })

    let basePath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..')//app.Config.path // TODO: Vem do Banco de Dados 

    const pth = '/' + req.query.path.replace(/^(\/)|(\/)$/g, '')
    const bpth = basePath + pth

    if (!fs.existsSync(bpth)) return res.json({ error: 2 })

    let dt = [{ path: pth }]
    fs.readdirSync(bpth).forEach(i => {
        const st = fs.statSync(bpth + '/' + i)
        const ext = st.isDirectory() ? '_dir_' : path.extname(bpth + '/' + i)

        dt.push({ name: i, size: st.size, date: st.ctime, ext })
    })
    res.json(dt)
})

module.exports = router