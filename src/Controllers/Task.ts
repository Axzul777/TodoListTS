import { type Context } from 'hono'
import { PrismaClient } from '../../generated/prisma/index.js'

const prisma = new PrismaClient()

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

async function remove(c: Context) {
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


export {
    create, remove, show
};