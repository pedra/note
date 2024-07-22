

const _Profile = function (config) {

    html = {}

    const show = () => {
        App.Storage.me().then(me => {
            if (!me) return false
            _(html.themestyle).href = `src/css/theme/${me.theme}.css`
            _(html.theme).innerHTML = me.theme
            _(html.access).innerHTML = me.access
            _(html.download).innerHTML = me.download
            _(html.upload).innerHTML = me.upload
            _(html.name).innerHTML = me.name
            _(html.avatar).innerHTML = me.avatar
                ? `<img src="${me.avatar.replace('.png', '_3.png')}" alt="avatar">`
                : __avt(__nm(me.name), 150, '#F00')
        })
    }

    const theme = async () => {
        var me = await (App.Storage.me())
        me.theme = me.theme == 'dark' ? 'light' : 'dark'
        _(html.themestyle).href = `src/css/theme/${me.theme}.css`
        _(html.theme).innerHTML = me.theme

        await App.Storage.upd(me)
        await __post(config.profile.setTheme, { id: me.id, theme: me.theme })
    }

    const construct = () => {
        html = config.profile.html
        html.themestyle = config.app.html.themestyle
        show()
    }
    construct()

    return { theme }
}