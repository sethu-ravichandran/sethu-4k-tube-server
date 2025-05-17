export default function validateYoutubeUrl(req, res, next) {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'YouTube URL is required' })
  }

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
  if (!youtubeRegex.test(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }
  console.log(`URL validation successful.`)

  next()
}
