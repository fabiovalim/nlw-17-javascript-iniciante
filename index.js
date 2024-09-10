const { select } = require('@inquirer/prompts')

async function start() {
    
    while(true) {
        
        const opcao  = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                console.log("\nVamos cadastrar\n")
                break
            case "listar":
                console.log("\nVamos listar\n")
                break
            case "sair":
                console.log("\nAté a próxima!\n")
                return
        }
    }
}

start()