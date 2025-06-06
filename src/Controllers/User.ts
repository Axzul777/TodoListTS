import { Hono, type Context } from 'hono'
import { PrismaClient } from '../../generated/prisma/index.js'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function register(c: Context) {
    const { user, email, password } = await c.req.json()

    if (!user || !email || !password) {
        return c.json({error: "Missing Fields"}, 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        prisma.user.create({data: {
            name: user,
            email: email,
            password: hashedPassword,
        }})
        
        return c.json({success: "User added successfully!"}, 200)
    } catch {
        return c.json({error: "Error adding new users"}, 400)
    }
}

async function login() {
    undefined
}




export {
    login, register
}