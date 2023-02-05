$(function () {
  // 实现登录与注册之间的切换
  $('#link_login').click(function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_reg').click(function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })


  // 从layui中获取一个from对象
  // console.log(layui);
  var form = layui.form
  // 通过form.verify()函数自定义校验规则
  form.verify({
    // 自定义了一个叫pwd的校验规则
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],


    //校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框里的内容
      // 还需要拿到密码框的内容
      // 然后进行一次等于的判断
      // 如果判断失败则return一个提示消息即可
      var pwd = $('.reg-box [name="password"]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })


  // 监听注册表单的提交事件
  $('#form-reg').submit((e) => {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起post请求
    $.post('/api/reguser', { username: $('#form-reg [name="username"]').val(), password: $('#form-reg [name="password"]').val() }, function (res) {
      // layer.msg使用layui内置的弹出层
      if (res.status !== 0) return layer.msg(res.message);
      layer.msg(res.message);
      // 调用去登录的点击事件
      $('#link_reg').click()
    })
  })


  // 调用接口发起登录的请求
  $('#form-login').submit(function (e) {
    // 阻止表单的默认提交
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        layer.msg使用layui内置的弹出层
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message);
        // 将登录成功得到的token字符串保存到localStorage中
        localStorage.setItem('token', res.token)
        console.log(res);
        //跳转到后台主页
        location.href = './index.html'
      }
    })


    // $.post('http://www.liulongbin.top:3007/api/login',
    //   { $(this).serialize() }, function (res) {
    //     // layer.msg使用layui内置的弹出层
    //     if (res.status !== 0) return layer.msg(res.message);
    //     layer.msg(res.message);
    //     // 将登录成功得到的token字符串保存到localStorage中
    //     localStorage.setItem('token', res.token)
    //     console.log(res);
    //     //跳转到后台主页
    //     location.href = './index.html'
    //   })
  })
})