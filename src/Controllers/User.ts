import { Hono, type Context } from 'hono'
import { PrismaClient } from '../../generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function register(c: Context) {
    const { name, email, password } = await c.req.json()

    if (!name || !email || !password) {
        return c.json({error: "Missing Fields"}, 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await prisma.user.create({data: {
            name: name,
            email: email,
            password: hashedPassword,
        }})
        
        return c.json({success: "User added successfully!"}, 200)
    } catch {
        return c.json({error: "Error adding new users"}, 400)
    }
}

async function login(c: Context) {
    const { name, password } = await c.req.json()

    if (!name || !password) {
        return c.json({error: "Missing fields"}, 400)
    }


    const hashedPassword = await prisma.user.findFirst({where: {
        name: name
    }, select: {password: true}})

    if (!hashedPassword) {
        return c.json({error: "Error during loggin atempty"})
    }

    const correspond = await bcrypt.compare(password, hashedPassword.password)

    if (correspond) {
        return c.json({success: "Loggin success"})
    }
}




export {
    login, register,
}