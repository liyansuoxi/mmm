



$(function () {

    var categoryid = +getQueryString("categoryid") || 0;

    // 页码加载第一次请求 ajax 获取数据
    loadData("data", function () {
        loadDom(window.cache("data"));

        // 默认第一页, 所以一开始就禁用上一页
        $("[data-target='prev']").attr("disabled", true);
    });

    // tab 栏点击事件
    $(".tab-nav-item").click(function () {
        $(this).toggleClass("active").siblings().removeClass("active");
    });


    /* 筛选模块 */
    var $filterBtn = $(".icon-filter").parent().parent();
    var $filter = $(".filter");
    var filterData = {
        // 品牌
        brand: [
            "全部品牌", "海信", "长虹", "TCL", "创维", "乐视", "康佳", "索尼", "三星",
            "海尔", "夏普", "LG", "飞利浦", "微鲸", "小米", "酷开", "17TV", "暴风TV",
            "雷鸟", "东芝", "熊猫", "清华同方", "联想", "先锋", "惠科", "AOC", "松下",
            "KKTV", "乐华", "三洋", "模卡", "哈呢", "创佳", "统帅", "风行电视", "京东方",
            "海力", "彩讯", "SVA", "现代", "没乐", "多方达", "新科", "欧宝丽", "PLATINA",
            "INESA", "日历", "卡萨帝", "其他"
        ],
        // 品类
        category: [
            "全部品类", "液晶电视", "曲面电视", "3D电视", "会议/广告机", "激光/影院电视"
        ],
        // 屏幕尺寸
        size: [
            "全部尺寸", "32英寸以下", "32英寸", "37-39英寸", "40-42英寸", "43-45英寸",
            "46-49英寸", "50-52英寸", "55-58英寸", "60-65英寸", "65英寸以上"
        ],
        // 屏幕分辨率
        ratio: [
            "全部分辨率", "超高清4K", "全高清1080K", "高清720P", "其他"
        ],
        // 功能
        action: [
            "全部功能", "智能网络电视", "普通电视"
        ],
        // 3D电视
        _3D: [
            "全部3D", "支持3D", "不支持3D"
        ],
        // 观看距离
        distance: [
            "全部观看距离", "小卧室(1.7米以下)", "小客厅(1.8~2.5米)",
            "小客厅(2.6~3.0米)", "中客厅(3.1~4.0米)", "大客厅(4.1~5.0米)",
            "大客厅(5.0米以上)"
        ],
        // 价格
        price: [
            "全部价格", "1-1499", "1500-2999", "3000-4499", "4500-5999", "6000-7999",
            "8000-9999", "10000以上"
        ],
        // 评分
        grade: [
            "全部评分", "4.8分及以上", "4.6分及以上", "4.4分及以上", "4.2分及以上", "4分以上",
            "3.5分及以上", "3分及以上"
        ]
    };
    var filterTit = [
        "品牌", "品类", "尺寸", "分辨率", "功能", "3D", "观看距离", "价格", "评分"
    ];

    // 筛选点击事件
    $filterBtn.click(function () {
        $filter.css("display", "block")

        // 添加遮罩层
        $(".mmm-bj .mask").show();

        // 弹出 filter 窗口
        $filter.animate({
            left: 0
        }, "slow");
    });

    // 关闭筛选
    $filter.find(".icon-remove").click(function () {
        $filter.animate({
            left: -$(this).width
        }, "slow", function () {
            // 关闭遮罩层
            $(".mmm-bj .mask").hide();
        });
    });

    // 创建筛选里面的 form 表单对象
    var fil = new window.zp.categoryHandle.Filter(".filter form", filterData);

    // 跳转之前存储数据
    $("#p-list").click(function ($e) {
        var $target = $($e.target);
        if($target.attr("class") !== "mask") {
            return;
        }

        var $this = $target.siblings("div.clearfix");

        window.zp.data.curProduct = {
            categoryid: categoryid,
            brandName: getHtml(".title"),
            productCom: getHtml("span.pull-right"),
            productImg: getHtml(".avatar"),
            productName: getHtml(".txt"),
            productPrice: getHtml(".price"),
            productQuote: getHtml("span.pull-left")
        }

        // 存储到本地
        window.localStorage.setItem("curProduct", JSON.stringify(zp.data.curProduct))

        function getHtml(id) {
            return $this.find(id).html().trim();
        }

    });

    /* 底部应用打开 */
    new zp.categoryHandle.Banner(".open-localapp");

    /* 返回顶部-小火箭 */
    var $body = $("body");
    $("[data-target='scrollTo']").click(function ($e) {
        $e.stopPropagation();
        window.clearInterval($body[0]._timer);
        $body.zpScrollTo();
    });
    window.onmousewheel = window.onclick = function () {
        window.clearInterval($body[0]._timer);
    };

    /* 封装函数 */
    function loadDom(data) {
        var $body = $("body");

        // 绑定数据
        var $pageCon = $(".pageCon");
        var totalPage = Math.ceil(data.totalCount / data.pagesize);

        $pageCon[0]._pageSize = data.pagesize;
        $pageCon[0]._totalCount = data.totalCount;
        $pageCon[0]._totalPage = totalPage;
        $pageCon[0]._categoryid = categoryid;

        if(totalPage === 1) {
            // 默认第一页, 如果只有一页就禁用下一页
            $("[data-target='next']").attr("disabled", true);
        }

        // 加载数据并添加模板到页面中
        var dom = template("show", data.result);
        $("#p-list").append(dom);

        /* select 控制页码 */
        var pageCon = new zp.categoryHandle.PageCon(".pageCon");

        /* 滑动事件 */

        // 左右滑动上下页
        var $product_list = $(".product-list"),
            send_flag = false;

        // 下拉回弹刷新
        springForDirection($product_list, "y", function () {
            console.log("回弹完成");
        }, true);

        // 左右滑动回弹效果
        springForDirection($product_list, "x");

        // 加载刷新
        $product_list.swipeRight(function ($e, e) {
            console.log("right");

            // 右滑动
            pageCon.$prev.click();
            window.clearInterval($body._timer);
        }).swipeLeft(function () {
            console.log("left");

            // 左滑动
            pageCon.$next.click();
            window.clearInterval($body._timer);
        }).swipeDown(function () {
            console.log("down");

            // 发送
            $.ajax(pageCon.option);

            // 清除缓存
            for(var key in window.cache) {
                if(/page/.test(key)) {
                    delete window.cache[key + " "];
                }
            }
        });

        // 清除定时器
        window.onmousewheel = window.onclick = function () {
            w.clearInterval($("body")[0]._timer);
        };

        // 关闭加载动画
        //$(".loading").animate({
        //    height: 0
        //}, function () {
        //    $(this).hide(0);
        //});

        // 可以多发一次来提高用户体验
        $.ajax({
            url: _URL.commodityList,
            data: {
                categoryid: categoryid,
                pageid: 2
            },
            success: function (data) {
                window.cache("pageid_" + categoryid + "_" + 2, template("show", data.result));
            }
        });

        // 缓存数据
        window.cache("pageid_" + categoryid + "_" + 1, dom);
    }
});

























