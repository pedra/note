const _Storage = function (dtb) {

    dtb = dtb || 'elize'

    let conn = idb.openDB(dtb, 1, {
        upgrade(r) {
            let u = r.createObjectStore('user', {
                keyPath: 'id',
                autoIncrement: true,
            })
            u.createIndex('id', 'id')
            u.createIndex('name', 'name')
        }
    })

    const get = async (k) => (await conn)[!k ? 'getAll' : 'get']('user', k)
    const getAll = async () => (await conn).getAll('user')
    const getAllByIndex = async (i) => (await conn).getAllFromIndex('user', i || 'name')

    const set = async (k, v) => (await conn).put('user', v, k)
    const add = async (d) => (await conn).add('user', d)
    const upd = async d => {
        db = await conn
        if ("undefined" == typeof d.id) return false
        return db.delete('user', d.id).then(() => db.add('user', d))
    }

    const del = async (k) => (await conn).delete('user', k)
    const clear = async () => (await conn).clear('user')
    const keys = async () => (await conn).getAllKeys('user')

    const me = async () => {
        db = await conn
        u = await db.getAllFromIndex('user', 'id')
        return u.find(a => a.auth)
    }

    return { get, getAll, getAllByIndex, set, add, upd, del, clear, keys, me }
}