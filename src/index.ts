import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { HonoRoutes } from './api.js'


const app = new Hono()


app.route('/api', HonoRoutes)


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
