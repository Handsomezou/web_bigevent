$(()=>{
var form = layui.form
form.verify({
    nickname:(value)=>{
        if(value.length > 6){
            return "昵称长度必须在 1 ~ 6 个字符之间"
        }
    }
})
initUserInfo()
function initUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function(res){
            if(res.status !== 0){
                return layer.msg(res.message)
            }
        //    调用form.val()快速为表单赋值
        form.val('formUserInfo',res.data)
        }
    })
}



// 设置重置按钮
$('#btnReset').click(function(e){
    // 阻止表单的默认重置行为
    e.preventDefault()
    initUserInfo()
})


// 发起更新用户的信息
$('.layui-form').submit(function(e){
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data:$(this).serialize(),
        success:function (res) {
           if(res.status !== 0 )return layer.msg(res.message)
           layer.msg(res.message)
        //    调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
        }
    })
})
})