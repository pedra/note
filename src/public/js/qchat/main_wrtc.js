import { __, __e, __c, __nm, __avt, __avt_all, __delay, __glass, __report, __text, __random, __randomize, __colors } from '../lib/utils.mjs'
import PageClass from './page.mjs'
import WRTCData from './wrtcdata.mjs'
import WRTCAudio from './wrtcaudio.mjs'


class MainClass {

	ME = {
		id: '',
		stream: '',
		name: '',
		color: '',
		avatar: ''
	}

	USERS = []
	ROOMS = false
	SOCKETURL = "http://localhost:9002/"

	fileMaxSize = 1024 * 1024 * 100000 // 10MB

	constructor() {
		__glass()
		this.init().then(() => {
			this.Page = new PageClass()
			__glass(false)
		})
	}

	async init() {
		this.searchDOMElements()
		this.listenDOMElements()

		this.WRTCD = new WRTCData({ filesContainer: this.file, socketURL: this.SOCKETURL }) //window.location.origin + '/' })
		//this.WRTCA = new WRTCAudio({ audiosContainer: this.audio })

		this.subscribes()

		//await this.WRTCD.openOrJoin() // join() to site | open() to ADMIN on Electron
		console.log('JOIN ::: ', this.WRTCD.room, await this.WRTCD.open())
		this.ME.id = this.WRTCD.getUser()

		this.looper()

		this.logged = this.WRTCD.getParticipants().length > 0 // True if has participants
		/* 
		TODO: Checar se um dos participantes é o ADMIN 
		
		*/

		// __('#login-name').value = ''
		// __('#login-name').focus()
		this.logADMIN()
	}

	searchDOMElements() {
		this.send_txt = __('#send-txt')
		this.send_btn = __('#send_btn')
		this.file_btn = __('#file_btn')

		this.audio_btn = __('#audio_btn')
		this.participants_btn = __('#participants_btn')
		this.open_btn = __('#open_btn')
		this.close_btn = __('#close_btn')
		this.join_btn = __('#join_btn')
		this.openOrJoin_btn = __('#openOrJoin_btn')

		this.participants = __('#participants')
		this.audio = __('#audio')
		this.file = __('#file')
		this.chat = __('#chat')

		this.status = __('#status')
	}

	listenDOMElements() {
		__e(() => {
			let fs = new FileSelector()
			fs.selectSingleFile(f => {
				if (!f) return
				if (f.size > this.fileMaxSize) return alert('File size must be less than 10MB.')
				this.WRTCD.sendFile(f)
			})
		}, this.file_btn)

		__e(() => this.sendMessage(), this.send_btn)
		__e((e) => {
			if (e.which == 13 && !e.ctrlKey) this.sendMessage(e)
		}, this.send_txt, 'keyup')

		// Login
		__e((e) => this.login(e), '#login-avatar')
		__e((e) => this.setAvatar(e), '#login-name', 'keyup')


		// RASCUNHO -------------------------------------------------- [ BEGIN ]
		__e(() => console.log('XXX PARTICIPANTS',
			this.WRTCD.getParticipants(),
			this.WRTCD.getRoom(),
			this.WRTCD.getSession()), this.participants_btn)
		__e(() => this.WRTCD.send('isAlive'), this.audio_btn)

		__e(() => {
			this.WRTCD.join(async (j) => {
				if (j) {
					await __delay(1000)
					console.log('Join::: ', j)
					this.WRTCD.send("join", { user: this.ME })
					this.WRTCD.send("isAlive")
				}
			})
		}, this.join_btn)

		__e(async () => {
			const o = await this.WRTCD.open()
			console.log('Open:::', o)
		}, this.open_btn)

		__e(() => console.log('Close:::', this.WRTCD.close()), this.close_btn)
		__e(async () => console.log('OpenOrJoin:::', await this.WRTCD.openOrJoin()), this.openOrJoin_btn)
	}

