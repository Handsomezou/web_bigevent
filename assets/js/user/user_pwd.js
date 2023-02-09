$(() => {


    // 定义校验规则
    var form = layui.form
    form.verify({
        // 校验原密码
        oldPwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验新密码
        newPwd: function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同'
            }
        },
        // 校验确认密码
        repwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '请确认新密码！'
            }
        }
})

$('.layui-form').submit(function(e){
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/updatepwd',
        data:$(this).serialize(),
        success:function(res){
           if(res.status !== 0){
            return layer.msg(res.message)
           }
           layer.msg(res.message)
        //    重置表单
           $('.layui-form')[0].reset()
        }
    })
})
})