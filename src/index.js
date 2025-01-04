import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { carbonara } from './scraper/carbonara.js'

const app = new Hono()

app.use('*', serveStatic({ root: './public' }))

app.get('/', (c) => {
  return c.json({
    author: 'Leuthra',
    message: 'Hello World',
  })
})

app.get('/ip', async (c) => {
  try {
    const response = await fetch('https://ipinfo.io/json')
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    return c.json(
      {
        author: 'Leuthra',
        error: 'Unable to fetch IP information',
      },
      500
    )
  }
})

app.get('/api/carbonara', async (c) => {
  const text = c.req.query('text')
  if (!text) {
    return c.json({ error: 'Text is required' }, 400)
  }
  try {
    const data = await carbonara(text)
    return new Response(data, {
      headers: {
        'cache-control': 'no-store',
        'Content-Disposition': 'inline; filename="image.png"',
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    return c.json({ error: 'Unable to generate image' }, 500)
  }
})

app.notFound((c) => {
  return c.json({
    author: 'Leuthra',
    message: 'Not Found',
  })
})

app.onError((err, c) => {
  console.log(`${err}`)
  return c.json({
    author: 'Leuthra',
    message: 'Internal Server Error',
  })
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
