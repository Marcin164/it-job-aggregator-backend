const { Router } = require('express')
const UserController = require("../controllers/UserController.ts")

const router = Router()

router.post('/user/register', UserController.register_post)

module.exports = router