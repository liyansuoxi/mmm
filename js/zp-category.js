/**
 * Created by hodo on 2017/8/2.
 */


;(function (w, callback, undefined) {

    /**
     * 自定义设置原型
     */

    // 修改添加函数对象原型方法
    Function.prototype.setPrototype = function (obj, option) {
        var tp = null;

        // 判断类型
        switch (typeof obj) {
            case "function":
                inheritForObj.call(this, obj.prototype);
                break;
            case "object":
                inheritForObj.call(this, obj);
                break;
            default: return;
        }

        // 赋值
        if(option != null) {
            for(var key in option) {
                tp[key] = option[key];
            }
        }

        // 继承核心方法
        function inheritForObj(obj) {
            tp = Object.create(obj);
            tp.constructor = this;
            this.prototype = tp;
        }

        // 返回原型
        return tp;
    };

    // 自己写的对象都将继承的原型 zp (不包括函数对象)
    var zp = new function Zp() {

        // 控制面板提示信息
        this.Msg = {
            _Error: {},
            _Warn: {},
            _Tip: {}
        };

        // 存储临时数据用
        this.data = {};

        // 重写 toString() 方法, 打印使用
        this.toString = function () {
            var name = this.constructor.name;
            name = name ? name : this.constructor._name;
            return this._name ? "[" + this._name + " " + this.constructor.name + "]" : "[" + typeof this + " " + this.constructor._name + "]";
        };

        // 自定义数组原型, 用来修改 push 等方法
        this.zpArr = (function () {
            var arr = [];
            function fn() {}
            fn.setPrototype(arr, {
                // ### CodeContinue...
                // 重写 push 等方法跟 keys 绑定
                test: "HelloWorld!"
            });
            return fn;
        }());

        // 提供外界用来访问内部构造器使用的对象
        this.categoryHandle = null;
    };

    // 将 zp 对象添加到 window 下
    Object.defineProperty(w, "zp", {
        value: zp,
        writable: false     // 不能修改
    });


    /**
     * 在 $ 添加一些自定义属性和 fn
     */

    /**
     * 滚动动画
     * @option: 动画的配置信息
     * @callback: 回调函数
     */
    $.fn.zpScrollTo = w.zp.srollTo = function (option, callback) {
        var defOpt = {
            top: 0,             // 目标位置
            durTime: 1000,      // 动画时长
            delay: 30           // 延迟时间
        };

        // 最终的配置信息
        option = option ? $.extend(defOpt, option) : defOpt;
        this[0]._timer = null;                                             // 计时器 ID

        // 局部变量
        var counter = 0,                                                // 用来计数, 函数运行了多少次
            leader = this.scrollTop(),                                  // 当前位置
            stepCount = Math.ceil(option.durTime / option.delay),       // 计时器运行次数
            subDistance = option.top - leader,                          // 当前位置跟目标位置的距离
            step = Math.round(subDistance / stepCount);                 // 每次运行的步长

        // 实际动画特效函数
        (function (option, w) {

            /* 还没到目标位置执行 */
            w.clearInterval(this[0]._timer);
            this[0]._timer = w.setInterval(function () {

                leader = this.scrollTop();

                // 到目标的距离大于当前步长
                if(Math.abs(option.top - leader) > Math.abs(step)) {
                    this.scrollTop(step + leader);
                    return;
                }

                // 到目标位置小于当前步长
                this.scrollTop(option.top);
                w.clearInterval(this[0]._timer);
                if(callback && typeof callback === "function") {
                    callback.call(this);
                }
            }.bind(this), option.delay);

        }.call(this, option, w));

        return this;
    };





    /**
     * 要执行的主要内容
     */
    callback(w);

}(window, function (w) {

    /* 广告栏 */
    function Banner(id) {
        this.id = id;
        this.$banner = $(id);
        this.$banner[0]._self = this;
        this.url = URL.appDownLoad;

        this._init();
    }
    Banner.setPrototype(w.zp, {
        _init: function () {

            this.$logo = $(this.id + " .logo > a");
            this.$close = $(this.id + " .close");
            this.$linkBtn = $(this.id + " [data-target='link']");

            this._initEvents();
        },
        _initEvents: function () {
            this.$close.off("click");
            this.$linkBtn.off("click");

            this.$close.click(function close() {
                // stop() is not function

                // 判断移动方向
                var option_1 = null, option_2 = null;
                switch (this.$close[0].dataset.target) {
                    case "top":
                        option_1 = {marginTop: -this.$banner.height() + "px"};
                        option_2 = {top: -this.$banner.height() + "px"};
                        break;
                    case "bottom":
                        option_1 = {marginBottom: -this.$banner.height() + "px"};
                        option_2 = {bottom: -this.$banner.height() + "px"};
                        break;
                    case "right":
                        option_1 = {left: this.$banner.width() + "px"};
                        option_2 = {left: -this.$banner.height() + "px"};
                        break;
                    case "left":
                        option_1 = {left: -this.$banner.width() + "px"};
                        option_2 = {left: -this.$banner.height() + "px"};
                        break;
                }

                // 判断是否为 fixed 固定方向
                if(this.$banner.css("position")) {
                    this.$banner.animate(option_1, "slow", "swing", hide.bind(this));
                } else {
                    this.$banner.animate(option_2, "slow", "swing", hide.bind(this));
                }

                function hide() {
                    this.$banner.remove();
                }
            }.bind(this));
            this.$linkBtn.click(function open($e) {
                w.open(this.url, "_blank");
            }.bind(this));
        }
    });

    /* 分类列表 */
    function ClassifyTitle(id) {

        this.id = id;
        this.$ul = $(id);
        this.$ul[0]._self = this;

        this._init();

        var _data = {};

        // 添加 ul
        this.$li.map(function (index, ele) {
            var $ul = $(document.createElement("ul")).addClass("row clearfix");
            $(ele).append($("<div>", {
                class: "loading"
            }).append($("<div>", {
                class: "filter-mix"
            }))).append($ul);
        });

        this._initEvents();
    }
    ClassifyTitle.setPrototype(w.zp, {
        _init: function () {

            this.$li = this.$ul.children("li").addClass("container-fulid");
            this.$a = this.$li.children("a");
            this.$span = this.$a.children("span[data-target='icon']");

            var that = this;
            this.option = {
                url: _URL.classifyList,
                data: null,
                success: null,
                error: function () {
                    console.log("%c获取失败", "color: red; font-size: 20px");
                }
            };
        },
        _initEvents: function () {
            var that = this;

            // ul 点击事件
            this.$ul.click(function ($e) {
                if(typeof $e.target.dataset.titleId !== "string") {
                    return;
                }

                var $span = $($e.target).children("span");
                var $a = $span.parent();
                var $loading = $a.siblings(".loading");

                // span 特效
                switch ($span.attr("class")) {
                    case "icon-sort-down":
                        $span.attr("class", "icon-sort-up");
                        break;
                    case "icon-sort-up":
                        $span.attr("class", "icon-sort-down");
                        break;
                }

                // 切换类名
                $a.parent().find("ul").toggleClass("active");
                if($a[0].flag != null) {
                    return;
                }
                that.option.data = {
                    titleid: $a.data("titleId")
                };
                that.option.success = function (data) {

                    // 加载中
                    $loading.animate({
                        height: 0
                    }, "slow", function () {
                        $loading.hide(0);
                    });

                    $a[0].flag = true;
                    that.createLis.call($e.target, data.result);

                    // 打印信息
                    console.log("%c列表数据获取成功 " + $a.data("titleId"), "color: green");
                };
                that.option.beforeSend = function () {
                    console.log("已经发送");

                    // 加载中动画
                    $loading.show(0);
                };

                // ajax
                $.ajax(that.option);

            });
        },

        // 创建列表的方法
        createLis: function (data) {

            data.forEach(function (ele, index) {
                var $li = $(document.createElement("li"));
                var $a = $("<a>", {
                    href: _URL.category_list + "?categoryid=" + ele.categoryId
                }).html(ele.category);

                // 添加到 li 标签中, 绑定 categoryId
                $li.append($a).addClass("col-xm-4 col-sm-4 col-md-4 col-lg-3").data("categoryId", ele.categoryId);

                // 添加到页面中
                $(this).siblings("ul").append($li);
            }, this);

            return $(this).siblings("ul");
        }
    });

    /* 翻页-商品列表 */
    function PageCon(id) {
        this.id = id;
        this.$pageCon = $(id);
        this.$pageCon[0]._self = this;

        this._init();
        this._initEvents();
    }
    PageCon.setPrototype(w.zp, {
        _init: function () {

            this.$next = this.$pageCon.find("[data-target='next']");
            this.$prev = this.$pageCon.find("[data-target='prev']");
            this.$target = $(this.$pageCon.data("target"));

            this.totalPage = this.$pageCon[0]._totalPage;
            this.pageSzie = this.$pageCon[0]._pageSize;
            this.totalCount = this.$pageCon[0]._totalCount;

            var arr = [], map = [];
            for(var i = 1, len = this.totalPage; i <= len; i++) {
                arr.push(i + " / " + len);
                map.push("categoryid=" + this.$pageCon[0]._categoryid + "&pageid=" + i);
            }

            // select 对象
            this.select = new Select(this.$pageCon.find("[data-target='page']"), {
                dictionary: arr,
                mapArr: map
            });

            var that = this;
            var $loading = $(".loading");
            this.option = {
                url: _URL.commodityList,
                data: {
                    categoryid: +getQueryString("categoryid"),
                    // 这里不设置的话, 发送的时候或找不到, 原因不明
                    pageid: 1
                },
                success: function (data) {

                    var dom = template("show", data.result);

                    // 缓存
                    w.cache("pageid_" + that.option.data.categoryid + "_" + that.option.data.pageid, dom);

                    // 加载到页面中
                    $(that.$pageCon.data("target")).empty().append(dom);

                    var page = that.option.data.pageid;
                    var categoryid = that.option.data.categoryid;

                    // 启用禁用按钮
                    switch (page) {
                        case 1:
                            that.$next.removeAttr("disabled");
                            that.$prev.attr("disabled", true);
                            break;
                        case that.totalPage:
                            that.$prev.removeAttr("disabled");
                            that.$next.attr("disabled", true);
                            break;
                        default:
                            that.$next.removeAttr("disabled");
                            that.$prev.removeAttr("disabled");
                    }

                    // 滚动到页面顶部
                    $("body").zpScrollTo({
                        durTime: 600
                    });

                    // 加载动画隐藏
                    var h = $loading.height();
                    $loading.animate({
                        height: 0
                    }, function () {
                        $loading.height(h);
                        $loading.hide(0);
                    });

                    // 多发送一次
                    $.ajax({
                        url: _URL.commodityList,
                        data: {
                            categoryid: categoryid,
                            pageid: page++
                        },
                        success: function (data) {
                            window.cache("pageid_" + categoryid + "_" + page, template("show", data.result));
                        }
                    });

                    // 打印
                    console.log("%c数据获取成功 ", "color: green", that.option.data);
                },
                error: function () {

                    // 启用按钮
                    that.$prev.removeAttr("disabled");
                    that.$next.removeAttr("disabled");

                    console.log("%c" + that.option.data.pageid + " 获取失败", "color: red; font-size: 20px");
                },
                beforeSend: function () {
                    console.log("已经发送请求");

                    // 加载动画
                    $loading.show(0);
                }
            };

            // pageid 的 set get 方法
            Object.defineProperty(this.option.data, "pageid", {
                get: function () {
                    // 从 select 哪里获取值
                    return parseInt(that.select.$select.val()) + 1;
                },
                set: function (val) {
                    // 判断 页码 是否正确
                    if(val <= 1) {
                        that.$prev.attr("disabled", true);
                        console.warn("已经是第一页了");
                        val = 1;
                        //return;
                    } else if(val >= that.totalPage) {
                        that.$next.attr("disabled", true);
                        console.warn("这已经是最后一页了!");
                        val = that.totalPage;
                        //return;
                    }

                    // 修改 select 值
                    that.select.$select.val(val - 1);
                }
            });

            // 5 分钟后是否发送一次请求
            //this.isSend = true;
        },

        // 注册事件
        _initEvents: function () {

            // 上下页
            this.$next.click(click.bind(this));
            this.$prev.click(click.bind(this));

            // select change 事件
            this.select.$select.change(changePage.bind(this));

            function changePage() {
                var flag = "";
                switch (this.option.data.pageid) {
                    case 1:
                        flag = "noNext";
                        break;
                    case this.totalPage:
                        flag = "noPrev";
                        break;
                }
                if(this.hasCache(flag)) {
                    return;
                }

                // 发送 ajax 请求
                $.ajax(this.option);
            }

            function click($e) {

                $e.stopPropagation();

                var flag = "";

                // 判读是上一页还是下一页
                switch ($e.target.dataset.target) {
                    case "prev":
                        --this.option.data.pageid;
                        flag = "next";
                        break;
                    case "next":
                        ++this.option.data.pageid;
                        flag = "prev";
                        break;
                }

                // 绑定属性
                this.$pageCon.data("curPage", this.option.data.pageid);

                // 有缓存就直接返回
                if(this.hasCache(flag)) {
                    return;
                }

                // 禁用
                this.$prev.attr("disabled", true);
                this.$next.attr("disabled", true);

                // 点击的时候发送 ajax 请求
                $.ajax(this.option);
            }

        },

        // 发送之前会去看看有没有缓存, 有就加载
        hasCache: function (flag) {

            // 发送之前 看看 缓存里面有没有
            var key = "pageid_" + this.option.data.categoryid + "_" + this.option.data.pageid;
            if(w.cache(key) != null) {
                console.log("%c加载缓存 " + key, "color: green");

                // 滚动到页面顶部
                $("body").zpScrollTo({
                    durTime: 0
                });

                switch (flag) {
                    case "next":
                        this.$next.removeAttr("disabled");
                        break;
                    case "prev":
                        this.$prev.removeAttr("disabled");
                        break;
                    case "noPrev":
                        this.$next.attr("disabled", true);
                        break;
                    case "noNext":
                        this.$prev.attr("disabled", true);
                        break;
                    default:
                        this.$next.removeAttr("disabled");
                        this.$prev.removeAttr("disabled");
                }

                // 加载到页面中
                this.$target.empty().append(w.cache(key));

                var that = this;
                var categoryid = that.option.data.categoryid;
                var page = that.option.data.pageid + 1;
                // 在发送一次
                $.ajax({
                    url: _URL.commodityList,
                    data: {
                        categoryid: categoryid,
                        pageid: page
                    },
                    success: function (data) {
                        window.cache("pageid_" + categoryid + "_" + page, $(template("show", data.result)));
                    }
                });

                return true;
            }
            return false;
        },

        // pageCon 会进过5分钟发送一次请求
        sendAjax: function () {
            var timer = window.setInterval(function () {
                if(this.isSend) {
// ### CodeContinue...
                }
            }.bind(this), 1000 /** 60 * 5*/);
        }
    });


    /* select 分页 */
    function Select(ele, data) {
        this.data = data;
        this.$select = ele;
        this.$select[0]._self = this;

        this._init();
        this.createOptions();
        this._initEvents();
    }
    Select.setPrototype(w.zp, {
        _init: function () {

            this.dictionary = this.data.dictionary;
            this.mapArr = this.data.mapArr;
        },
        _initEvents: function () {

        },

        // 创建 option
        createOptions: function () {
            this.dictionary.forEach(function (ele, index) {
                if(ele == null) {
                    return;
                }
                this.$select.append($("<option>", {
                    value: index,
                    text: ele
                }));
            }, this);
        },

        // 设置字典和映射数组
        setDicAndMap: function (data) {
            console.log(data);
            this.$select.empty();

            if(data.dic && data.dic.length) {
                console.log(typeof data.dic);
                if(typeof data.dic !== "array") {
                    data.dic = Array.from(data.dic);
                }

                console.log(data);

                this.dictionary = data.dic || this.dictionary;
                this.mapArr = data.map || this.mapArr;
                this.createOptions();
            }
        },

        // 根据 value 值来获取对应的映射值
        getTxt: function (val) {
            if(this.mapArr) {
                return this.mapArr[parseInt(val)];
            } else {
                return this.dictionary[val];
            }
        }
    });


    /* 筛选部分 */
    function Filter(id, data) {
        this.data = data;
        this.id = id;

        this.$form = $(id);
        this.$form[0]._self = this;

        this._init();
        this._initEvents();

        // 限制高度
        this.setHeightAll();
    }
    Filter.setPrototype(w.zp, {
        _init: function () {

            this.hCount = 2;
            this.h = undefined;
            this.iconClass = ["icon-chevron-down", "icon-chevron-up"];  // 子图图标类名

            this.addSection();
        },

        _initEvents: function () {

            // 点击事件
            this.$form.click(submit.bind(this)).click(loadMore.bind(this));

            // 点击提交
            function submit($e) {
                if($e.target.nodeName !== "INPUT") {
                    return;
                }

                // 修改样式
                $($e.target).toggleClass("active").parent().siblings().find(".active").toggleClass("active");

                // 提交表单
                this.$form[0].submit();
            }
            // 加载更多 旋转箭头
            function loadMore($e) {
                var target = $e.target;
                if(target.dataset.target !== "title" && target.dataset.target !== "icon") {
                    return;
                }

                var $icon = $(target).find("[data-target='icon']");

                // 获取 ul 标签
                var $ul = $(target).siblings("ul").length ? $(target).siblings("ul") : $(target).parent().siblings("ul");

                // 设置 ul 高度
                if($ul[0]._flag) {
                    $ul.animate({
                        height: (this.h * Math.ceil($ul.children().length / 3)) + "px"
                    }, "slow");
                } else {
                    if($ul.children().length > 3) {
                        $ul.animate({
                            height: (this.h * this.hCount) + "px"
                        }, "slow");
                    } else {
                        $ul.animate({
                            height: this.h + "px"
                        }, "slow");
                    }
                }

                $ul[0]._flag = !$ul[0]._flag;

                // 切换类名
                $icon.toggleClass(this.iconClass[0]).toggleClass(this.iconClass[1])

            }
        },

        // 创建添加到页面中
        addSection: function () {
            // 根据数据创建并添加
            var $section = null, $ul = null, $f_tit = null, $li = null;
            var frag = document.createDocumentFragment();

            for(var key in this.data) {
                // 创建添加 section h3 ul 标签
                $f_tit = $("<h3>", {
                    class: "f-tit"
                }).data("target", "title").html(this.data[key][0].slice(2));
                $f_tit[0]._flag = true;

                $ul = $("<ul>", {
                    class: "clearfix"
                }).data("target", "list");

                $section = $("<section>", {
                    class: key
                }).data("target", key).append($f_tit).append($ul);

                // 创建添加 h3 的子元素
                $f_tit.append($("<span>").html(this.data[key][0])).append($("<span>", {
                    class: "pull-right " + this.iconClass[0]
                }).data("target", "icon"));

                // 添加 ul 的子元素
                this.data[key].forEach(function (ele) {
                    $li = $("<li>", {
                        class: "f-item"
                    }).append($("<input>", {
                        type: "button",
                        value: ele
                    }));
                    $ul.append($li);
                });

                // 添加到虚拟dom中
                frag.appendChild($section[0]);
            }

            // 添加到 form 中
            this.$form.append(frag);

            // 获取高度
            this.h = $li.height() + parseInt($li.css("margin-bottom"));

            // 为第一个 li 标签添加 active 类名
            this.$form.find("li:first-child > input").addClass("active");
        },

        // 限制高度以及右边的关闭
        setHeightAll: function () {

            var height = this.h * this.hCount;

            // 设置 ul 的高度
            var $ul = this.$form.find("ul");
            $ul.each(function (index, ele) {
                if(ele.children.length > 6) {
                    $(ele).height(height);
                    ele._height = height;
                } else {
                    $(ele).siblings("h3").find("span").hide(0);
                    $(ele).height(this.h);
                    ele._height = this.h;
                }
                ele._flag = true;
            }, this);
        }
    });


    // 返回构造函数供外部访问
    w.zp.categoryHandle = {
        Banner: Banner,
        ClassifyTitle: ClassifyTitle,
        PageCon: PageCon,
        Filter: Filter
    };
}));