// QuerySelector e: element (string: '.class') | a: all elements (boolean: true)
export const __ = (e, a = false) => document[`querySelector${a ? "All" : ""}`](e) || null

// AddEventListener a: action (function) | e: element (string|HTML Node) | v: event type (string: 'click')
export const __e = (a, e = 'document', v = "click") => {
	let c = e != null && 'object' == typeof e ? e :
		(e == 'document' || !e || e == "" || e == null ? document : __(e, true))
	if (c == null || c.length == 0) return false
	return (!c[0] ? [c] : c).forEach(x => x.addEventListener(v, a))
}

// Create Element
export const __c = (type = 'div', a = {}, content = false) => {
	const e = document.createElement(type)
	for (let x in a) e.setAttribute(x, a[x])
	switch (typeof content) {
		case 'boolean': break
		case 'string': e.innerHTML = content; break
		case 'object': e.appendChild(content); break
	}
	return e
}

export const __glass = (a = true) => {
	if (a === false) return __('.__glass').classList.remove('on')
	let g = __('.__glass')
	if (!g) {
		let b = __c('div', { class: '__glass' }, __c('img', { src: "/asset/img/l.gif", alt: 'loading' }))
		document.body.appendChild(b)
		setTimeout(() => b.classList.add('on'), 200)
		return
	}
	g.classList.add('on')
}