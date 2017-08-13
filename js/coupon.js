
window.onload = function () {
  var xhr = new XMLHttpRequest();
  xhr.open("get", "http://139.199.192.48:9090/api/getcoupon");
  xhr.onload = function () {
    var result = JSON.parse(xhr.responseText);
    // console.log(result.result[1].couponImg)
    var obj = result.result;
    console.log(obj);
    var html = "<ul>";
    for (var i = 0; i < obj.length; i++) {
      html += '<li>' + '<a href="countPage.html?couponid=' + obj[i].couponId + '">' + '<img src="' + obj[i].couponImg + '">' + '<p>' + obj[i].couponTitle + '</p></a></li>';
    }
    html += "</ul>";
    console.log(html)
    document.querySelector(".content").innerHTML = html;
  }
  xhr.send(null);
} 