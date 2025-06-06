import { type Context, Hono } from 'hono'
import { PrismaClient } from '../generated/prisma/index.js'


const routes = new Hono()
const prisma = new PrismaClient()

// CRUD
routes
  .get('/', async (c) => show(c))
  .get('/show', async (c) => show(c))
  .post('/new', async (c) => create(c))
  .delete("/delete/:id", async (c) => delete_task(c))

// User Registration and login

routes
  .post('/login', async (c) => register(c))
  .post('/register', async (c) => undefined)
  .post('/logout', async (c) => undefined)




async function show(c: Context) {
  const data = await prisma.task.findMany()

  return c.json({data: data})

}

async function create(c: Context) {
  const { title, description } = await c.req.json()

  if (!title || !description) {
    return c.json({error: "Missing fields!"}, 400)
  }

  try {
    await prisma.task.create({data: {title: title, description: description}})

    return c.json({success: "Added successfully"}, 200)
  } catch {
    return c.json({error: "Error updating db"}, 500)
  }
}

async function delete_task(c: Context) {
  const param = c.req.param("id")

  if (!param) {
    return c.json({error: "Missing fields"}, 400)
  }

  try { 
    prisma.task.delete({where : {
      id: Number(param)
    }})

    return c.json({success: 'Deleted susseccfully!'}, 200)
   } catch {
    return c.json({error: 'Error to adding'}, 400)
  }
}

async function register(c: Context) {
  const user_data = c.req.json()
}


export const HonoRoutes = routes
