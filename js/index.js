$(function () {

    initIndex();

    function initIndex() {
        $.ajax({
            type: 'GET',
            url: 'http://139.199.192.48:9090/api/getindexmenu',
            success: function (data) {
                for (var i = 0; i < data.result.length; i++) {
                    var currentObj = data.result[i];
                    $(".menu > ul").append(template('indexMenu', currentObj));
                }
                $('.menu > ul li:eq(7)').children("a").attr("href","javascript:;");
                $('.menu > ul li:eq(7)').tap(function () {
                    if ($(this).parent().css("max-height") == "100%") {
                        $(this).parent().css("max-height","4rem");                        
                    } else {
                        $(this).parent().css("max-height","100%");                            
                    }
                });
            }
        });
        $.ajax({
            type: 'GET',
            url: 'http://139.199.192.48:9090/api/getmoneyctrl',
            success: function (data) {
                console.log(data);
                for (var i = 0; i < data.result.length; i++) {
                    var currentObj = data.result[i];
                    $(".recommend_list > ul").append(template('moneyCtrl', currentObj));
                }

            }
        });
    }

})