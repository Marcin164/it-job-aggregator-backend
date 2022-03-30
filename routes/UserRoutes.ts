const { Router } = require('express')
const UserController = require("../controllers/UserController.ts")

const router = Router()

router.post('/user/login', passport.authenticate('local'), (req:any, res:any) => {
    res.status(200)
})
router.post('/user/register', UserController.register_post)
router.post('/user/verifyAccount', UserController.verifyAccount_post)

module.exports = router  