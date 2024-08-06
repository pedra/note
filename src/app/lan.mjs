import express from 'express'
import systeminformation from 'systeminformation';
import { createServer } from 'node:http'
import cors from 'cors'
import App from '../app/app.mjs'

/**
	TODO: Rescrever tudo para módulo - back & front
 
	  - Use o arquivo /net/module/test.mjs como modelo
	  - Ver arquivo /view/js/_new_utils.js - transpor para /net/public/js/utils.js
		- O acesso ao core do Electron (/app/app.mjs) é feito internamente por "import"

 */
import Test from './module/test.mjs'

export default class LAN {

	static instance = null
	Http = null
	Socket = null
	Express = null

	// ports = [5000, 3000, 8008, 8000, 8080, 80]
	ports = [80]
	port = null
	site = 'http://localhost'
	path = {
		public: null,
		socket: null,
	}
	socket = {
		enable: true,
		channel: 'qzc'
	}

	constructor() { }

	static getInstance() {
		if (!LAN.instance) LAN.instance = new LAN()
		return LAN.instance
	}

	init(
		socket = false
	) {
		this.path.public = App.path.public
		this.path.socket = App.path.module + '/p2p'

		this.socket.enable = socket

		/**
		 * TODO: Implements
		 * 
		 * Socket && Controllers ☝☝ vão para ./app/module/..
		 * 
		 * Socket:		./app/module/p2p/socket.mjs
		 * P2P/WRTC:	./app/module/p2p/wrtc.mjs
		 * 
		 * Controllers: 	./app/module/<module>/lan.mjs
		 * IPC-controllers:	./app/module/<module>ipc.mjs
		 * 	
		 */ 

		return this
	}

	async start() {
		this.Express = express()
		const http = createServer(this.Express)

		this.Express.use(express.static(this.path.public))
		this.Express.use(cors('*'))

		// Requests from JSON...
		this.Express.use(express.json())

		// Routers
		// this.Express.use('/file', require(this.path.controller + '/file/route'))
		// this.Express.use('/auth', require(this.path.controller + '/user/route'))
		// this.Express.use('/user', require(this.path.controller + '/user/route'))
		// this.Express.use('/msg', require(this.path.controller + '/message/route'))

		this.Express.use('/test', Test) // localhost<:port>/test

		// Search available ports
		const nc = await systeminformation.networkConnections()
		this.ports.map(async p => {
			if (!nc.some(c => c.localPort === String(p))) this.port = p
		})
		if (!this.port) throw ('No port available to start LAN')

		// Creating server ...
		this.Http = http.listen(this.port)

		if (null == this.Http.address()) {
			console.log(`Port ${this.port} already in use!`)
			this.Http = false
			throw (`Port ${this.port} already in use`)
		} else {
			console.log(
				`LAN: listening on ${this.site}${this.port == 80 ? '' : ':' + this.port}`
			)
		}

		// Inicia a central de mensagens (socket, etc) se estiver habilitado.
		if (this.Http && this.socket.enable) {
			this.Socket = await import(this.path.socket + '/socket')()
			this.Socket.listen(http)
		}
	}

	http() {
		return this.Http
	}

	socket() {
		return this.Socket
	}

	express() {
		return this.Express
	}
}