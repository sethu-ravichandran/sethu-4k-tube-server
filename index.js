import http from 'http'
import { Server } from 'socket.io'
import { createApp } from './app.js'
import createDownloadDirectory from './utils/createDownloadDirectory.js'
import { setIOInstance } from './socket/ioInstance.js' // 🔑

const PORT = process.env.PORT || 3500

createDownloadDirectory()

const app = createApp()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: [
      'https://sethu-4k-tube-client.vercel.app',
      'http://localhost:5173',
      'https://sethu-4k-tube-server.onrender.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// 🔌 Save reference globally (optional, clean)
setIOInstance(io)

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
