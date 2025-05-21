import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getIOInstance } from '../socket/ioInstance.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const downloadsDir = path.join(__dirname, '..', 'downloads')

// Path to the bundled yt-dlp binary inside the 'bin' directory
const ytDlpPath = path.join(__dirname, '..', 'bin', 'yt-dlp')

const parseProgress = (dataStr) => {
  const match = dataStr.match(/(\d+\.\d+)%/)
  return match ? parseFloat(match[1]) : null
}

const downloadVideo = (req, res) => {
  const socketIO = getIOInstance()
  const { url, quality } = req.body

  const formatMap = {
    '4k': 'bestvideo[height<=2160]+bestaudio/best',
    '1080p': 'bestvideo[height<=1080]+bestaudio/best',
    default: 'bestvideo+bestaudio/best'
  }

  const format = formatMap[quality] || formatMap.default
  const filenameTemplate = `${downloadsDir}/%(title)s.%(ext)s`

  // Use the local yt-dlp binary with full path
  const ytDlp = spawn(ytDlpPath, [
    '-f',
    format,
    '--recode-video',
    'mp4',
    '-o',
    filenameTemplate,
    url
  ])

  res.status(200).json({ message: 'Download started successfully!' })

  const handleProgress = (data) => {
    const line = data.toString()
    const progress = parseProgress(line)
    if (progress !== null) {
      socketIO.emit('download-progress', { url, progress })
    }
  }

  ytDlp.stdout.on('data', handleProgress)
  ytDlp.stderr.on('data', handleProgress)

  ytDlp.on('close', (code) => {
    fs.readdir(downloadsDir, (err, files) => {
      if (err || !files.length) {
        socketIO.emit('download-complete', { url, success: false })
        return
      }

      const latestFile = files
        .map((name) => ({
          name,
          time: fs.statSync(path.join(downloadsDir, name)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)?.[0]?.name

      socketIO.emit('download-complete', {
        url,
        success: code === 0,
        filename: latestFile
      })
    })
  })
}

export default downloadVideo
