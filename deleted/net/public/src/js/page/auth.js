

const _Auth = function (config) {

    let url = {},
        html = {}

    /**
     * Pega os valores digitados no form, filtra e chama Me.login()
     * @param {Object} e Evento submit do form
     * @returns {void}
     */
    const login = e => {
        e.preventDefault()

        var login = (_(html.login).value || '').trim()
        var password = (_(html.password).value || '').trim()

        if (login == '' || password == '')
            return __report('Você precisa digitar o LOGIN e a SENHA!')

        App.Me.login(login, password)
            .then(l => !l ? __report('Não consegui autenticar com os dados informados!') : true)
    }

    /**
     * Monta o objeto Auth
     * @param {Array} config Folha de configuração da aplicação  
     */
    const construct = (config) => {
        url = config.url
        html = config.html
        _(html.form).onsubmit = login
        App.Me.logout(true) //Faz logout em Me sem chamar Page.show('auth')
    }

    construct(config)

    return {
        login
    }
}