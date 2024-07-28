import express from 'express'
import { createServer } from 'node:http'
import cors from 'cors'
import App from '../app/app.mjs'

/**
 * TODO: Rescrever tudo para módulo - back & front
 * 
 * 		- Use o arquivo /net/module/test.mjs como modelo
 * 		- Ver arquivo /view/js/_new_utils.js - transpor para /net/public/js/utils.js
*  		- O acesso ao core do Electron (/app/app.mjs) é feito internamente por "import"

 */

import Test from './module/test.mjs'

export default class Server {

	static instance = null
	Http = null
	Socket = null
	Express = null

	port = 8080
	site = 'http://localhost'
	path = {
		public: null,
		view: null,
		controller: null,
		socket: null,
	}
	socket = {
		enable: true,
		channel: 'qzc'
	}

	constructor() {
	 }

	static getInstance() {
		if (!Server.instance) Server.instance = new Server()
		return Server.instance
	}

	init(
		pathPublic = null, 
		view = null, 
		controller = null, 
		socket = null
	){
		this.path.public = pathPublic || App.path.net + '/public'
		this.path.view = view || App.path.net + '/view'
		this.path.controller = controller || App.path.net + '/module'

		// Socket: false to disable
		if(socket === false) this.socket.enable = false
		else this.path.socket = socket || App.path.net + '/module/message'

		return this
	}

	async start () {
		this.Express = express()
		const http = createServer(this.Express)

		this.Express.use(express.static(this.path.public))
		this.Express.use(cors('*'))
		this.Express.set('views', this.path.view)
		this.Express.set('view engine', 'ejs')

		// Requests from JSON...
		this.Express.use(express.json())

		// Routers
		// this.Express.use('/file', require(this.path.controller + '/file/route'))
		// this.Express.use('/auth', require(this.path.controller + '/user/route'))
		// this.Express.use('/user', require(this.path.controller + '/user/route'))
		// this.Express.use('/msg', require(this.path.controller + '/message/route'))

		this.Express.use('/test', Test) // localhost:8080/test

		// Creating server ...
		this.Http = http.listen(this.port)

		if (null == this.Http.address()) {
			console.log(`Port ${this.port} already in use!`)
			this.Http = false
		} else {
			console.log('Host listening in ' + this.site + (this.port == 80 ? '' : ':' + this.port))
		}

		// Inicia a central de mensagens (socket, etc) se estiver habilitado.
		if (this.Http && this.socket.enable) {
			this.Socket = await import(this.path.socket + '/socket')()
			this.Socket.listen(http)
		}
	}

	http () {
		return this.Http
	}

	socket () {
		return this.Socket
	}

	express () {
		return this.Express
	}
}


// const Server = ServerClass.getInstance()

// console.log('Server: ', Server)
// export default Server


// module.exports = () => {

//     let Http,
//         Socket,
//         CH = app.Config.net,
//         CS = app.Config.net.socket

//     const Net = express()
//     const http = createServer(Net)

//     Net.use(express.static(CH.static))
//     Net.use(cors('*'))
//     Net.set('views', CH.view)
//     Net.set('view engine', 'ejs')

//     // Requests from JSON...
//     Net.use(express.json())

//     // Routers
//     Net.use('/file', require(CH.module + '/file/route'))
//     Net.use('/auth', require(CH.module + '/user/route'))
//     Net.use('/user', require(CH.module + '/user/route'))
//     Net.use('/msg', require(CH.module + '/message/route'))

//     // Creating server ...
//     Http = http.listen(CH.port)

//     if (null == Http.address()) {
//         console.log(`Port ${CH.port} already in use!`)
//         Http = false
//     } else {
//         console.log('Host listening in ' + CH.site + (CH.port == 80 ? '' : ':' + CH.port))
//     }

//     // Inicia a central de mensagens (socket, etc) se estiver habilitado.
//     if (Http && CS.enable) {
//         Socket = require(CS.path + '/socket')()
//         Socket.listen(http)
//     }

//     return { Net, Http, Socket }
// }