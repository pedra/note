/**
 * Entity para controle do usuário da aplicação.
 * @param {Array} config Configurações da aplicação.
 * @returns {Object} Retorna métodos do objeto.
 */
const _Me = function (config) {

    let url = {},
        prop = {}

    /**
     * Processa o logIn no servidor e salva os parâmetros no browser.
     * @param {String} login Login do usuário 
     * @param {String} password Senha do usuário
     * @returns {Boolean} Sucesso ou falha
     */
    const login = async (login, password) => {

        if (login.trim() == '' || password.trim() == '') return false

        await App.Storage.clear() // clear all data
        prop = {} // Local properties

        // enviando ao servidor...
        var me = await __post(url.login, { login, password })

        if (!me || me.error) return false

        me.auth = true
        App.Storage.add(me) // add user "me" data
        prop = me // local properties

        App.Page.show('profile')
        return true
    }

    /**
     * Processa o logOut no servidor e apaga os dados locais.
     * @param {Boolean} silent True não chama a página de Authentication.
     */
    const logout = async (silent) => {
        var me = await App.Storage.me()
        if (me && me.id) __post(url.logout, { id: me.id })

        await App.Storage.clear()// clear all data
        prop = {} // Local properties

        if (!silent) App.Page.show('auth')
    }

    /**
     * Checa se está logado
     * @returns {Boolean} Sucesso
     */
    const isLogged = () => prop.auth || false

    /**
     * Retorna os parâmetros do usuário principal.
     * @param {String | null} p Indica um parâmetro específico ou todos se estiver faltando.
     * @returns {Boolean | Object} Retorna o parâmetro, todos os parâmetros ou false se o parâmetro não existir.
     */
    const get = p => !p ? prop : (p && prop[p] ? prop[p] : false)


    /**
     * Monta esta Entity
     */
    const construct = async () => {
        url = config.user.url

        var me = await App.Storage.me()
        if (me && me.id) prop = me
    }
    construct()

    return {
        login, logout, isLogged,
        get
    }
}