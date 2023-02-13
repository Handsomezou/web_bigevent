$(()=>{
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message)
                }
              var htmls =  template('tpl-table',res)
                $('tbody').html(htmls)
            }
        })
    }


// 为添加类别按钮绑定点击事件
    $('#btnAddCate').click(function(){
        layer.open({
            type: 1, 
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          })
    })
    

    // 给form-add添加submit事件，因为他是在script中动态生成的，所以要通过代理的形式给他添加事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$('#form-add').serialize(),
            success:function(res){
                if(res.status !==0){
                    console.log(res);
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg(res.message)
                
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理的形式为btn-edit按钮绑定点击事件
    var form = layui.form
    var indexEdit = null
    $('tbody').on('click','.btn-edit',function(){
        // 弹出一个修改文章信息的图层
        indexEdit = layer.open({
            type: 1, 
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
          })
          var id = $(this).attr('data-id')
        //   发起请求获取对应分类的数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates'+id,
            success:function(res){
                console.log(res);
                form.val('form.edit',res.data)
            }
        })
    })


// 通过代理的形式，为修改分类的表单绑定submit事件
$('body').on('submit','#form-edit',function(e){
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/article/updatecate',
        data:$(this).serialize(),
        success:function(res){
            console.log(res);
            if(res.status !== 0 ){
                return layer.msg(res.mseeage)
            }
            layer.msg(res.mseeage)
            layer.close(indexEdit)
            initArtCateList()
        }
    })
})


    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
       
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    console.log(res);
                }
            })
            layer.close(index);
          })
    })
})