import { Hono, type Context } from 'hono'
import { PrismaClient } from '../../generated/prisma/index.js'
import bcrypt from 'bcrypt'
import { decode, sign, verify } from 'hono/jwt'
import  dotenv  from 'dotenv'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

dotenv.config()

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
    const secret_key = process.env.SECRET_JWT_KEY ?? "DONT_DO_THIS"
    const cookie = getCookie(c, 'unsecure_session_cookie')
    if (cookie) {
        try { 
            const tokenValid = await verify(cookie, secret_key)

            return c.json({message: "Already logged", user: tokenValid.sub})
        } catch (e) {
            return c.json({error: "Token expired!"}, 401)
        }
    }



    const { name, password } = await c.req.json()

    if (!name || !password) {
        return c.json({error: "Missing fields"}, 400)
    }


    const hashedPassword = await prisma.user.findFirst({where: {
        name: name
    }, select: {password: true}})

    if (!hashedPassword) {
        return c.json({error: "Error during login"})
    }

    const correspond = await bcrypt.compare(password, hashedPassword.password)

    if (!correspond) {
        return c.json({error: "Invalid credentials"}, 401)
    }

    const payload = {
        sub: name,
        exp: Math.floor(Date.now() / 1000) + 86400
    }

    const token = await sign(payload, secret_key)


    setCookie(c, 'unsecure_session_cookie', token)

       
    return c.json({success: "Login session success"})
}

async function logout(c:Context) {
    deleteCookie(c, 'unsecure_session_cookie')

    return c.json({success: "Session finished"})
}


export {
    login, register,
}