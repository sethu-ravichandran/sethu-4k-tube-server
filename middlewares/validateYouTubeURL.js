const validateYoutubeUrl = (request, response, next) => {
  const { url } = request.body

  if (!url) {
    return response.status(400).json({ error: 'YouTube URL is requestuired' })
  }

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  if (!youtubeRegex.test(url)) {
    return response.status(400).json({ error: 'Invalid YouTube URL' })
  }

  console.log('URL validation successful.')
  next()
}

export default validateYoutubeUrl
