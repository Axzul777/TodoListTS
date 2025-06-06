import { Hono } from 'hono'
import * as taskController from './Controllers/Task.js'

const routes = new Hono()


// Task Controller
routes
  .get('/',              async (c) => taskController.show(c))
  .get('/show',          async (c) => taskController.show(c))
  .post('/new',          async (c) => taskController.create(c))
  .delete("/delete/:id", async (c) => taskController.remove(c))



// User
routes
  .post('/login', async (c) => undefined)
  .post('/register', async (c) => undefined)
  .post('/logout', async (c) => undefined)




export const HonoRoutes = routes