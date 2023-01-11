import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const result = accounts.find((account) => account.id === id)

        if (!result) {
            res.status(404)
            throw new Error("Account not found. Verify your id")
        }

        res.status(200).send(result)

    } catch (erro) {
        console.log(erro)

        if (res.statusCode === 200) {
            res.status(500)
        }

        res.send(erro.message)
    }
})

app.delete("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        if (id[0] !== "a") {
            res.status(400)
            throw new Error("Invalid id, must begin with letter 'a' ")
        }

        const accountIndex = accounts.findIndex((account) => account.id === id)

        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
            res.status(200).send("Item deletado com sucesso")
        } else {
            res.status(404)
            throw new Error("Invalid id, please check the information")
        }
    } catch (erro) {
        console.log(erro)

        if (res.statusCode === 200) {
            res.status(500)
        }

        res.send(erro.message)
    }
})

app.put("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newOwnerName = req.body.ownerName as string | undefined
        const newBalance = req.body.balance as number | undefined
        const newType = req.body.type as ACCOUNT_TYPE | undefined

        if(newOwnerName !== undefined) {
            if(newOwnerName.length < 2) {
                res.status(400)
                throw new Error("Seu nome deve conter mais do que 2 caracteres")
            }
        }

        if(newId !== undefined) {
            if(newId[0] !== 'a') {
                res.status(400)
                throw new Error("Id inválido, o mesmo deve começar com a letra 'a'.")
            }
        }

        if(newBalance !== undefined) {
            if(newBalance < 0) {
                res.status(404)
                throw new Error("Nova conta não pode ser negativa")
            }
            if(typeof newBalance !== "number") {
                res.status(404)
                throw new Error("Nova conta precisa ser um número")
            }
        }

        if(newType !== undefined) {
            if(newType !== "Ouro" && newType !== "Platina" && newType !== "Black") {
                res.status(400)
                throw new Error("Invalid category, please insert a valid one.")
            }
        }

        const account = accounts.find((account) => account.id === id)

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type

            account.balance = isNaN(newBalance) ? account.balance : newBalance
            res.status(200).send("Atualização realizada com sucesso")
        } else {
            res.status(400)
            throw new Error("Id não encontrada, favor inserir ID válida")
        }

    } catch (erro) {
        console.log(erro)

        if (res.statusCode === 200) {
            res.status(500)
        }

        res.send(erro.message)
    }
})