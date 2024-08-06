const path = require('path')
const { app } = require('electron')
var router = require('express').Router()
const db = new require('./db')()



router.get('/list/:id', (req, res) => {
    const id = req.params.id || false
    if (!id) return res.json({ error: 'm5' })

    db.getMessageById(id, msg => res.json(msg))
})

router.get('/get/(:from)/(:another)/(:reg)/(:amount)', (req, res) =>
    db.msgByUserAndId(
        parseInt(req.params.from),
        parseInt(req.params.another),
        parseInt(req.params.reg),
        parseInt(req.params.amount),
        (r) => res.json(r)
    )
)



module.exports = router