// FileProgressBarHandler.js
import { __, __c } from "../utils.mjs"

export default class FileProgressBarHandler {
	static handle(connection) {
		const progressHelper = {}

		connection.onFileStart = function (file) {

			const label = __c('label')
			const bar = __c('div', { class: 'pgb-progress' }, __c('div', { class: 'pgb-label' }, label))
			const div = __c('div', { class: 'file-item' }, bar)

			if (file.remoteUserId) {
				const r = __c('div', { class: 'pgb-data' }, __c('div', { class: 'pgb-name' }, file.name))
				r.appendChild(__c('div', { class: 'pgb-user' }, file.remoteUserId))
				div.appendChild(r)
			}

			if (!connection.filesContainer)
				connection.filesContainer = document.body || document.documentElement

			connection.filesContainer.insertBefore(div, connection.filesContainer.firstChild)

			const helper = {
				progress: {
					value: 0,
					max: file.maxChunks
				},
				div,
				bar,
				label
			}

			progressHelper[file.uuid] = file.remoteUserId ? (
				() => {
					const t = {}
					t[file.remoteUserId] = helper
					return t
				})() : helper

			if ('function' === typeof connection.onFileStartAction) connection.onFileStartAction(file)
		}

		connection.onFileProgress = function (chunk) {
			let helper = progressHelper[chunk.uuid]
			if (!helper) return

			if (chunk.remoteUserId) {
				helper = progressHelper[chunk.uuid][chunk.remoteUserId]
				if (!helper) return
			}

			helper.progress.value = chunk.currentPosition || chunk.maxChunks || helper.progress.max
			const v = parseInt(helper.progress.value / helper.progress.max * 100) || 100

			helper.label.innerHTML = v + '%'
			if (helper.bar) helper.bar.style.backgroundImage = `conic-gradient(#ffc ${v * 3.6}deg, transparent 0deg)`
		}

		connection.onFileEnd = function (file) {
			let helper = progressHelper[file.uuid]
			if (!helper) {
				console.error('No such progress-helper element exist.', file)
				return
			}

			if (file.remoteUserId) {
				helper = progressHelper[file.uuid][file.remoteUserId]
				if (!helper) return
			}

			// TODO: mostrar somente imagens. Não usar IFRAME. Substituir por ícone de arquivo + download.
			helper.div.innerHTML = `<a href="${file.url}" download="${file.name}">
				<img src="${file.type.indexOf('image') != -1 ? file.url : '/img/folder.png'}" alt="${file.name}">
				<div class="pgb-data">${file.name}</div>
			</a>`

			if ('function' === typeof connection.onFileEndAction) connection.onFileEndAction(file)
		}
	}
}