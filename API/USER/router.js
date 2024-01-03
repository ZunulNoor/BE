const { createUser, getUser, login } = require('./controller')
const router = require('express').Router()
router.post("/signup",  createUser)
router.post("/login", login)
router.get("/get-all-user",  getUser)

module.exports = router