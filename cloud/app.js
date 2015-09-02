// 在 Cloud code 里初始化 Express 框架


var express = require('express');
var AV = require('leanengine');

var app = express();

// 声明使用lean cloud 功能
app.use(AV.Cloud);
// 加载 cookieSession 以支持 AV.User 的会话状态
// 使用 AV.Cloud.CookieSession 中间件启用 CookieSession，注意传入一个 secret 用于 cookie 加密（必须）。它会自动将AV.User的登录信息记录到 cookie 里，用户每次访问会自动检查用户是否已经登录，如果已经登录，可以通过 req.AV.user 获取当前登录用户。
app.use(AV.Cloud.CookieSession({ secret: 'my secret', maxAge: 3600000, fetchUser: true }));

app.get('/login', function(req, res) {
  // 渲染登录页面
  res.render('login.ejs');
});
// 点击登录页面的提交将出发下列函数
app.post('/login', function(req, res) {
  AV.User.logIn(req.body.username, req.body.password).then(function(user) {
    //登录成功，AV.Cloud.CookieSession 会自动将登录用户信息存储到 cookie
    //跳转到profile页面。
    console.log('signin successfully: %j', user);
    res.redirect('/profile');
  },function(error) {
    //登录失败，跳转到登录页面
    res.redirect('/login');
  });
});
//查看用户profile信息
app.get('/profile', function(req, res) {
  // 判断用户是否已经登录
  if (req.AV.user) {
    // 如果已经登录，发送当前登录用户信息。
    res.send(req.AV.user);
  } else {
    // 没有登录，跳转到登录页面。
    res.redirect('/login');
  }
});

//调用此url来登出帐号
app.get('/logout', function(req, res) {
  // AV.Cloud.CookieSession 将自动清除登录 cookie 信息
  AV.User.logOut();
  res.redirect('/profile');
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();

