/* ajax请求数据 */
$(function () {
    var pageid = 1;
    show(pageid);
    lazyload();
    //获取数据,渲染界面
    function show(pageid) {
        $.ajax({
            url: "http://139.199.192.48:9090/api/getmoneyctrl",
            datatype: "jsonp",
            data: {
                "pageid": pageid,
            },
            success: function (data) {
                // 获取数据渲染界面
                console.log(data);
                $("#total_goods").prepend(template('template', data));
                //将id数据的id绑定在data上
            }
        })
    }

    // 设置懒加载模式
    function lazyload() {
        //设置手指触摸的起始位置
        var startY;
        //弹簧 的长度
        var string = 100;
        var timerid;
        var distance;
        //设置弹簧的长度
        $("#total_goods").on("touchstart", function (event) {
            //判断手指按下的坐标
            if (event.targetTouches.length > 1) {
                return;
            }
            // 记录手指按下的的位置
            startY = event.targetTouches[0].clientY;
        })
        //手指移动
        $("#total_goods").on("touchmove", function (event) {
            if (event.targetTouches.length > 1) {
                return;
            }
            //记录当前移动的坐标
            var moveY = event.targetTouches[0].clientY;
            //当前移动的距离
            distance = moveY - startY;
            if (distance > string) {
                distance = string;
                //设置懒加载请求数据
                $(this).css({
                    "transition": "all 0.5",
                    "transform": "translateY(" + distance + "px)"
                })
            }

        })
        // 手指移开
        $("#total_goods").on("touchend", function (event) {
            if (event.changedTouches > 1) {
                return;
            }
            if (distance == string) {
                pageid++;

            }
            var num = 1;
            timerid = setInterval(function () {
                // console.log(1);
                num++;
                $(".load_state").css({
                    "transform": "rotateZ(" + num + "deg)",
                })
            }, 5);

            $.ajax({
                url: "http://139.199.192.48:9090/api/getmoneyctrl",
                type: "get",
                data: {
                    "pageid": pageid,
                },
                success: function (data) {
                    distance = 0;
                    $("#total_goods").css({
                        "transition": "all 1s",
                        "transform": "translateY(" + distance + "px)"
                    })
                    // 获取数据渲染界面
                    console.log(data);
                    console.log(pageid)
                    $("#total_goods").prepend(template('template', data));
                    clearInterval(timerid);
                }
            })


        })

    }

    function getCookie(name) {
        // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }
        return null;
    }
    // 有个问题，如果传入的name属性，在修改之前就存在了，是不是需要修改~？
    function setCookie(name, value) {
        var Days = 10; //此 cookie 将被保存 30 天
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        if ((typeof value == "string") && (value.length > 0)) {
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        } else {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }

})