import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import downloadRoutes from './routes/downloadRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createApp = (io) => {
  const app = express()

  // Store io instance in app for global access
  app.set('io', io)

  app.use(cors({ origin: 'https://sethu-4k-tube-client.vercel.app/' }))
  
  app.use(express.json())

  // Inject io into each request
  app.use((req, res, next) => {
    req.io = app.get('io')
    next()
  })

  // API Routes
  app.use('/api', downloadRoutes)

  // Serve static downloaded files
  const downloadsPath = path.join(__dirname, 'downloads')
  app.use('/downloads', express.static(downloadsPath))

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  })

  return app
}
