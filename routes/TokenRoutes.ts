import { Router } from 'express'
const TokenController = require("../controllers/TokenController.ts")

const router = Router()

router.post('/token/refresh', TokenController.refreshToken_post)

export default router