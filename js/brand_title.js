$(function () {
        $.ajax({
            url: "http://139.199.192.48:9090/api/getbrandtitle",
            type: "get",
            success: function (backdata) {
                var result = template("rank", backdata);
                $(".list").html(result);
                var a_Arr = document.querySelectorAll(".list a");
                for (var i = 0; i < a_Arr.length; i++) {
                    var temp = $(a_Arr[i]).attr("href");
                    var str = $(a_Arr[i]).html();
                    str = str.slice(0, str.indexOf("十大品牌"));
                    temp += "&title=" + str;
                    $(a_Arr[i]).attr("href", temp);
                }
            }
        })
    })