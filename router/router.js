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

router.post('/settings/basic',ctry.postBasic)
//访问文章页
router.get('/writer',ctry.getWriter)
//文章详情页面
router.get('/show/:id',ctry.getShow)
router.post('/show',ctry.postShow)
//写文章
router.post('/writer/add',ctry.postWriter)
//主页显示最新文章
router.post('/show/newArticles',ctry.showArticles)
//评论
router.post('/articles/discuss',ctry.showDiscuss)

module.exports = router