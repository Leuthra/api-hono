import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { carbonara } from './scraper/carbonara.js'

const app = new Hono()

// Middleware untuk serve static files
app.use('*', serveStatic({ root: './public' }))

// Route utama
app.get('/', (c) => {
  return c.json({
    author: 'Leuthra',
    message: 'Hello World',
  })
})

// Route untuk mendapatkan IP pengguna
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

// Route untuk mengembalikan gambar dari API Carbonara
app.get('/api/carbonara', async (c) => {
  const text = c.req.query('text')
  if (!text) {
    return c.json({ error: 'Text is required' }, 400)
  }
  try {
    const data = await carbonara(text)
    return new Response(data, {
      headers: {
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    return c.json({ error: 'Unable to generate image' }, 500)
  }
})

// Handle 404 Not Found
app.notFound((c) => {
  return c.json({
    author: 'Leuthra',
    message: 'Not Found',
  })
})

// Handle Error
app.onError((err, c) => {
  console.log(`${err}`)
  return c.json({
    author: 'Leuthra',
    message: 'Internal Server Error',
  })
})

// Jalankan server
const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
