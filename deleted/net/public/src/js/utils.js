/*
 *  Global functions
 */
// String de caracteres aleatórios
const pool = '8u7zoicjgyaFrfb5VQG0OwNJTWAqknZItsER6S42pmxKL9CUlYHDdhB1M3veXP'


// Retorna um componente do DOM que corresponda a pesquisa, opcionalmente, 
//  dentro do "o" objeto passado OU, false.
const _ = (e, o) => (!o ? document : o).querySelector(e) || false
const _a = (e, o) => (!o ? document : o).querySelectorAll(e) || false

// Checa se o valor dado "f" é uma função e retorna a função original ou uma função nula.
const __f = f => ('function' == typeof f ? f : () => null)

// Acrescente um "0" para valores menores que 10
const __dez = v => (v < 10 ? '0' + v : v)

// Retira as barras no final da URL => '/site.com/data////' == '/site.com/data'
const __u = u => u.substr(-1) == '/' ? _u(u.slice(0, -1)) : u

// Generate a token base 36 from datetime || unkey: decode base 36 string to integer
const __tokey = n => ('number' == typeof n ? n : new Date().getTime()).toString(36)
const __unkey = t => ('string' == typeof t ? parseInt(t, 36) : false)

// Convert Real(currency) to float || ftor: float to Real
const __rtof = v => parseFloat((v.trim() == '' ? (v = '0') : v).replace(/\.| /g, '').replace(/,/g, '.'))
const __ftor = v => parseFloat(v).toLocaleString('pt-br', { minimumFractionDigits: 2 })

// Formata bytes em Mb, Gm, Tb ... | retorna string no formato '234 Kb' ou FALSE
const __toByte = b => {
    b = parseInt(b) || 0
    if (b < 1 || b > 999999999999999) return '0 b'
    let s = ['b', 'K', 'M', 'G', 'T'],
        v = 0.001,
        x = s.find(a => (t = (b / (v *= 1000))) && (t < 1000 && t > 0) ? (o = t.toFixed(t.toFixed(1) - parseInt(t) > 0.09 ? 1 : 0)) : false)
    return `${o} ${x}`.replace('.', ',')
}

// Generate a password
const __rpass = chars => {
    let l = pool.length - 1,
        r = '',
        c = parseInt(chars)
    c = isNaN(c) || c > 40 || c < 0 ? 20 : c
    for (let i = 0; i < c; i++) r += pool[Math.floor(Math.random() * l) + 1]
    return r
}

// Substitue *, _ e - por <b>, <i> e <s>, respectivamente
// Ex.: ttoh("Texto em *negrito* e em _itálico_.") ==> "Texto em <b>negrito</b> e em <i>itálico</i>."
const __ttoh = t => t.replace(/(<([^>]+)>)/gi, "")
    .replace(/\n/g, "<br>")
    //.replace(/\n(\*)(\s)(.*?)\n/g, '<li>$3</li>\n')
    .replace(/([^\w]|\s)(\*([^/s]|.*?)\*)([^\w]|\s)/g, '$1<b>$3</b>$4')
    .replace(/([^\w]|\s)(\_([^/s]|.*?)\_)([^\w]|\s)/g, '$1<i>$3</i>$4')
    .replace(/([^\w]|\s)(\-([^/s]|.*?)\-)([^\w]|\s)/g, '$1<s>$3</s>$4')

// Generate a random ID
const __id = w => __tokey() + __rpass(isNaN(w) ? 2 : w)

// Show/hide GLASS message
const __glass = (text, loader, close, tempo) => {
    let r = __ctrpt()

    if (text === true) {
        let id = __id()
        r.classList.add('glass')
        return true
    }

    if (!text) {
        r.classList.remove('glass')
        r.innerHTML = ''
    } else {
        tempo = parseInt(tempo)
        let id = __id()
        r.classList.add('glass')
        r.innerHTML = `<div class="__report-message${!close ? ' noclose' : `" id="${id}" onclick="__crpt('${id}', true)`}">${loader ? '<img src="/icon/favicon-32x32.png">' : ''}${text}</div>`
        if (!isNaN(tempo)) setTimeout(() => __crpt(id), tempo)
    }
}

// Report message
const __report = (text, type, tempo) => {
    tempo = parseInt(tempo)
    let id = __id(),
        d = document.createElement('div')
    d.classList.add("__report-message", "on", type)
    d.innerHTML = text
    d.id = id
    d.onclick = () => __crpt(id)

    let r = __ctrpt()

    r.appendChild(d)
    setTimeout(() => __crpt(id), isNaN(tempo) ? 6000 : tempo)
}

// Add container if not exists
const __ctrpt = () => {
    let r = _('.__report')
    if (!r) {
        r = document.createElement('div')
        r.classList.add('__report')
        document.body.appendChild(r)
    }
    return r
}


// Close a "report"...
const __crpt = (i, g) => {
    let a = _('#' + i)
    if (!a) return false

    a.classList.remove('on')
    a.classList.add('off')
    setTimeout(() => {
        a.remove()
        if (g) _('.__report').classList.remove('glass')
    }, 500)
}


/**
 * Funções para enviar/solicitar dados do Host em formato JSON
 * 
 * @param {string|object} url Pode ser uma string com o endereço ou um objeto contendo a 'url' e 'param' extra => {url: '/test', param: 'primeiro teste'} 
 * @param {object} data Dados em formato JSON a serem enviados ou NULL para ignorar - OBS: caso seja NULL, será gerado um objecto {data: null}
 * @param {function} cb Callback retornando parâmetros de erro e dados recebidos. Ex.: (e, data) => console.log(e ? e : 'sem erro', data)  
 * @param {string} mtd Método GET/POST
 * @returns void
 */

const __post = (url, data) => __req(url, data, 'POST')
const __get = (url, data) => __req(url, data, 'GET')
const __req = (url, data, mtd) => {

    if ("undefined" != typeof data && (data == null || "object" != typeof data)) data = { data: data }
    if (url != null && "object" == typeof url) url = __u(url.url) + '/' + encodeURIComponent(JSON.stringify(url.param))

    let req = {
        headers: new Headers({
            "Content-Type": "application/json",
            "pragma": "no-cache",
            "cache-control": "no-cache"
        }),
        mode: 'cors'
    }

    if (mtd.toUpperCase() == 'POST') {
        req.method = 'POST'
        req.body = JSON.stringify(data)
    } else {
        req.method = 'GET'
        url = url + (!data ? '' : '/' + encodeURIComponent(JSON.stringify(data)))
    }

    return fetch(url, req)
        .then(a => (a.status != 200) ? false : a.json())
        .then(data => data)
        .catch(error => error)
}

// Pega as iniciais do nome ou do nome + sobrenome (último nome)
const __nm = n => n.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()

/** Cria um "avatar" (SVG) com as letras do texto [optional =>  com o tamanho "s" (pixels) e a cor "c"].
 * Ex.: document.body.innerHTML += __avt(__nm('Paulo Rocha'), 100, '#f00')
 */
const __avt = (t, s, c) => {
    let cs = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"],
        ci = Math.floor(((t.charCodeAt(0) - 65) + (t.charCodeAt(1) - 65 || 0)) % cs.length)
    return `<svg height="${s}" width="${s}" style="background: ${c || cs[ci]}">,<text text-anchor="middle" x="50%" y="50%" dy="0.35em" fill="white" font-size="${Math.ceil(s / 1.8)}">${t}</text></svg>`
}