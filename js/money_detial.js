$(function () {
    //加载数据渲染界面
    var url = location.href;
    console.log(url);
    var productid = url.split("=")[1];
    console.log(productid);
    
    $.ajax({
        url: "http://139.199.192.48:9090/api/getmoneyctrlproduct",
        data:{
            "productid": productid
        },
        success: function (data){
            console.log(data);
            $("main").append(template("template",data));
            var current_page = data.result[0].productName;
            console.log(current_page);
            $("#current_page").html(current_page);
        }
    })

    //评论区的制作

})