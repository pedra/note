

const _Bmenu = function (config) {

    let pages = []
    let itens = []

    // Select a item by trigger Event on PageBefore
    const setState = p => {
        var b = pages[p]
        _('#bmenu').classList[b === false ? 'remove' : 'add']('on')
        if (b !== false) return select(b)
    }

    // Public Select an item by ID 
    const select = id => {
        if (itens.findIndex(a => a.id == id) < 0) return false
        _a('#bmenu ul li').forEach(e => e.classList[e.id == 'bmn-' + id ? 'add' : 'remove']('on'))
        return true
    }

    // Public function to select (and running a action) by ID
    const set = id => {
        if (!select(id)) return false
        return run(id)
    }

    // User action..,
    const click = e => {
        var l = false

        if (e.target.tagName == 'LI') l = e.target
        if (e.target.parentElement.tagName == 'LI') l = e.target.parentElement
        if (!l) return false

        // Pegando a Action
        return run(l.id)
    }

    // running a action...   
    const run = id => {
        var i = itens.findIndex(i => i.id == id.replace('bmn-', ''))
        if (i < 0) return false
        return itens[i].action()
    }

    // Construindo ...
    const construct = (config) => {
        if (!config) return false

        config.pages.map(a => pages[a.id] = a.bmenu)
        itens = config.bmenu

        // Assinando o evento de PageBefore
        App.Event.subscribe('PageBefore', 'bmenu', setState)

        // inserting HTML parts... 
        var d = document.createElement('div')
        d.className = 'bmenu'
        d.id = 'bmenu'
        d.onclick = click

        t = '<div class="container"><ul>'
        itens.map(i => t += `<li id="bmn-${i.id}"><i class="material-icons">${i.icon}</i><span>${i.title}</span></li>`)
        d.innerHTML = t + '</ul></div>'

        _('body').appendChild(d)
    }

    construct(config)

    return {
        select,
        set
    }
}