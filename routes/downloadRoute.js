import { Router } from 'express'
import downloadVideo from '../controllers/downloadController.js'
import validateYoutubeUrl from '../middlewares/validateYouTubeURL.js'

const router = Router()

// API route for downloading
router.post('/download', validateYoutubeUrl, downloadVideo)

export default router
