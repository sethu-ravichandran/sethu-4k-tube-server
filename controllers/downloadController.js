import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const downloadsDir = path.join(__dirname, '..', 'downloads')

const parseProgress = (dataStr) => {
  const match = dataStr.match(/(\d+\.\d+)%/)
  return match ? parseFloat(match[1]) : null
}

const downloadVideo = (request, response, io) => {
  const socketIO = request.io
  if (!socketIO) {
    console.error('Socket.io instance not found on request')
    return response.status(500).json({ error: 'Internal Server Error' })
  }

  const { url, quality } = request.body

  let format
  switch (quality) {
    case '4k':
      format = 'bestvideo[height<=2160]+bestaudio/best'
      break
    case '1080p':
      format = 'bestvideo[height<=1080]+bestaudio/best'
      break
    case 'best':
    default:
      format = 'bestvideo+bestaudio/best'
      break
  }

  const filenameTemplate = `${downloadsDir}/%(title)s.%(ext)s`
  const ytDlp = spawn('yt-dlp', [
    '-f', format,
    '--recode-video', 'mp4',
    '-o', filenameTemplate,
    url,
  ])

  console.log(`Downloading: ${url}`)

  ytDlp.stdout.on('data', (data) => {
    const line = data.toString()
    const progress = parseProgress(line)
    if (progress !== null) {
      socketIO.emit('download-progress', { url, progress })
    }
    console.log(`stdout: ${line}`)
  })

  ytDlp.stderr.on('data', (data) => {
    const line = data.toString()
    const progress = parseProgress(line)
    if (progress !== null) {
      socketIO.emit('download-progress', { url, progress })
    }
    console.error(`stderr: ${line}`)
  })

  ytDlp.on('close', (code) => {
    console.log(`yt-dlp process exited with code ${code}`);
  
    // Find the most recently downloaded file
    fs.readdir(downloadsDir, (err, files) => {
      if (err || !files.length) {
        socketIO.emit('download-complete', { url, success: false });
        return;
      }
  
      const sorted = files
        .map(name => ({
          name,
          time: fs.statSync(path.join(downloadsDir, name)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
  
      const latestFile = sorted[0].name;
  
      socketIO.emit('download-complete', {
        url,
        success: code === 0,
        filename: latestFile,
      });
    });
  });
  

  response.status(200).json({ message: 'Download started successfully!' })
}

export default downloadVideo
