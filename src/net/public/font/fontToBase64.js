const path = require('path')
const fs = require('fs')
const { exit } = require('yargs')
const arg = process.argv
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

// Pegando os arquivos no diretório corrente.
var d = fs.readdirSync('./')
// Considerando somente os arquivos de fontes (ttf, woff2)
var l = d.filter(a => path.extname(a) == '.ttf' || path.extname(a) == '.woff2')

console.log('Encontrei os seguintes arquivos neste diretório:\n')
l.map((a, b, c) => console.log('> ' + b + ' - ' + a))

// Processando o comando do usuário.
readline.question(`\nDigite o número correspondente: `, (cmd) => {
    // Se o usuário não respondeu corretamente, sai do programa com aviso do erro.
    if (!cmd || isNaN(cmd) || cmd >= l.length || cmd < 0) {
        console.error('\nVocê DEVE escolher um dos arquivos da lista, digitando o NÚMERO correspondente.\nTente novamente.')
        readline.close()
        exit()
    }

    // Mostrando o que foi escolhido.
    console.log(`\nConvertendo o arquivo "${l[cmd]}" ...`)
    var name = path.basename(l[cmd])

    // Processando a conversão do arquivo.
    fs.writeFileSync(`./${name}.b64`, 'data:font/woff2;charset=utf-8;base64,' +
        fs.readFileSync(`./${l[cmd]}`).toString('base64'))

    // Reportando a conclusão.
    console.log(`\nArquivo "${name}.b64" criado.\n\n ... \n`)

    // Fechando a interface 
    readline.close()
})