	subscribes() {

		// Messages
		this.WRTCD.subscribeToMessage('join', (msg) => this.userJoin(msg))
		this.WRTCD.subscribeToMessage('speak', (msg) => this.audioSpeak(msg))
		this.WRTCD.subscribeToMessage('msg', (msg) => this.addMessage(msg))
		this.WRTCD.subscribeToMessage('isAlive', (msg) => this.isAlive(msg))
		this.WRTCD.subscribeToMessage('alive', (msg) => this.whenIsAlive(msg))

		// Events
		// this.WRTCD.subscribeOn('open', (e) => this.onOpen(e))	
		this.WRTCD.subscribeOn('close', (e) => this.onClose(e))
		this.WRTCD.subscribeOn('onFileStart', (e) => this.file_btn.disabled = true)
		this.WRTCD.subscribeOn('onFileEnd', (e) => this.file_btn.disabled = false)
	}

	// Watch dog ----------------------------------------------------- [ BEGIN ]
	/*
	TODO: Fazer duas versões de wrtcdata.mjs/wrtcaudio.mjs & RTCMultiConnection.mjs

		-- Versão para WEB (users/anônimos)
		-- Versão ADMIN (para o Electron)

		A versão para WEB não terá as funções de OPEN & OpenOrJoin.		
		
		A versão ADMIN é completa. Porém, sem utilidade para o JOIN (remover?!).
		Alterar a função Looper, removendo o JOIN automático (linha 155 👇)
		--- começando com: if (this.ROOMS === false && rooms[0].owner != this.ME.id) { ...
	*/
	async looper() {
		const rooms = await this.WRTCD.getRooms()

		if (rooms[0]) {
			if (this.ROOMS === false && rooms[0].owner != this.ME.id) {
				this.WRTCD.join(async (j) => {
					if (j) {
						await __delay(1000)
						this.WRTCD.send("join", { user: this.ME })
						this.WRTCD.send("isAlive")
					}
				})
			}
			this.ROOMS = { owner: rooms[0].owner, ids: rooms[0].participants }
			this.status.innerHTML = 'OWNER: ' + rooms[0].owner + ' | ' + 'ROOMS: ' + rooms[0].participants.length

			rooms[0].participants.forEach(p => {
				if (this.ME.id == p) this.status.innerHTML += '<br>Me: ' + this.ME.name + ' | Id: ' + p
				this.USERS.find(
					u => u.id == p
						? this.status.innerHTML += '<br>User: ' + u.name + ' | Id: ' + p
						: null)
			})
		} else {
			this.status.innerHTML = 'NO ROOMS'
			if (this.ROOMS !== false) {
				this.WRTCD.close()
				this.ROOMS = false
			}
		}

		await __delay(3000)
		this.looper()
	}

	// MESSAGES HANDLERS --------------------------------------------- [ BEGIN ]

	// SEND CHAT MESSAGE 
	sendMessage() {
		const txt = this.send_txt.innerHTML.trim()
		this.send_txt.innerHTML = ''
		if (txt.length < 1) return

		const dt = new Date().getTime()
		const msg = {
			user: this.ME,
			date: dt,
			content: txt
		}
		this.WRTCD.send('msg', msg)
		this.addMessage({ data: msg }, true)
	}

	// ADD MESSAGE ON CHAT VIEW
	async addMessage(msg, local = false) {
		const m = msg.data
		const t = new Date(m?.date ?? new Date())
		const dt = t.toLocaleDateString() + ' ' + t.toLocaleTimeString()

		if (local === false) {
			this.chat.appendChild(__c('div', { class: 'msg' }, `
				<div class="info">
					<svg height="30" width="30" style="background: ${m.user.color}"><text text-anchor="middle" x="50%" y="50%" dy="0.35em" fill="white" font-size="17">${m.user.sigla}</text></svg>
					<div class="data">
						<div class="name" style="color: ${m.user.color}">${m.user.name}</div>
						<div class="date">${dt}</div>
					</div>
				</div>
				<div class="content">${__text(m.content)}</div>`))

		} else {
			this.chat.appendChild(__c('div', { class: 'msg me' }, `<div class="content">${__text(m.content)}</div><div class="date">${dt}<span class="material-symbols-outlined view" id="chat-view-${m.user.id}">visibility</span></div>`))
		}

		await __delay(200)
		this.chat.scroll({ top: this.chat.scrollHeight, behavior: 'smooth' })
	}

	// Response to "isAlive" message
	isAlive() {
		this.WRTCD.send("alive", this.ME)
	}

