import DBUtils from './dbutils.mjs'

class Item extends DBUtils {
	table = 'config'
	fields = {
		id: null,
		name: null,
		value: null, 
		_default: null
	}

	constructor(
		id = null
	) {
		super()
		this.fields.id = id
	}

	// Get value
	get() {
		return this.fields.value
	}

	// Set value
	set(value, save = true) {
		if ("object" == typeof value) {
			for (let i in this.fields) {
				if (value[i]) this.fields[i] = value[i]
			}
			return this
		}
		this.fields.value = value
		return save ? this.save() : this
	}

	// Reset to default value
	async reset() {
		this.fields.value = this.fields._default
		return this.save()
	}

	// Save (update|insert) after set this.fields
	async save() {
		return await (this.fields.id ? this._update() : this._insert())
	}
}

export class Config extends DBUtils {
    
	static instance = null
	table = 'config'
	list = []

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

		if(res === false) return false
		await this._mount(res, Item)
		return this
	}

	static getInstance() {
		if (Config.instance == null) 
			Config.instance = new Config()
		return Config.instance
	}

	getItem(param = false) {
		if(!param) return this.list
		return this.list.filter(i => i.fields.name == param)[0] || false
	}

    get(param) {
		let o = this.list.filter(i => i.fields.name == param)
		return o.length == 0 ? null : o[0].get()
    }

	set(param, value) {
		this.list.map(i => i.fields.name == param ? i.set(value) : null)
		return this
	}

	async save (param = false) {
		if (!param) return this.list.map(async (i) => await i.save())
		return this.list.map(async i => i.fields.name == param ? await i.save() : null)
	}
}