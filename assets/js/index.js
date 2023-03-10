$(() => {
    getUserInfo()

    // 绑定退出的事件处理函数
    $('#btn-Logout').click(() => {
        // 提示用户是否退出
        layer.confirm('确定退出登录?',
            { icon: 3, title: '提示' },
            function (index) {
                //do something
                // 1.清空本地存储中的token
                localStorage.removeItem('token')
                // 2. 重新跳转到登录页
                location.href = '/login.html'

                // 关闭confim询问框
                layer.close(index)
            });
    })
})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: (res) => {
            if (res.status !== 0) return layui.layer.msg(res.message)

            // 使用rederAvater()渲染用户的头像
            rederAvater(res.data)
        },

        // 不论成功还是失败，最终都会调用complete回调函数
        // complete:function(res){
        //     // console.log(res.responseJSON);
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if(res.responseJSON.status === 1&&res.responseJSON.message==="身份认证失败！"){
        //         // 1.强制清空token，
        //         localStorage.removeItem('token')
        //         // 2.跳转到登录页面
        //         location.href='/login.html'
        //     }
        // }
    })
}



// 渲染用户的头像
function rederAvater(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
    //    2.设置欢迎的 文本
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
    //    3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').attr('src', user.user_pic).hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}