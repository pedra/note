import DB from 'sqlite3'
import App from '../app.mjs'


export default class User {
	fields = {
		id: null,
		name: null,
		email: null,
		password: null,
		level: null,
	}
	db = null

	constructor(
		id = null
	) {
		this.fields.id = id
		this.db = new DB.Database(App.path.db)
	}

	// Public Get Field(s)
	get(field = false) {
		if(field === false) return this.fields
		return this.fields[field] 
			? this.fields[field]
			: false
	}

	// Public Set field(s) - return this | false
	set(field, val) {
		if("object" == typeof field) {
			for(let i in this.fields) {
				if(field[i]) this.fields[i] = field[i]
			}
			return this
		}
		if(!this.fields[field]) return false
		this.fields[field] = val
		return this
	}

	// Clear user data
	clear() {
		for(let i in this.fields) this.fields[i] = null
		return this
	}

	// Load user (optional >> by id)
	async load(id = null) {
		if(id) this.fields.id = parseInt(id)
		return await this.#query("select * from user where id = $id", { $id: this.fields.id })
	}

	// Load user by email
	async loadByEmail(email) {
		if (email && "string" == typeof email && email.length > 6) this.fields.email = email
		return await this.#query("select * from user where email = $email", { $email: this.fields.email })
	}

	// Save (update|insert) after set this.fields
	async save() {
		return await (this.fields.id ? this.#_update() : this.#_insert())
	}

	// Login with email and password
	async login(email, password) {
		return await this.#query(
			"select * from user where email = $email and password = $password", 
			{ $email: email, $password: password })
	}

	// Delete this user...
	async del() {
		if(!this.fields.id) {
			this.clear()
			return false
		}
		const result = await new Promise((resolve, reject) => {
			const stm = this.db.prepare("delete from user where id = $id")
				.run({ $id: this.fields.id }, (err) => {
					if (err) reject(false)
					resolve(stm.changes)
				})
		}).catch(err => false)

		if(!result || result == 0) return false
		this.clear()
		return this
	}


	// ---------------------------------------------------------[ PRIVATES ]----

	// Private Query
	async #query(sql, params = {}) {
		const result = await new Promise((resolve, reject) => {
			this.db.all(sql, params, (err, rows) => {
				if (err) reject(false)
				resolve(rows)
			})
		}).catch(err => false)

		if(!result) return false
		this.clear()
		this.set(result[0])
		return this
	}

	// Private Update
	async #_update() {
		const result = await new Promise((resolve, reject) => {

			let set = ''
			const data = { $id: this.fields.id }
			for (let i in this.fields) {
				if (i == 'id') continue
				set += ` ${i}=$${i},`
				data[`$${i}`] = this.fields[i]
			}
			set = set.slice(0, -1)

			const stm = this.db.prepare(`update user set ${set} where id = $id`)
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
	async #_insert() {
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

			const stm = this.db.prepare(`insert into user (${fields}) values(${values})`)
				.run(data, (err) => {
					if (err) reject(false)
					resolve(stm.lastID)
				})
		}).catch(err => false)

		if (!result) return false
		this.fields.id = result
		return this
	}
}