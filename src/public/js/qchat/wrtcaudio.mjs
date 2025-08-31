import RTCMultiConnection from "../lib/RTCMultiConnection_v3.mjs"
import hark from "../lib/hark.mjs"

export default class WRTCAudio {

	constructor(option) {
		this.room = option?.room ?? '1234567890A'
		this.conn = null
		this.msgAction = []
		this.eventAction = []
		this.streams = null
		
		this.conn = new RTCMultiConnection()

		this.conn.sessionid = option?.session ?? 'httplocalhost9002'
		this.conn.session = { data: false, audio: true, video: false }
		this.conn.bandwidth = { audio: 6 }  // 6 to 510 kbps
		this.conn.mediaConstraints = { audio: true, video: false }
		this.conn.sdpConstraints.mandatory = {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: false
		}
		if (option?.iceServers) this.conn.iceServers = option.iceServers
		this.conn.audiosContainer = option?.audiosContainer ?? document.body

		this.conn.socketURL = option?.socketURL ?? "http://localhost:9002/"
		this.conn.socketMessageEvent = option?.socketMessageEvent ?? 'wrtcaudio'
		this.conn.enableLogs = false
		this.conn.enableFileSharing = false
		this.conn.autoCloseEntireSession = true
		this.conn.autoCreateMediaElement = false

		this.conn.onmessage = e => this.onMessage(e)
		this.conn.onopen = e => this.onOpen(e)
		this.conn.onclose = e => this.onClose(e)
		this.conn.onstream = e => this.onStream(e)
		this.conn.onstreamended = e => this.onStreamEnded(e)
	}

	// STREAM RECEIVED ---------------------------------------------------------
	onStream(e) {
		console.log('Stream received: ', e.userid, e.type)

		if (e.type == 'local') this.initHark({
			stream: e.stream,
			streamedObject: e,
			connection: this.conn
		})

		if (e.type == 'local') e.mediaElement.muted = "true"
		e.mediaElement.id = 'audio-' + e.userid
		e.mediaElement.pause()

		this.conn.audiosContainer.appendChild(e.mediaElement)

		this.streams.push({
			type: e.type,
			user: e.userid,
			stream: e.stream,
			mediaElement: e.mediaElement
		})

		console.log('Stream received (2): ', this.streams)
	}

	// STREAM ENDED ------------------------------------------------------------
	onStreamEnded(e) {
		console.log('Stream onstreamended: ', e.userid)

		this.streams = this.streams.filter(a => a.user != e.userid)
			.map(a => {
				if (a.user == e.userid) {
					a.stream.stop()
					a.mediaElement.remove()
				}
				return a
			})
		console.log('Stream onstreamended (2): ', this.streams)
	}

	// HARK ---------------------------------------------------------- [ BEGIN ]
	hark(stream, opt = {}) {
		//if (!window.hark) return
		// let hark = window.hark(stream.stream, opt)

		let hark = new hark(stream.stream, opt)

		hark.on('speaking', () => this.onspeaking(stream))
		hark.on('stopped_speaking', () => this.onsilence(stream))
	}

	onspeaking(e) {
		this.send('speak', { user: e.userid, speaking: true })
		this.streams.filter(a => a.user == e.userid).map(a => {
			a.mediaElement.classList.add('speak')
		})
	}

	onsilence(e) {
		this.send('speak', { user: e.userid, speaking: false })
		this.streams.filter(a => a.user == e.userid).map(a => {
			a.mediaElement.classList.remove('speak')
		})
	}
	// HARK ------------------------------------------------------------ [ END ]

	// MESSAGE (optional) ------------------------------------------------------
	onMessage(msg) {
		this.msgAction.map(a =>
			(a.type == msg.data.type || a.type == '*') &&
			a.callback(msg.userid, msg.data)
		)
	}

	send(type = 'chat', data = {}) {
		const msg = {
			type: type,
			user: data?.user ?? this.conn.userid,
			date: data?.date ?? new Date().getTime(),
			content: data?.content ?? data
		}
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

	// CONNECTION (open|close|join|openOrJoin) ---------------------------------
	open() {
		return this.conn.open(this.room, () => this.conn.sessionid)
	}

	close() {
		this.conn.close()
	}

	join() {
		return this.conn.join(this.room)
	}

	openOrJoin() {
		return new Promise((resolve, reject) => {
			this.conn.openOrJoin(this.room, (isRoomExist, roomid) => {
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

	getStreams() {
		return this.streams
	}

	getParticipants() {
		return this.conn.getAllParticipants()
	}

	getSession() {
		return this.conn.sessionid
	}
}