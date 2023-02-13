$(() => {
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()


    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 調用模板引擎，渲染分类的下拉列表
                var htmls = template('tpl-cate', res)
                $('[name=cate_id]').html(htmls)
                // 一定要记得调用form.render()方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // var file = e.target.files[0]
    // var newImgURL = URL.createObjectURL(file)
    // $image
    //     .cropper('destroy')      // 销毁旧的裁剪区域
    //     .attr('src', newImgURL)  // 重新设置图片路径
    //     .cropper(options)        // 重新初始化裁剪区域
    // $image
    //     .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    //         width: 400,
    //         height: 280
    //     })
    //     .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    //         // 得到文件对象后，进行后续的操作
    //     })

    //   为选择封面的按钮添加点击事件
    $('#btnChoseImage').click(function () {
        $('#coverFile').click()
    })


    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').change(function (e) {
        // 获取到文件的列表数组
        var files = e.target.files[0]
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').click(function () {
        art_state = '草稿'
    })


    // 为表单体检submit提交事件
    $('#form-pub').submit(function (e) {
        e.preventDefault()
        // 基于form快速创建FormData对象
        var fd = new FormData($(this)[0])

        //   将文章的发布状态存到fd中
        fd.append('state', art_state)


        //将封面裁剪过后的图片，输出为一个文件对象 
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 將文件對象存储到fd中
                fd.append('cover_img', blob)
                // 6.发起ajax数据请求
                console.log(fd);
                publishArticle(fd)
            })
    })


    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果像服务器提交的是FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发表失败！')
                }
                // layer.msg(res.message)
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})