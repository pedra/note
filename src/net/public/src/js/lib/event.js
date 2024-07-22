/**
 * Event register.
 * @returns {Object} Retorna o objeto.
 */
const _Event = function () {

    let events = {},
        count = 0


    /**
     * insere uma ação para um determinado evento
     * 
     * @param {String} event  Nome do evento
     * @param {String} id Nome da ação
     * @param {Function} action Ação a ser executada quando o Evento for disparado
     * 
     * @return {Boolean} Success or fail
     */
    const subscribe = (event, id, action) => {
        if (!events[event]) events[event] = {}
        if (!events[event][id]) {
            events[event][id] = action
            return true
        }
        return false
    }

    /**
     * Apaga um determinado evento indicado pelo seu id
     * 
     * @param {String} event 
     * @param {String} id 
     * 
     * @return {Boolean}
     */
    const unsubscribe = (event, id) => {
        if (!events[event]) return false
        return delete (events[event][id]) ? true : false
    }

    /**
     * Executa TODAS as ações registradas para um "event" e "id" 
     * 
     * @param {String} event Nome do evento
     * @param {object|String|Number|Boolean} data dados passados como argumento (opcional) 
     * 
     * @return {Boolean} 
     */
    const trigger = (event, data) => {
        if (!events[event]) return false
        for (var i in events[event]) {
            events[event][i](data)
        }
        return true
    }

    /**
     * Retorna os eventos registrados (debug)
     * 
     * @param {String} e 
     */
    const getEvent = e => !e ? events : events[e]

    /**
     * Apaga um evento ou limpa o registro de eventos
     * 
     * @param {String|void} e 
     */
    const clear = e => {
        e = e || false
        if (!e) {
            events = []
            return watchdogStart()
        }
        if (undefined != typeof events[e]) events[e] = null
    }

    /**
     * Counter reset (but, not watchdog reset)
     * @param {Number} c 
     */
    const reset = c => {
        c = parseInt(c) || 0
        count = c < 0 ? 0 : c
    }

    /**
     * Inicia o watchdog timer como um Evento
     * @returns void
     */
    const watchdogStart = () => setInterval(() => trigger('watchdog', count++), 100)

    /**
     * Initialize this
     */
    const init = () => {
        clear()
        watchdogStart()
    }
    init()

    return { subscribe, unsubscribe, trigger, reset, clear, getEvent }
}