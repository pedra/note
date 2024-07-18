import DBUtils from './dbutils.mjs'

export class User extends DBUtils {
	fields = {
		id: null,
		name: null,
		email: null,
		password: null,
		level: null,
		deleted: null,
		status: null
	}

	table = 'user'

	constructor(
		id = null
	) {
		super()
		this.fields.id = id
	}

	// Public Get Field(s)
	get(field = false) {
		if(field === false) return this.fields
		return this.fields[field] 
			? this.fields[field]
			: false
	}

	// Public Set field(s) - return this | false
	set(field, val, clear = false) {
		if(clear) this.clear()

		if("object" == typeof field) {
			for(let i in this.fields) {
				if(field[i]) this.fields[i] = field[i]
			}
			return this
		}
		if (!this.fields.hasOwnProperty(field)) return false
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
		const res = await this._query(`select * from ${this.table} where id = $id`, { $id: this.fields.id })

		return res === false 
			? false 
			: this.set(res[0], null, true)
	}

	// Load user by email
	async loadByEmail(email) {
		if (email && "string" == typeof email && email.length > 6) this.fields.email = email
		const res = await this._query(`select * from ${this.table} where email = $email`, { $email: this.fields.email })

		return res === false
			? false
			: this.set(res[0], null, true)
	}

	// Save (update|insert) after set this.fields
	async save() {
		return await (this.fields.id ? this._update() : this._insert())
	}

	// Login with email and password
	async login(email, password) {
		const res = await this._query(
			`select * from ${this.table} where email = $email and password = $password`, 
			{ $email: email, $password: password })
		return res === false
			? false
			: this.set(res[0], null, true)
	}

	async delete(hard = false){
		return this._delete(hard)
	}

	async unDelete(){
		return this._unDelete()
	}

}

export class Users extends DBUtils {
	list = []
	table = 'user'

	constructor() {
		super()
	}

	async load() {
		const res = await new Promise((resolve, reject) => {
			this.db.all(`select * from ${this.table}`, (err, rows) => {
				if (err) reject(false)
				resolve(rows)
			})
		}).catch(err => false)

		return res === false ? false : this._mount(res, User)
	}

	async search (query, where = false) {
		if (!Array.isArray(where) || 
			where.length < 1) where = ['name', 'email']
		where = 'where ' + (where.join(' like $query or ') + ' like $query')

		const res = await this._query(
			`select * from ${this.table} ${where}`, { $query: `%${query}%` })
		return res === false ? false : this._mount(res, User)
	}
}

