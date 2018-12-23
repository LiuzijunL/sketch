const express = require('express')
const router = express.Router()

const ctry = require('../controller/user.js')

router.get('/',ctry.getApi)

router.get('/login',ctry.getLogin)

router.get('/logup',ctry.getLogup)
//注册
router.post('/register',ctry.postRegister)
//登录
router.post('/login',ctry.postLogin)
//注销
router.get('/logout',ctry.getlogout)
//设置
router.get('/settings/basic',ctry.getBasic)

module.exports = router