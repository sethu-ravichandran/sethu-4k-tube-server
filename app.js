import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import downloadRoutes from './routes/downloadRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createApp = () => {
  const app = express()

  app.use(
    cors({
      origin: [
        'https://sethu-4k-tube-client.vercel.app',
        'http://localhost:5173'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  )

  app.use(express.json())

  // API Routes
  app.use('/api', downloadRoutes)

  // Serve downloaded files
  const downloadsPath = path.join(__dirname, 'downloads')
  app.use('/downloads', express.static(downloadsPath))

  // Health check
  app.get('/health', (request, response) => {
    response.status(200).json({ status: 'ok' })
  })

  // 404 Handler
  app.use((request, response) => {
    response.status(404).json({ error: 'Not Found' })
  })

  // Global Error Handler
  app.use((err, request, res, next) => {
    console.error('Unhandled error:', err)
    response.status(500).json({ error: 'Internal Server Error' })
  })

  return app
}
