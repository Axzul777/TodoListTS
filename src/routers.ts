import { Hono } from 'hono'
import * as taskController from './Controllers/Task.js'
import * as userController from './Controllers/User.js'

const routes = new Hono()


// Task Controller
routes
  .get('/',              async (c) => taskController.show(c))
  .get('/show',          async (c) => taskController.show(c))
  .post('/new',          async (c) => taskController.create(c))
  .delete("/delete/:id", async (c) => taskController.remove(c))



// User Controller
routes
  .post('/login',        async (c) => userController.login(c))
  .post('/register',     async (c) => userController.register(c))
  .post('/logout',       async (c) => undefined)




export const HonoRoutes = routes