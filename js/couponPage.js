window.onload = function () {
    var keyId = window.location.search;
    var xhr = new XMLHttpRequest();
    xhr.open("get", "http://139.199.192.48:9090/api/getcouponproduct" + keyId);
    var result = xhr.responseText;
    xhr.onload = function () {
        var result = JSON.parse(xhr.responseText);
        var content = result.result;
        var html = "";
        for (var i = 0; i < content.length; i++) {
            html += "<div class='inner clearfix'>"
            html += "<div class='pic clearfix'>";
            html += content[i].couponProductImg
            html += "</div>"
            html += "<div class='txt clearfix'>"
            html += "<p class='ProductName'>" + content[i].couponProductName + "</p>"
            html += "<p class='price'>" + content[i].couponProductPrice + "</p>"
            html += "<p class='ProductTime'>" + content[i].couponProductTime + "</p>"
            html += "</div>"
            html += "</div>"
        }

        document.querySelector(".discount").innerHTML = html;

        var pic = document.querySelectorAll(".inner");

        var mask = document.querySelector(".mask");
        var swiper1 = document.querySelector(".swiper-container");
     
      
        // var result = JSON.parse(xhr.responseText);
        // var content = result.result;
        for (var i = 0; i < pic.length; i++) {
            pic[i].index = i;
            pic[i].onclick = function () {

                var number = this.index;
                
                mask.style.display = "block";
                swiper1.style.visibility = "visible";
 
               
                var swiperPic = "";
                for (var i = 0; i < content.length; i++) {
                    swiperPic += '<div class="swiper-slide">'
                    // swiperPic+=content[number].couponProductImg
                    swiperPic += content[i].couponProductImg
                    swiperPic += '</div>';
                }
                document.querySelector(".swiper-wrapper").innerHTML = swiperPic;
                var swiper = new Swiper('.swiper-container', {
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    initialSlide:this.index,
                });



           }
         }

        mask.onclick = function () {
            mask.style.display = "none";
            swiper1.style.visibility = "hidden";
        }

    };

    xhr.send(null);
}
//-------------------------------------------------------------





