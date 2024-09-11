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

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        console.log("\nNenhuma meta marcada :(\n")
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log("\nMarcação realizada com sucesso!\n")
}

async function metasRealizadas() {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log("\nNenhuma meta concluída :(\n")
        return
    }

    await select({
        message: "Metas realizadas ( " + realizadas.length + " )",
        choices: [...realizadas]
    })
}

async function metasAbertas() {
    const abertas = metas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0) {
        console.log("\nNão existem metas abertas :)\n")
        return
    }

    await select({
        message: "Metas abertas ( " + abertas.length + " )",
        choices: [...abertas]
    })
}

async function start() {

    while(true) {
        
        const opcao  = await select({//Menu da aplicacao
            message: "Menu >",
            choices: [
                {name: "Cadastrar meta", value: "cadastrar"},
                {name: "Listar metas", value: "listar"},
                {name: "Metas realizadas", value: "realizadas"},
                {name: "Metas abertas", value: "abertas"},
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
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "sair":
                console.log("\nAté a próxima!\n")
                return
        }
    }
}

start()