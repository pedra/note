// QuerySelector e: element (string: '.class') | a: all elements (boolean: true)
// export const __ = (e = document, a = false) => e instanceof Document || e instanceof HTMLElement ? e : ('string' == typeof e && ((e = document.querySelectorAll(e)) && e.length == 0 ? false : (a === false ? e[0] : e)) || false)

export const __ = (e = document, a = false) => (e instanceof Document || e instanceof HTMLElement) ? e : typeof e !== 'string' ? false : document[`querySelector${a ? 'All' : ''}`](e) || false


/** AddEventListener
 * 
 * 	__e(a, e, v)
 * 		a: action (function) 
 * 		e: element (string | HTMLElement)
 * 		v: event type (string: 'click')
 * 
 * e.g.: __e(() => this.onCloseFunction, this.btn_close)
 * e.g.: __e(e => alert(e.target.value), '#txt_name', 'keyup')
 */
export const __e = (a, e, v = 'click') => 
	e instanceof HTMLElement 
		? e.addEventListener(v, a)
		: (e = __(e, 1)) + (e instanceof NodeList 
			? e.forEach(x => x.addEventListener(v, a)) 
			: false
		)


/** Create a Element
 * 
 * @arguments string t: tag name
 * @arguments object a: attributes
 * @arguments string i: inner
 *  
 * e.g.: __c('div', {class: 'test-style'}, 'Test')
 * e.g.: __c('div', {class: 'test-style'}, __c('h1', null, 'Title'))
 * e.g.: __c('div', {id: 'test-id', class: 'test-style'})
 * e.g.: __c('div', {class: 'test-style', 'contenteditable': true}, 
 *                     [
 *                      'Texto', 
 *                       __c('h1', null, 'Title'), 
 *                       __c('p', null, 'Text'), 
 *                      '<a href="#">Link</a>'
 *                     ])
 * 
 * Formato de argumentos nomeados ---
 * Se o primeiro argumento for um objeto, os parâmetros serão colhidos deste. Qualquer outro parâmetro é ignorado.
 * 
 * 			e.g.: __c({type: 'div', inner: 'innerHTML', attr: {class: 'test-style'}})
 * 				  __c()  // cria uma DIV simples
 * 				  __c({inner: 'My Name is ...'})
 *  
 */
export const __c = (t = 'div', a = {}, i = false) => {
	if ('string' !== typeof t) {
		a = t['attr'] || {}
		i = t['inner'] || false
		t = t['type'] || 'div'
	}
	const e = document.createElement(t)
	for (const x in a) e.setAttribute(x, a[x])
	const s = (c) => c instanceof HTMLElement ? e.appendChild(c) : ('string' == typeof c ? (e.innerHTML += c) : false)
	if (Array.isArray(i)) i.forEach(s)
	else s(i)
	return e
}


/** Add/Remove Loader element, blocking the screen for the user.
 * 
 * @param {string|boolean} color false == remove | string == cor | another == default (#fff)
 * @returns mixed
 */
export const __glass = (() => {
	const template = {
		circle: '<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable- background="new 0 0 0 0" xml:space="preserve"><path fill="${c}" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"><animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"/></path></svg>',
		dual: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" xmlns:xlink="http://www.w3.org/1999/xlink"><circle stroke-linecap="round" fill="none" stroke-dasharray="50.26548245743669 50.26548245743669" stroke="${c}" stroke-width="8" r="32" cy="50" cx="50"><animateTransform values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle></svg>'
	}

	return (color = '#fff', type = 'dual') => {
		const glass = __('.__glass')
		if (color === false) return glass && glass.remove()
		
		const c = typeof color === 'string' ? color : '#fff'
		if (glass) return glass.querySelector(type == 'circle' ? 'path' : 'circle').setAttribute(type=='circle' ? 'fill' : 'stroke', c)		

		const loader = __c('div', {
			class: '__glass',
			style: 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:3000;backdrop-filter:blur(2px);background:rgba(0,0,0,0.9)'
		}, __c('div', { style: 'width:64px;' }, template[type].replace('${c}', c)))

		document.body.appendChild(loader)
	}
})()

// Converte um INTEIRO para a base 36 ou gera um randômico usando a DATA atual (timestamp)
export const __random = n => ('number' == typeof n ? n : new Date().getTime()).toString(36)
export const __randomize = max => Math.floor(Math.random() * parseInt(max + 0))
export const __delay = ms => new Promise(r => setTimeout(r, ms))
export const __text = t => __c({inner: t}).textContent.replace(/\n/g, '<br>').replace(/\s{2,}/g, ' ')

/**Mostra mensagem na tela
 * 
 * @param {string} text
 * @param {string} type 'info' ('i') | 'warn' ('w') | 'alert' default
 * @param {number} tempo tempo de exibição em milisegundos (1000 == 1s)
 * 
*/
export const __report = async (
	text,
	type = '',
	tempo = null
) => {
	tempo = tempo || 2000 + text.length * 40
	type = '__rep-' + ((type == 'info' || type == 'i') ? "info" : (type == 'warn' || type == 'w') ? "warn" : "alert")

	const id = '__' + __random()
	const c = __c('div', { class: `__rep-content ${type}`, id }, text)

	__e(async e => {
		const x = e.currentTarget
		x.classList.remove('on')
		await __delay(400)
		x.remove()
	}, c)

	let r = __('#__report')
	if (!r) {
		r = __c('div', { class: '__report', id: '__report' })
		__('body').appendChild(r)
	}
	r?.appendChild(c)

	await __delay(500)
	__('#' + id).classList.add('on')

	await __delay(tempo)
	const e = __('#' + id)
	if (e) {
		e.classList.remove('on')
		await __delay(400)
		e.remove()
	}
}

// Pega as iniciais do nome ou do nome + sobrenome (último nome)
export const __nm = n => n.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()

/* [
		"#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c7750", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"
	]	*/

// Colors ...
export const __colors = (c) => {
	const l = [
		"#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#bdc3c7", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255"
	]
	const d = ["#c0392b", "#9b59b6", "#8e44ad", "#34495e", "#2c7750", "#a94136"]
	return (c == 'dark' ? d : (c == 'light' ? l : l.concat(d)))
}

/** Cria um "avatar" (SVG) com as letras do texto [optional =>  com o tamanho "s" (pixels) e a cor "c"].
 * Ex.: document.body.innerHTML += __avt(__nm('Paulo Rocha'), 100, '#f00')
 */
export const __avt = (t, s, c) => {
	const a = __colors('dark')
	console.log('COLORS: ', a, __colors(), __colors('light'))
	let ci = c || Math.floor(((t.charCodeAt(0) - 65) + (t.charCodeAt(1) - 65 || 0)) % a.length)
	return `<svg height="${s}" width="${s}" style="background: ${a[ci]}"><text text-anchor="middle" x="50%" y="50%" dy="0.35em" fill="white" font-size="${Math.ceil(s / 1.8)}">${t}</text></svg>`
}

export const __avt_all = (name, type = 'light', size = 30) => {
	const a = __colors(type)
	const l = a.length
	const fill = type == 'dark' ? '#fff' : '#000'
	const n = __nm(name)
	return a.map((c, i) => `<svg height="${size}" width="${size}" style="background: ${a[i]}"><text text-anchor="middle" x="50%" y="50%" dy="0.35em" fill="${fill}" font-size="${Math.ceil(size / 1.8)}">${n}</text></svg>`).join('')
}