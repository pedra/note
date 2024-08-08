import { __log, __avt, __nm, __, __c } from './utils.mjs'



window.onload = function () {

	// TESTE de importação de módulos ------------------------- deletar
	__log('window.onload - ', window.location)

	__('.right .btn').innerHTML += __avt(__nm('Paulo Rocha'), 26)


	__('header .middle .btn', true).forEach(e => e.onclick = e => page(e.currentTarget.dataset.go))
	__('.hom-card', true).forEach(e => e.onclick = e => page(e.currentTarget.dataset.go))
	


	setTimeout(() => {		
		__('#pg-home').classList.add('on')
	}, 100);
}



function page(page = 'home') {
	__('.page.on').classList.remove('on')
	__('#pg-' + page).classList.add('on')
}