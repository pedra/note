
const _Page = function (config) {

    let currentPage = 'empty',
        currentIn = 'up',
        currentOut = 'down'

    let auth = '',
        root = '',
        trail = []

    let efects = {
        next: { in: () => 'right', out: () => 'left' },
        back: { in: () => 'left', out: () => 'right' },
        up: { in: () => 'up', out: () => 'down' },
        down: { in: () => 'down', out: () => 'up' },
        forward: { in: () => currentIn, out: () => currentOut },
        backward: { in: () => currentOut, out: () => currentIn }
    }

    let pages = {}

    const show = (page, param, efect) => {
        if (!pages[page] || page == currentPage) return false
        if (pages[page].auth == true && !App.Me.isLogged()) return false // Não autenticado?

        eft = efects[efect] || efects[pages[page].efect]

        App.Event.trigger('PageBefore', page) // Dispara evento

        // Colocando a devida class na página anterior e na nova...
        _a('.page').forEach(a => {
            a.classList.remove('on', 'iup', 'idown', 'ileft', 'iright', 'oup', 'odown', 'oleft', 'oright')

            if (a.id == 'pg-' + pages[currentPage].id) a.classList.add('o' + eft.out())
            if (a.id == 'pg-' + pages[page].id) {
                a.classList.add('on', 'i' + eft.in())
                a.scrollTop = 0
            }
        })

        App.Event.trigger('PageBeforeAction', pages[currentPage])

        // Running actions
        if ("function" == typeof pages[currentPage].onHide) pages[currentPage].onHide()
        if ("function" == typeof pages[page].onShow) pages[page].onShow(param)

        // Se o ROOT estiver na última posição de trail, simplifica a rota...
        var last = trail[trail.length - 1]
        if (last == auth || last == root) trail = [last]

        // Se a página for um ROOT ou não aceitar trail...
        if (pages[page].trail === false || page == auth || page == root) trail = [page]

        // Se a página tiver um trail fixo...
        if ("string" == typeof pages[page].trail) trail = [pages[page].trail]

        // Se a página aceitar trail livremente...
        if (pages[page].trail === true) trail.push(currentPage)

        history.pushState(null, null, '/') // Adiciona um novo "Trail"

        // Atualizando a página selecionada, efeitos & disparando o evento final
        currentIn = eft.in()
        currentOut = eft.out()
        currentPage = page

        App.Event.trigger('PageAfter', pages[currentPage])

        /* Retorna false para ser usado em retorno 
           de link <a onclick="return Page('home')" ...
        */
        return false
    }

    // Retorna a página corrente 
    const current = () => currentPage
    const getPages = (p) => (p ? pages[p] : pages)
    const back = () => {
        history.back()
        return false
    }

    // Construindo ...
    const construct = (config) => {
        if (!config) return false
        config.map(a => {
            if (a.id === false) {
                auth = a.auth
                root = a.root
            } else {
                pages[a.id] = a
            }
        })

        history.pushState(null, null, '/')
        history.pushState(null, null, '/')

        window.onpopstate = e => {
            e.preventDefault()
            history.pushState(null, null, '/')

            // Se tiver trilha...
            var prev = trail.pop()
            if (prev) show(prev)
            return false
        }
    }
    construct(config)

    // Returns ...
    return {
        show, current, back,
        pages: getPages
    }
}