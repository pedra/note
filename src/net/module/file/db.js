const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(app.Config.external.db + '/magic.db')
const FILE_TABLE = 'file'
const CONFIG_TABLE = 'config'

module.exports = function () {


    /** Set colum/param
     *  param = {param: value, pn: vn ...}
     */
    const setConfig = (param, cb) => {
        if (param.constructor !== Object) return cb(true)
        let params = '', values = {}

        Object.keys(param).forEach(p => {
            params += p + '=$' + p + ','
            values['$' + p] = param[p]
        })
        params = params.replace(/(,)$/g, '')//retira a última vírgula

        db.run(`update ${CONFIG_TABLE} set ${params} where id=1`,
            values,
            e => cb(e ? true : false)
        )
    }

    /** Get colum/param
     * param = ['param', 'pn' ...]
     */
    const getConfig = (param, cb) => {
        if (!Array.isArray(param)) param = [param]
        db.all(`select ${param.toString()} from ${CONFIG_TABLE} where id=1`,
            {},
            (e, r) => cb(e ? [] : r)
        )
    }

    return {
        setConfig, getConfig
    }
}