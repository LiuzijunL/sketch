const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var session = require('express-session')
// 注册 session 中间件
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60 }//设置cookie的寿命
}))
//使用模板
app.set('view engin','ejs')
app.set('views','./views')
//资源静态托管
app.use('/node_modules',express.static('./node_modules'))
app.use('/picture',express.static('./picture'))
app.use('/images',express.static('./images'))
//注册表单中间件
app.use(bodyParser.urlencoded({extended:false}))
// const cors = require('cors')
// app.use(cors())

const router = require('./router/router.js')
app.use(router)

app.listen(3000,()=>{
    console.log('running at http://127.0.0.1:3000')
})