import { Router } from 'express'
const router = Router()
import downloadVideo  from '../controllers/downloadController.js'
import validateYoutubeUrl from '../middlewares/validateYouTubeURL.js'

router.post('/download', validateYoutubeUrl, downloadVideo)

export default router