	// Receive "alive" message from other users and update USERS array
	whenIsAlive(msg) {
		const data = msg.data
		const i = this.USERS.findIndex(a => a.id == data.user)
		if (i == -1) this.USERS.push(data.content)
		else {
			for (let a in this.USERS[i]) {
				this.USERS[i][a] = data.content[a]
			}
		}

		this.showParticipants()
		setTimeout(() => this.WRTCD.send('msg',
			{
				user: this.ME,
				content: 'URNAS da "Sala Secreta" e do ministro "NÓS derrotamos o bolsonarismo"?!? 🤣🤣🤣  Se Moraes viola a Constituição na frente de todos, o que não faz na "Sala Secreta"?  A única solução "está lá fora" - fujam, quem puder!'
			}
		), 1000)
	}

	// OnMessage.type = 'join' (when another user joins)
	userJoin(msg) {
		const data = msg.data
		console.log('USER JOINED', data, this.USERS)
		const i = this.USERS.findIndex(a => a.id == data.user.id)
		if (i == -1) this.USERS.push(data.user)
		else {
			for (let a in this.USERS[i]) {
				this.USERS[i][a] = data.user[a]
			}
		}

		this.showParticipants()
	}

	// MESSAGES HANDLERS --------------------------------------------- [ BEGIN ]

	onClose(e) {
		const i = this.USERS.findIndex(a => a.id == e.userid)
		if (i >= 0) this.USERS.splice(i, 1)
		this.showParticipants()
	}


	// LOGIN & PAGES ------------------------------------------------- [ BEGIN ]

	logADMIN() {
		this.ME.name = 'Bill'
		this.ME.sigla = 'AD'
		this.ME.color = '#000000'

		console.log('Logged: ', this.ME)

		// Áudio play...
		//__('audio', true).forEach(a => a.play())

		this.WRTCD.send("join", { user: this.ME })
		this.WRTCD.send("isAlive")

		this.showParticipants()
	}

	// login(e) {
	// 	if (e.target.nodeName != 'svg' && e.target.nodeName != 'text') return

	// 	let s = null
	// 	if (e.target.nodeName == 'text') s = e.target.parentNode
	// 	else s = e.target
	// 	s.classList = 'avatar'

	// 	const n = __('#login-name').value.trim()
	// 	let name, color
	// 	if (n == '') {
	// 		name = 'Anônimo-' + __random()
	// 		color = __colors('dark')
	// 		color = __colors('dark')[__randomize(color.length)]
	// 	} else {
	// 		name = n
	// 		color = s.style.backgroundColor
	// 	}

	// 	const h = __('.login-form')
	// 	h.innerHTML = ``
	// 	h.appendChild(s)
	// 	h.innerHTML += `<div class="name">${name}</div><div class="spinner light"></div>`
	// 	h.classList.add('loading')

	// 	this.ME.name = name
	// 	this.ME.sigla = s.querySelector('text').innerHTML
	// 	this.ME.color = color

	// 	console.log('Logged: ', this.ME)

	// 	// Áudio play...
	// 	//__('audio', true).forEach(a => a.play())

	// 	this.WRTCD.send("join", { user: this.ME })
	// 	this.WRTCD.send("isAlive")

	// 	this.Page.show('chat')

	// 	this.showParticipants()
	// }

	setAvatar(e) {
		const a = __('#login-avatar')
		let h = ''
		// for (var i = 0; i <= 26; i++) { h += __avt(__nm(e.target.value), 30, i) }

		a.innerHTML = __avt_all(e.target.value) //, 'dark')
	}

	showParticipants() {
		let h = `<div class="item me"><div class="avatar"><svg height="30" width="30" style="background: ${this.ME.color}">
			<text text-anchor="middle" x="50%" y="50%" dy="0.35em" fill="white" font-size="17">${this.ME.sigla}</text>
		</svg></div><div class="name">${this.ME.name}</div><img src="/img/mic/mic_64.png" alt="mic" class="microphone"></div>`

		this.USERS.forEach(u => h += `<div class="item"><div class="avatar"><svg height="30" width="30" style="background: ${u.color}">
			<text text-anchor="middle" x="50%" y="50%" dy="0.35em" fill="white" font-size="17">${u.sigla}</text>
		</svg></div><div class="name">${u.name}</div><img src="/img/mic/mic_64.png" alt="mic" class="microphone"></div>`)
		this.participants.innerHTML = h
		console.log('USERS: ', this.USERS, 'ME: ', this.ME)
	}

	// LOGIN & PAGES ------------------------------------------------- [ END ]
}

const Main = new MainClass()