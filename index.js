import http from 'http'
import { Server } from 'socket.io'
import { createApp } from './app.js'
import createDownloadDirectory from './utils/createDownloadDirectory.js'

createDownloadDirectory()

const PORT = process.env.PORT || 3500

const app = createApp()

const httpServer = http.createServer(app)

const io = new Server(httpServer, { cors: { origin: '*' } })

app.set('io', io) // set io instance on app

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})

