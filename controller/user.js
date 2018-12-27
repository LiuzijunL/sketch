const conn = require('../bd/bd.js')
const moment = require('moment')
const mditor = require("mditor");
const parser = new mditor.Parser()

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
    },
    //修改个人信息
    postBasic:(req,res)=>{
        const data = req.body
        const sql1 = 'select count(*) as count from users where nickname=?'
        conn.query(sql1,data.nickname,(err,result)=>{
            if(err) return res.send({status:401,msg:'出现错误,请重试!'})
            if(result.length !== 1) return res.send({status:402,msg:'昵称已被注册,请重新修改!'})
            const sql2 = 'update users set ? where id= ?'
            conn.query(sql2,[data,data.id],(err,result)=>{
                if(err) return res.send({status: 403,msg:'修改失败!'})
                if(result.affectedRows !== 1) return res.send({status: 404,msg:'修改失败!'})
                const sql3 = 'select * from users where id= ? '
                conn.query(sql3,data.id,(err,result)=>{
                    //重新挂载用户信息
                    req.session.userInfo = result[0]
                    res.send({status:200,msg:'修改成功!'})
                })
            })
        })
    },
    //访问文章页面
    getWriter:(req,res)=>{
        if(!req.session.islogin) return res.redirect('/login')
        res.render('./user/writer.ejs',{
            user: req.session.userInfo,
            islogin: req.session.islogin
        })
    },
    //访问文章详情页
    getShow:(req,res)=>{
        res.render('./user/show.ejs',{
            user: req.session.userInfo,
            islogin: req.session.islogin
        })
    },
    //写文章
    postWriter:(req,res)=>{
        const data = req.body
        data.ctime = moment().format('YYYY.M.D HH:mm:ss')
        data.authorId = req.session.userInfo.id
        const sql = 'insert into articles set ?'
        conn.query(sql,data,(err,result) =>{
            if(err) return res.send({status: 400,msg: '添加文章出错,请重试!'})
            if(result.affectedRows !== 1) return res.send({status: 402,msg: '添加文章失败!'})
            res.send({status:200,msg:'添加文章成功',userId: result.insertId})
        })

    },
    postShow:(req,res)=>{
        const id = req.body.id
        const sql = `select a.id,a.title,a.content,a.ctime,a.praise,u.nickname,u.headPortrait from articles as a
        left join users as u
        on a.authorId = u.id`
        conn.query(sql,id,(err,result)=>{
            if(err) return res.send({status: 400,msg:'访问出错!'})
            res.send({status:200,msg:'查询成功',result:result[0]})
        })
    }

}

module.exports = ctry