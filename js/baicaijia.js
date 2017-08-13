   //点击搜索按钮时显示搜素框
    $('.cheap-nav-right').tap(function () {
        if ($(this).hasClass('show')) {

            $(this).removeClass('show');
            $('.cheap-search').show();
            $('.cheap-icon-search').attr('class', 'deselect')

        } else {
            $('.cheap-search').hide();
            $(this).addClass('show');
            $('.deselect').attr('class', 'cheap-icon-search')

        }
    })
    //页面加载的时候 获取到tab栏的标题数据
    $.ajax({
        url: 'http://139.199.192.48:9090/api/getbaicaijiatitle',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            var cheapBannerContent = $('.cheap-banner').html();
            var titleId = 0;
            $('.cheap-menu').html(template('template', data));
            //加载出来的li标签获取到li标签全部的宽度
            var cheapLis = document.querySelectorAll('.cheap-menu>li');
            var cheapLi_a = document.querySelectorAll('.cheap-menu>li a');

            var lisWidth = 0;
            for (var i = 0; i < cheapLis.length; i++) {
                lisWidth += $(cheapLis[i]).width();
                //点击导航栏上的li标签 获取它对应的id 并重新发送数据去服务器 渲染页面
                //并且点击li给它对应的a标签添加特殊样式
                $(cheapLis[i]).tap(function () {
                    titleId = $(this).attr('id');
                    var cheapLi_a_content = $(cheapLi_a[titleId]).html();

                    if (titleId != 0) {
                        document.querySelector('.cheap-banner').innerHTML = '';
                        document.querySelector('.cheap-head-center h1').innerHTML =
                            cheapLi_a_content + '-白菜价';
                    } else {
                        $('.cheap-banner').html(cheapBannerContent);

                        document.querySelector('.cheap-head-center h1').innerHTML = '白菜价-淘宝内部券';
                    }
                    for (var j = 0; j < cheapLi_a.length; j++) {
                        $(cheapLi_a[j]).removeClass('active');
                    }
                    $(cheapLi_a[titleId]).addClass('active');


                    getCheapData(titleId);
                })
            }
            $('.cheap-menu').attr('style', 'width:' + (lisWidth + 1) + 'px');
            //请求回来数据初始化整个页面
            cheapLis[0].firstElementChild.classList.add('active');
            getCheapData(titleId);
        }
    });

    //tab导航栏实现左右滑动效果

    var myScroll = new IScroll('#wrapper', {
        scrollX: true,
        freeScroll: true
    });

    //请求商品列表数据的方法
    function getCheapData(id) {
        $.ajax({
            url: 'http://139.199.192.48:9090/api/getbaicaijiaproduct',
            data: {
                titleid: id
            },
            type: 'get',
            success: function (data) {
                $('.cheap-product-list').html(template('template1', data));
                //请求数据以后获取到进度条的百分比
                var cheapProgress = $('.product-progress .progress-inner');
                var progress_spans = $('.product-progress .bar>i span');
                for (var i = 0; i < cheapProgress.length; i++) {
                    $(cheapProgress[i]).attr('style', 'width:' + $(progress_spans[i]).html().replace(/%/,
                        "") + 'px');
                }
            }
        })
    }

    //当页面滑到一定位置时出现小火箭
    function showRocket() {
        window.onscroll = function () {
            var pageHeight = document.body.scrollTop;
            if (pageHeight > 300) {
                $('.cheap-rocket').show();
            } else {
                $('.cheap-rocket').hide();
            }
            //点击火箭的时,返回页面顶部
            $('.cheap-rocket').tap(function () {

                $('body').scrollTo();
            })
        }
    }
    showRocket();
    //小火箭返回顶部动画效果
    $.fn.scrollTo = function (options) {
        var defaults = {
            toT: 0, //滚动目标位置
            durTime: 500, //过渡动画时间
            delay: 30, //定时器时间
            callback: null //回调函数
        };
        var opts = $.extend(defaults, options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(), //滚动条当前的位置
            subTop = opts.toT - curTop, //滚动条目标位置和当前位置的差值
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function (t) {
                index++;
                var per = Math.round(subTop / dur);
                if (index >= dur) {
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if (opts.callback && typeof opts.callback == 'function') {
                        opts.callback();
                    }
                    return;
                } else {
                    _this.scrollTop(curTop + index * per);
                }
            };
        timer = window.setInterval(function () {
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };

