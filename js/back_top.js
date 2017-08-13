// 返回顶部小火箭
(function (window) {
    function Back_top() {
        // 初始化
        this.init();
        this.execute();
    }
    Back_top.prototype = {
        constructor: Back_top,
        init: function () {
            this.createle();
        },
        execute: function () {
            this.move();
        },
        createle: function () {
            //创建一个小火箭的元素
            var ele = '<div id="back_top" class="icon-double-angle-up"></div>';
            //将这个节点添加到页面中去
            $("body").append(ele);
            $("#back_top").css({
                "position": "fixed",
                "right": "10px",
                "bottom": "120px",
                "width": "40px",
                "height": "40px",
                "display": "none",
                "border-radius": "50%",
                "background-color": "rgba(100, 100, 100,.5)",
                "text-align":"center",
                "font-size": "40px",
                "color": "#fff",
            })
        },
        move: function () {
            //判断页面卷曲的高度
            var leader = 0;
            // var $("body")[0].timer = null;
            window.onscroll = function () {
                //判断页面被卷去的顶部是否超过1000px
                if (scroll().top > 1000) {
                    $("#back_top").css({
                        "display": "block",
                    }).click(function($e){
                        $e.stopPropagation();
                    })

                 } else {
                    $("#back_top").css({
                        "display": "none"
                    })
                }
                //leader的值就是页面的纵坐标y；被卷去的部分就是y；
                leader = scroll().top;
            }
            //点击滚动
            $("#back_top").click(function () {
                //                window.scrollTo(0,0);
                $("body")[0].timer = setInterval(function () {
                    //缓慢的移动到顶部；(模拟缓动动画)
                    //获取步长
                    var step = (0 - leader) / 10;
                    //二次处理
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    //赋值
                    leader = leader + step;
                    window.scrollTo(0, leader);
                    //判断；清除定时器
                    if (leader <= 0) {
                        clearInterval($("body")[0].timer);
                    }
                }, 20);
            })
            
            window.onmousewheel =document.body.click=function(){
                 clearInterval($("body")[0].timer);
            }
            //兼容性问题
            function scroll() {
                return {
                    top: window.pageYOffset || document.documentElement.scrollTop,
                    left: window.pageXOffset || document.documentElement.scrollLeft
                }
            }
        },
        //滚动函数
    }
    //暴露代码
    window.Back_top = window.Bt = Back_top;
}(window));