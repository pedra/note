import { __ } from '../lib/utils.mjs'

export default class PageClass {

	pages = {
		login: {
			id: 'pg-login',
			title: 'Login'
		},
		chat: {
			id: 'pg-chat',
			title: 'Chat'
		},
		file: {
			id: 'pg-file',
			title: 'Files'
		},
		user: {
			id: 'pg-user',
			title: 'User'
		}
	}

	menu = "header nav.menu"

	constructor () {
		__(this.menu + ' li', true).forEach(a => a.onclick = e => {
			e.preventDefault
			this.show(e.target.dataset.page)
		})
	}

	show(page) {
		if(this.pages[page] == undefined) return false
		__('.page', true).forEach(a => a.classList.remove('on'))
		__(this.menu + ' li', true).forEach(a => a.classList.remove('on'))

		__('#' + this.pages[page].id).classList.add('on')
		__('[data-page="' + page + '"]').classList.add('on')
	}

}