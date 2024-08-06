const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(app.Config.external.db + '/magic.db')
const USER_TABLE = 'user'

module.exports = function () {

    // Verifica login + password
    const login = ($login, $password, cb) =>
        db.all(`select access,avatar,download,id,key,level,name,theme,token,upload
        from ${USER_TABLE} 
        where login=$login and password=$password`,
            { $login, $password },
            (e, r) => cb(e ? [] : r)
        )

    /** Set colum/param
     *  param = {param: value, pn: vn ...}
     */
    const set = (param, $id, cb) => {
        if (param.constructor !== Object) return cb(true)
        let params = '', values = { $id }

        Object.keys(param).forEach(p => {
            params += p + '=$' + p + ','
            values['$' + p] = param[p]
        })
        params = params.replace(/(,)$/g, '')//retira a última vírgula

        db.run(`update ${USER_TABLE} set ${params} where id=$id`,
            values,
            e => cb(e ? true : false)
        )
    }

    /** Get colum/param
     * param = ['param', 'pn' ...]
     */
    const get = (param, $id, cb) => {
        if (!Array.isArray(param)) param = [param]
        db.all(`select ${param.toString()} from ${USER_TABLE} where id=$id`,
            { $id },
            (e, r) => cb(e ? [] : r)
        )
    }

    return {
        set, get,
        login
    }
}