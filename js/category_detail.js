


$(function () {

    // 加载产品信息
    var $pd = $(".product-detail");
    var $ul = $(".bm-content ul");
    var $body = $("body");

    $pd.find(".pd-pic").append(curProduct.productImg.trim());
    $pd.find(".txt").text(curProduct.productName).siblings(".msg").children(".left").text("当前最低: " + curProduct.productPrice);

    // 评论内容
    $pd.find("span.pull-right").html("最优评论: " + curProduct.productCom.slice(curProduct.productCom.indexOf("(") + 1, curProduct.productCom.length -1) + "条");

    // 加载评论栏 dom
    loadData("data", function (data) {
        // 添加到页面上
        appendDOM(data);
    });

    // 加载面包屑导航栏 dom
    loadData("classifyName", function (data) {

        data = data.result[0];
        var url = _URL.category_list + "?categoryid=" + data.categoryId;

        // 加载面包屑导航栏
        $(".bread-nav").find("a[data-target='list']").html(data.category).data("categoryId", data.categoryId).attr("href", url);
        url = null;
        $(".bread-nav").find("a[data-target='detail']").html(curProduct.brandName);
    });

    /* 加载更多 */
    $(".bm-more button").click(function () {
        var option = {
            url: _URL.productDetail,
            data: {
                productid: (getQueryString("productId") || 1)
            },
            success: function (data) {
                console.log("%c加载成功!", "color: green");
                $ul.append(template("msg", data.result));
            }
        };
        $.ajax(option);
    });


    /* 实现头部广告栏 - 固定导航栏效果 */
    new zp.categoryHandle.Banner(".banner-app");
    new zp.categoryHandle.Banner(".open-localapp");

    /* 返回顶部-小火箭 */
    $("[data-target='scrollTo']").click(function ($e) {
        $e.stopPropagation();
        window.clearInterval($body[0]._timer);
        $body.zpScrollTo();
    });
    window.onmousewheel = $ul[0].onclick = function () {
        window.clearInterval($body[0]._timer);
    };

    // 小火箭显示隐藏
    $body[0].onscroll = function () {
        var scrollTo = $("div.scrollTo");
        if($body.scrollTop() <= ($(document).height() - window.innerHeight * 2) && $body.scrollTop() >= window.innerHeight * 2) {
            if(scrollTo.css("display") === "none") {
                scrollTo.show(0);
            }
            return;
        }
        if(scrollTo.css("display") === "block") {
            scrollTo.hide(0);
        }
    };


    /* 封装添加到页面的函数 */
    function appendDOM(data) {

        // 添加到页面中
        data.result.forEach(function (ele) {
            $ul.append(template("msg", data.result));
        });
    }
});


