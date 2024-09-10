const { select, input, checkbox } = require('@inquirer/prompts')

let meta = { value: "Tomar 3L de água", checked: false }

let metas = [meta]

async function cadastrarMeta() {
    const meta = await input({ message: "\nDigite a meta:" })

    if(meta.length == 0) {
        console.log("\nA meta não pode ser vazia.\n")
        return
    }

    metas.push({ value: meta, checked: false })
}

async function listarMetas() {
    const respostas = await checkbox({
        message: "\n< Use as SETAS para mudar de meta, o ESPAÇO para marcar/desmarcar, e o ENTER para enviar >",
        choices: [...metas], 
        instructions: false
    })

    if(respostas.length == 0) {
        console.los("\nNenhuma meta selecionada :(\n")
        return
    }

    metas.forEach((m) => {
        m.checked = false
    })

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log("\nMarcação realizada com sucesso!\n")
}

async function start() {

    while(true) {
        
        const opcao  = await select({//Menu da aplicacao
            message: "Menu >",
            choices: [
                {name: "Cadastrar meta", value: "cadastrar"},
                {name: "Listar metas", value: "listar"},
                {name: "Sair", value: "sair"}
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "sair":
                console.log("\nAté a próxima!\n")
                return
        }
    }
}

start()