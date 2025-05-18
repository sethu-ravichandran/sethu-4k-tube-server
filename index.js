import http from 'http'
import { Server } from 'socket.io'
import { createApp } from './app.js'
import createDownloadDirectory from './utils/createDownloadDirectory.js'

const PORT = process.env.PORT || 3500

createDownloadDirectory()

const httpServer = http.createServer()

const io = new Server(httpServer, {
  cors: {
    origin: 'https://sethu-4k-tube-client.vercel.app', // ✅ Secure origin
    methods: ['GET', 'POST'],
    credentials: true
  }
})

const app = createApp(io)

httpServer.on('request', app)

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`)

  socket.on('ping', () => {
    console.log('📡 Received ping')
    socket.emit('pong')
  })

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`)
  })
})

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
