 var getId = parseInt(getQueryString("id"));
    var title = getUrlParam("title");
    $(function () {
        /*获取品牌*/
        $.ajax({
            url: "http://139.199.192.48:9090/api/getbrand",
            type: "get",
            data: {
                brandtitleid: getId
            },
            success: function (backdata) {
                var result = template("rank", backdata);
                $(".list").html(result);

                /*为标签序号赋值*/
                var emArr = document.querySelectorAll(".list em");
                for (var i = 0; i < emArr.length; i++) {
                    emArr[i].innerHTML = i + 1;
                }

                /*获取需要填写种类名的元素并添加种类名*/
                var spanArr = document.querySelectorAll(".brand-name");
                for (var i = 0; i < spanArr.length; i++) {
                    $(spanArr[i]).html(title);
                }
            }
        })

        //请求销量排行榜的数据
        $.ajax({
            url: "http://139.199.192.48:9090/api/getbrandproductlist",
            type: "get",
            data: {
                brandtitleid: getId
            },
            success: function (backdata) {
                if (backdata.result.length) {
                    var result = template("sold", backdata);
                    $(".sold").html(result);
                    var imgArr = document.querySelectorAll(".sold .pic");
                    for (var i = 0; i < imgArr.length; i++) {
                        imgArr[i].innerHTML = backdata.result[i].productImg;
                    }
                    $.ajax({
                        url: "http://139.199.192.48:9090/api/getproductcom",
                        type: "get",
                        data: {
                            productid: getId
                        },
                        success: function (backdata) {
                            var result = template("con", backdata);
                            $(".con").html(result);
                            $.ajax({
                                url: "http://139.199.192.48:9090/api/getbrandproductlist",
                                type: "get",
                                data: {
                                    brandtitleid: getId
                                },
                                success: function (backdata) {
                                    console.log(backdata);

                                    /*评论详细*/
                                    /*获取img元素*/
                                    var imgArr = document.querySelectorAll(".con-pic img");
                                    /*获取小标题元素*/
                                    var titArr = document.querySelectorAll(".con-des span");
                                    /*获取上面销量排行中的图片和小标题*/
                                    var imgAtt = document.querySelectorAll(".sold img");
                                    var desArr = document.querySelectorAll(".sold .des");

                                    for (var i = 0; i < imgArr.length; i++) {
                                        var attr = $(imgAtt[i]).attr("src");
                                        if (imgArr.length > imgAtt.length) {
                                            attr = $(imgAtt[0]).attr("src");
                                            $(imgArr[i]).attr({ src: attr });
                                            $(titArr[i]).html($(desArr[0]).html());
                                        }
                                        else {
                                            $(imgArr[i]).attr({ src: attr });
                                            $(titArr[i]).html($(desArr[i]).html());
                                        }
                                    }
                                }
                            })

                        }
                    })
                }
            }
        })

    })