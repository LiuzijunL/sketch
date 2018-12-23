const conn = require('../bd/bd.js')
const moment = require('moment')

//用户路由
const ctry = {
    getApi:(req,res)=>{
        res.render('index.ejs',{
            user: req.session.userInfo,
            islogin: req.session.islogin
        })
    },
    getLogin:(req,res)=>{
        res.render('./user/login.ejs',{})
    },
    getLogup:(req,res)=>{
        res.render('./user/logup.ejs',{})
    },
    //注册
    postRegister:(req,res)=>{
        const data = req.body;
        const sql1 = 'select count(*) as count from users where username= ? or nickname= ?'
        conn.query(sql1,[data.username,data.nickname],(err,result)=>{
            if(err) return res.send({status: 400,msg:'注册失败,请重试!'})
            if(result[0].count !== 0) return res.send({status: 401,msg:'用户名重复或手机号被注册,请重新填写!'})
            //默认头像
            data.headPortrait = '/images/user.jpg';
            //注册时间
            data.ctime = moment().format('YYYY-M-D');
            const sql2 = 'insert into users set ?'
            conn.query(sql2,data,(err,result)=>{
                if(err) return res.send({status: 402,msg:'注册失败!'})
                res.send({status:200,msg:"注册成功"})
            })
        })
    },
    //登录
    postLogin:(req,res)=>{
        const data = req.body
        const sql = 'select * from users where username=? and  password=? '
        conn.query(sql,[data.username,data.password],(err,result)=>{
            if(err) return res.send({status: 402,msg:'用户名或密码错误!'})
            if(result.length !== 1) res.send({status: 401,msg:'登录失败,请重试!'})
            //登录成功记录下来
            req.session.userInfo = result[0]
            //把用户登录的结果挂载在 session 上
            req.session.islogin = true;
            res.send({status:200,msg:'登录成功!'})
        })
    },
    //注销
    getlogout:(req,res)=>{
        req.session.destroy(function(err) {
            // 使用 res.redirect 方法，可以让 客户端重新访问 指定的页面
            res.redirect('/')
        })
    },
    getBasic:(req,res)=>{
        //判断是否登录
        if(!req.session.islogin) return res.redirect('/login')
        res.render('./user/settings.ejs',{
            user: req.session.userInfo,
            islogin: req.session.islogin
        })
    }
}

module.exports = ctry