import RTCMultiConnection from "../lib/RTCMultiConnection_v3.mjs"
import { __delay } from "../lib/utils.mjs"

export default class WRTCData {

	constructor(option) {
		this.room = option?.room ?? '1234567890A'
		this.conn = null
		this.msgAction = []
		this.eventAction = []
		this.publicRoomId = 'wrtcdata'

		this.conn = new RTCMultiConnection()

		this.conn.sessionid = option?.session ?? 'httplocalhost9002'
		this.conn.session = { data: true, audio: false, video: false }
		this.conn.socketURL = option?.socketURL ?? "http://localhost:9002/"
		this.conn.socketMessageEvent = option?.socketMessageEvent ?? this.publicRoomId
		this.conn.publicRoomIdentifier = option?.publicRoomIdentifier ?? this.publicRoomId
		this.conn.enableLogs = false

		this.conn.enableFileSharing = true
		this.conn.filesContainer = option?.filesContainer ?? document.body

		this.conn.autoCloseEntireSession = true
		this.conn.autoCreateMediaElement = false

		this.conn.onFileStartAction = e => this.onFileStartAction(e)
		this.conn.onFileEndAction = e => this.onFileEndAction(e)

		this.conn.onmessage = e => this.onMessage(e)
		this.conn.onopen = e => this.onOpen(e)
		this.conn.onclose = e => this.onClose(e)

		this.conn.connectSocket(socket => socket.on('disconnect', () => location.reload()))
	}

	async getRooms () {
		return new Promise((resolve, reject) => {
			this.conn.socket.emit(
				'get-public-rooms',
				this.publicRoomId,
				listOfRooms => resolve(listOfRooms))
		})
	}

	onMessage(msg) {
		console.log('XXXXX MESSAGE: ', msg.data.type, msg)
		this.msgAction.map(a =>
			(a.type == msg.data.type || a.type == '*') &&
			a.callback(msg)
		)
	}

	send(type = 'chat', data = {}) {
		const msg = {
			type: type,
			user: data?.user ?? this.conn.userid,
			date: data?.date ?? new Date().getTime(),
			content: data?.content ?? data
		}
		console.log('XXXXX SEND: ', type, msg)
		return this.conn.send(msg)
	}

	subscribeToMessage(type, callback) {
		this.msgAction.push({ type, callback })
	}

	unsubscribeToMessage(type) {
		this.msgAction = this.msgAction.filter(a => a.type !== type)
	}

	// ON EVENTS ---------------------------------------------------------------
	subscribeOn(type, callback) {
		this.eventAction.push({ type, callback })
		// console.log('XXXXX SUBSCRIBE: ', type, callback, this.eventAction)
	}

	onOpen(e) {
		console.log('XXXXX OPEN: ', e.userid)
		this.eventAction.map(a =>
			(a.type == 'open' || a.type == '*') &&
			a.callback(e)
		)
	}

	onClose(e) {
		console.log('XXXXX CLOSE: ', e.userid)
		this.eventAction.map(a =>
			(a.type == 'close' || a.type == '*') &&
			a.callback(e)
		)
	}

	// FILES -------------------------------------------------------------------
	sendFile(file) {
		return this.conn.send(file)
	}

	onFileStartAction(e) {
		console.log('XXXXX FILE START: ', e)
		this.eventAction.map(a =>
			(a.type == 'onFileStart' || a.type == '*') &&
			a.callback(e)
		)
	}

	onFileEndAction(e) {
		console.log('XXXXX FILE END: ', e)
		this.eventAction.map(a =>
			(a.type == 'onFileEnd' || a.type == '*') &&
			a.callback(e)
		)
	}

	// CONNECTION (open|close|join|openOrJoin) ---------------------------------
	open() {
		return new Promise((resolve, reject) => {
			this.conn.open(this.room, (room, session, error) => {
				console.log('Dentro de Open ::: ', room, session, error)
				if (room) {
					resolve({
						room: this.room,
						user: (room ? this.conn.userid : 'host')
					});
				} else {
					reject(new Error(error || 'Failed to open room'));
				}
			})
		})
	}

	close() {
		this.conn.close()
	}

	join(options = {}) {
		return this.conn.join(this.room, options)
	}

	openOrJoin() {
		return new Promise((resolve, reject) => {
			this.conn.openOrJoin(this.room, (isRoomExist, roomid) => {
				console.log('Dentro de OpenOrJoin ::: ', roomid, isRoomExist)
				if (roomid) {
					resolve({
						room: roomid,
						user: (isRoomExist ? this.conn.userid : 'host')
					});
				} else {
					reject(new Error('Failed to open or join room'));
				}
			});
		});
	}

	// GETTERS -----------------------------------------------------------------
	getConnection() {
		return this.conn
	}

	getRoom() {
		return this.room
	}

	getUser() {
		return this.conn.userid
	}

	getParticipants() {
		return this.conn.getAllParticipants()
	}

	getSession() {
		return this.conn.sessionid
	}
}