import DB from 'sqlite3'
import App from '../app.mjs'

export default class DBUtils {
	db = null

	constructor() {
		this.db = new DB.Database(App.path.db)
	}

	// Private Query
	async _query(sql, params = {}) {
		return await new Promise((resolve, reject) => {
			this.db.all(sql, params, (err, rows) => {
				if (err) reject(false)
				resolve(rows)
			})
		}).catch(err => false)
	}

	// Private Update
	async _update() {
		const result = await new Promise((resolve, reject) => {

			let set = ''
			const data = { $id: this.fields.id }
			for (let i in this.fields) {
				if (i == 'id') continue
				set += ` ${i}=$${i},`
				data[`$${i}`] = this.fields[i]
			}
			set = set.slice(0, -1)

			const stm = this.db.prepare(`update ${this.table} set ${set} where id = $id`)
				.run(data, (err) => {
					if (err) reject(err)
					resolve(stm.changes)
				})
		}).catch(err => false)
		return result && result > 0
			? this
			: false
	}

	// Private Insert
	async _insert() {
		const result = await new Promise((resolve, reject) => {
			let fields = ''
			let values = ''
			const data = {}
			Object.keys(this.fields).map((v, i) => {
				if (v == 'id') return false
				fields += `${v},`
				values += `$${v},`
				data[`$${v}`] = this.fields[v]
			})
			fields = fields.slice(0, -1)
			values = values.slice(0, -1)

			const stm = this.db.prepare(`insert into ${this.table} (${fields}) values(${values})`)
				.run(data, (err) => {
					if (err) reject(false)
					resolve(stm.lastID)
				})
		}).catch(err => false)

		if (!result) return false
		this.fields.id = result
		return this
	}

	// Delete user (hard delete)
	async _delete(hard = false) {
		// Soft Delete
		if (!hard) {
			this.set('deleted', (new Date()).getTime())
			return await this.save()
		}

		// Hard delete
		if (!this.fields.id) {
			this.clear()
			return false
		}
		const result = await new Promise((resolve, reject) => {
			const stm = this.db.prepare(`delete from ${this.table} where id = $id`)
				.run({ $id: this.fields.id }, (err) => {
					if (err) reject(false)
					resolve(stm.changes)
				})
		}).catch(err => false)

		if (!result || result == 0) return false
		this.clear()
		return this
	}

	async _unDelete() {
		this.set('deleted', null)
		return await this.save()
	}

	// Load User collection by db query
	async _mount(result, TClass) {
		this.list = result.map((v, i) => {
			const u = new TClass()
			u.set(v)
			return u
		})
		return this.list
	}
}