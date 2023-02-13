$(() => {

    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间格式的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d}''${hh}:${ss}:${ss}`
    }


    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示的数据，默认两天
        cate_id: '', //	文章分类的 Id
        state: ''  //文章的f发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //  使用模板引擎渲染页面的数据
                var htmls = template('tpl-table', res)
                $('tbody').html(htmls)
                // 调用分页的方法
                renderPage(res.total)
            }

        })
    }


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎渲染分类的可选项
                var htmls = template('tpl-cate', res)
                $('[name=cate_id]').html(htmls)
                //    通知leyui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }



    // 为筛选表单绑定submit事件
    $('#form-search').submit(function (e) {
        e.preventDefault()
        //    获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypge.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,//每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: q.pagenum,//设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时触发jump回调
            // 触发jump回调的方式有两种
            // 1.点击页码的时候会触发
            // 2.只要调用了laypage.render()方法,就会触发
            jump: function (obj, first) {
                // 把最新的页码值赋值到q这个参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表，并渲染表格
                // 通过first值来判断用的哪种方法触发的jump的回调
                // true2,false1
                if (!first) {
                    initTable()
                }
            }
        })
    }



    // 通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        console.log(1);
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 当数据完成删除后需要判断当前页是否还有剩余的数据，如果没有剩余的数据了则让页码值-1之后，再重新调用initTable方法
                    if (len === 1) {
                        // 如果值为1，就等于删除完毕页面上没有任何数据了
                        // 頁碼值最小必须是1
                        q.pagenum = q.pagenum===1?1:q.pagenum-1
                    }
                    initTable()
                }
            })

            layer.close(index);
        })
    })
})