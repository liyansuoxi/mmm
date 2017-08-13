/**
 * Created by hodo on 2017/7/17.
 */


/**
 * input 光标移动到末尾
 * @param inp           // input 标签元素
 */
function moveCursorToEnd(inp){
    inp.focus();
    var len = inp.value.length;
    if (typeof inp.selectionStart == 'number' && typeof inp.selectionEnd == 'number') {
        inp.selectionStart = len;
        inp.selectionEnd = len;
    } else if (document.selection) {
        // ie 8
        var sel = inp.createTextRange();
        //设置开头的位置
        sel.moveStart('character',len);
        sel.collapse();
        sel.select();
    }
}


/**
 * 缓存
 * detail: 缓存是有大小的, 之后改吧
 * @returns {cache}
 */
function createCache() {
    var keys = [];

    function cache(key, value) {
        if(value) {
            if(keys.push(key + " ") > 50) {
                delete cache[keys.shift()];
            }
            return cache[key + " "] = value;
        }
        return cache[key + " "];
    }

    cache.getSize = function () {
        return size;
    };
    cache.getKeys = function () {
        return keys;
    };

    return cache;
}


/**
 * 获取网站中的数据
 * @param {key}
 *      * http://sfoasgasogasi?id=123456
 *      getUrlParam(id)  // ==> 123456
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

/**
 * 获取网页中传递的参数(包括中文)
 * @param {*搞不懂} key
 *      http://sfoasgasogasi?id=屌丝
 *      getUrlParam(id)  // ==> 屌丝
 */
function getUrlParam(key) {
        // 获取参数
        var url = window.location.search;
        // 正则筛选地址栏 (正则表达式, 只要包含 key 就可以)
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        // 匹配目标参数
        var result = url.substr(1).match(reg);
        //返回参数值
        return result ? decodeURIComponent(result[2]) : null;
    }

/**
 * 加载数据
 * @param data  缓存中保存的键名
 */
function loadData(data, callback) {
    if(window.cache(data)) {
        console.log("%c瞬间加载!", "color: green; font-size: 20px");
        if(callback && typeof callback === "function") {
            callback(window.cache(data));
        }
    } else {
        var timer = window.setInterval(function () {
            if(window.cache(data)) {
                if(callback && typeof callback === "function") {
                    callback(window.cache(data));
                }
                clearInterval(timer);
                timer = null;
            }
        }, 30);
    }
}

/**
 * 滑动回弹效果
 * @param $ele      传入一个 jQuery 对象
 * @param direction 回弹方向 "x", "y" || "X", "Y" 加负号就是反向
 * @param callBack  回调函数
 * @param flag      是否单向
 *
 * 栗子: 只要右边回弹
 *      springForDirection($ele, "-x", null, true)
 *      左右回弹
 *      springForDirection($ele)
 *      上回弹
 *      springForDirection($ele, "y", null, true)
 */
function springForDirection($ele, direction, callBack, flag) {

    var html_fs = $("html").css("font-size");

    var step = .45 * parseFloat(html_fs), scale = 2, key = "", start = {}, end = { flag: true }, option = {};
    var x = direction.toLowerCase ? direction.toLowerCase : "x",
        pageX = "page" + direction.toUpperCase(),
        dir = 1,
        xStep = direction.toLowerCase() + "Step";

    switch (x) {
        case "x":
            key = "marginLeft";
            break;
        case "y":
            key = "marginTop";
            break;
        case "-x":
            key = "marginLeft";
            pageX = "pageX";
            x = "x";
            dir = -1;
            break;
        case "-y":
            key = "marginTop";
            dir = -1;
            pageX = "pageY";
            x = "y";
            break;
    }

    $ele[0].addEventListener("touchstart", function spring(e) {
        start[x] = e.touches[0][pageX];
    });
    $ele[0].addEventListener("touchmove", function spring(e) {
        if(!end.flag) {
            return;
        }
        end[xStep] = e.targetTouches[0][pageX] - start[x];
        option[key] = 0;

        if(flag && end[xStep] * dir < 0) {
            return;
        }

        if(/*end.flag && */Math.abs(end[xStep] / scale) > step) {
            end.flag = false;
            $(this).animate(option, function () {
                end.flag = true;
                if(callBack && typeof callBack === "function") {
                    callBack.call($ele[0]);
                }
            });
            return;
        }

        // 跟随鼠标移动
        option[key] = end[xStep];
        $(this).css(option);
    });
    $ele[0].addEventListener("touchend", function () {
        option[key] = 0;
        $(this).animate(option);
    });
}









