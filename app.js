import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import downloadRoutes from './routes/downloadRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createApp = (io) => {
  const app = express()

  app.set('io', io)

  app.use(cors({
    origin: 'https://sethu-4k-tube-client.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }))

  app.use(express.json())

  app.use((req, res, next) => {
    req.io = app.get('io')
    next()
  })

  app.use('/api', downloadRoutes)

  const downloadsPath = path.join(__dirname, 'downloads')
  app.use('/downloads', express.static(downloadsPath))

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })

  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  })

  return app
}
