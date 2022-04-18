import { Router } from 'express'
import jwt from "jsonwebtoken"
const UserController = require("../controllers/UserController.ts")

const router = Router()

const auth = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token === null) return res.status(401)

    try {
        jwt.verify(token, "secretOne", (err: any, user: any) => {
            if(err) throw err

            req.user = user
            next()
        })
    } catch (error) {
        console.log(error) 
    }

}

router.post('/user/login', UserController.login_post)
router.post('/user/register', UserController.register_post)
router.post('/user/verifyAccount', auth, UserController.verifyAccount_post)
router.post('/user/setWorkPreferences', auth, UserController.setWorkPreferences_post)

export default router  