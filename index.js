const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "\nBem vindo ao app de metas!\n"
let metas

async function carregarMetas() {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

async function salvarMetas() {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

async function cadastrarMeta() {
    const meta = await input({ message: "\nDigite a meta:" })

    if(meta.length == 0) {
        console.log("\nA meta não pode ser vazia.\n")
        return
    }

    metas.push({ value: meta, checked: false })

    mensagem = "\nMeta cadastrada com sucesso!\n"
}

async function listarMetas() {
    if(metas.length == 0) {
        mensagem = "\nNenhuma meta cadastrada :(\n"
        return
    }

    const respostas = await checkbox({
        message: "\n< Use as SETAS para mudar de meta, o ESPAÇO para marcar/desmarcar, e o ENTER para enviar >\n",
        choices: [...metas], 
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "\nNenhuma meta marcada :(\n"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "\nMarcação realizada com sucesso!\n"
}

async function metasRealizadas() {
    if(metas.length == 0) {
        mensagem = "\nNenhuma meta cadastrada :(\n"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "\nNenhuma meta concluída :(\n"
        return
    }

    await select({
        message: "\nMetas realizadas ( " + realizadas.length + " )\n",
        choices: [...realizadas]
    })
}

async function metasAbertas() {
    if(metas.length == 0) {
        mensagem = "\nNenhuma meta cadastrada :(\n"
        return
    }

    const abertas = metas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0) {
        mensagem = "\nNão existem metas abertas :)\n"
        return
    }

    await select({
        message: "\nMetas abertas ( " + abertas.length + " )\n",
        choices: [...abertas]
    })
}

async function deletarMetas() {
    if(metas.length == 0) {
        mensagem = "\nNenhuma meta cadastrada :(\n"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {//desmarcando todas as metas
        return {value: meta.value, checked: false}
    })

    const itensDeletar = await checkbox({//selecionar a meta que deseja deletar
        message: "\n< Use as SETAS para alternar meta, o ESPAÇO para marcar/desmarcar, e o ENTER para deletar >\n",
        choices: [...metasDesmarcadas], 
        instructions: false
    })

    if(itensDeletar.length == 0) {
        mensagem = "\nNenhum item deletado!\n"
        return
    }

    itensDeletar.forEach((item) => {
        metas = metas.filter((meta) => {//atualizando a lista de metas
            return meta.value != item
        })
    })

    mensagem = "\nMeta(s) deletada(s) com sucesso!\n"
}

function mostrarMensagem() {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)

        mensagem = ""
    }
}

async function start() {
    await carregarMetas()

    while(true) {
        mostrarMensagem()
        await salvarMetas()
        
        const opcao  = await select({//Menu da aplicacao
            message: "Menu >",
            choices: [
                {name: "Cadastrar meta", value: "cadastrar"},
                {name: "Listar metas", value: "listar"},
                {name: "Metas realizadas", value: "realizadas"},
                {name: "Metas abertas", value: "abertas"},
                {name: "Deletar metas", value: "deletar"},
                {name: "Sair", value: "sair"}
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("\nAté a próxima!\n")
                return
        }
    }
}

start()