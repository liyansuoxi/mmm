/**
 * Created by hodo on 2017/8/2.
 */


$(function () {

    loadData("data", function (data) {
        var frag = document.createDocumentFragment();
        var $a, $li;

        data.result.forEach(function (ele) {
            // 创建标签
            $a = $("<a>", {
                href: "javascript:void(0)"
            }).html(ele.title).append($("<span>", {
                class: 'icon-sort-down'
            }).data("target", "icon")).data("titleId", ele.titleId);
            $li = $("<li>", {
                class: "item"
            }).append($a);
            frag.appendChild($li[0]);
        });

        // 添加到页面上
        $(".classifyTitle .list").append(frag);

        /* 分类列表点击事件 */
        var classifyTitle = new zp.categoryHandle.ClassifyTitle(".classifyTitle .list");


        /* 可以在这里发送请求 */

        /* 打印信息 */
        console.log("%c标题数据获取成功", "color: green");
    });

    /* 返回顶部-小火箭 */
    var $body = $("body");
    $("[data-target='scrollTo']").click(function ($e) {
        $e.stopPropagation();
        window.clearInterval($body[0]._timer);
        $body.zpScrollTo();
    });
    // 清除定时器
    window.onmousewheel = window.onclick = function () {
        window.clearInterval($body[0]._timer);
    };


    /* 实现头部广告栏 - 固定导航栏效果 */
    new zp.categoryHandle.Banner(".banner-app");
    new zp.categoryHandle.Banner(".open-localapp");


    /* 底部波浪特效 */
    waveAnimate();
    function waveAnimate() {
        var demo = document.getElementById("demo");
        if(!demo) {
            return;
        }
        var html_fs = parseInt($("html").css("font-size"));

        // 配置信息
        demo.config = new function config() {
            Object.defineProperties.call(this, this, {
                // 设置成不能被修改
                height: getObj(8),
                width: getObj(3),
                marginLeft: getObj(3),
                count: getObj(Math.floor((demo.offsetWidth - 3) / 6)),
                scale: getObj(35),
                y: getObj(.25 * html_fs)
            });
            Object.defineProperty(this, "top", getObj((demo.offsetHeight - this.height) / 2));
            // 计算步长要使用的变量
            this.oldX = 0;
            this.distance = 0;
            this.step = 0;
        };

        // 动态创建span标签
        var frag = document.createDocumentFragment();
        for (var i = 0, len = demo.config.count; i < len; i++) {
            var span = document.createElement("span");
            span.setAttribute("class", "line");
            span.style.left = ((i + 1) * demo.config.marginLeft + i * demo.config.width) + "px";
            frag.appendChild(span);
        }
        demo.appendChild(frag);

        // 获取 所有 span 标签
        var lines = document.querySelectorAll(".line");

        // 兼容 ie
        if (!lines.forEach) {
            lines.constructor.prototype.forEach = function (callback, obj) {
                for (var i = 0, len = this.length; i < len; i++) {
                    callback.call(obj, this[i], i, this);
                }
            };
        }


        // span 标签初始化
        resetSpan();

        // 配置 config 的时候使用
        function getObj(value) {
            return {value: value, writable: false};
        }

        // 重置 span 标签
        function resetSpan() {
            lines.forEach(function (ele) {
                ele.style.top = demo.config.top + "px";
                ele.style.background = "#d3d9dc";
            });
        }

        // 为每个 line 添加方法, 添加到原型上
        HTMLSpanElement.prototype.top = function (value) {
            if (value != null) {
                this.style.top = value + "px";
                return this;
            }
            return parseFloat(this.style.top);
        };
        HTMLSpanElement.prototype.left = function (value) {
            if (value != null) {
                this.style.left = value + "px";
                return this;
            }
            return parseFloat(window.getComputedStyle(this, null).left);
        };
        // 开始时间
        demo.addEventListener("touchmove", function (e) {
            lines.forEach(function (ele) {
                ele.style.background = "#ef553b";
            })
        });
        // 移动事件
        demo.addEventListener("touchmove", function (e) {
            // 兼容 ie
            e = e || window.e;
            e.target = e.target || e.srcElement;
            if (e.target === this) {
                lineMove.call(this, e);
            } else {
                lineMove.call(this, e);
            }
        });
        // 移出事件
        demo.addEventListener("touchend", resetSpan);

        function lineMove(e) {
            this.config.step = parseFloat(e.touches[0].pageX - this.config.oldX);
            this.config.distance += this.config.step / this.config.scale;

            // 设置所有的 line 标签的 xy
            lines.forEach(function (ele) {
                var x = ele.left() / this.config.scale - this.config.distance - 1.5;
                var y = this.config.y;
                ele.top(y * Math.sin(x) + this.config.top);
            }, this);
            this.config.oldX = e.touches[0].pageX;
        }
    }

});
