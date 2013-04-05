//==========グローバル変数
var start_time = new Date();
var anchorHead = "";
var skinName = "skin30-2 v3.6.1231.1";
var browser = "ギコナビ";

//threadurl(),addAnchor()
var t_url = false,
  t_domain, t_bbs, t_key;

//=========グローバル関数
//checkAnchor(href)
//addAnchor(inner, num)
//threadurl()
//hiddenRes(e)
//loadtime()


//==========ギコナビ用アンカーの判定（0:処理無し,1:ポップアップ,2:ボタン挿入）
// ギコナビでは、レスアンカーは相対アドレスで記述される
function checkAnchor(href) {
  if (!href) {
    return (0)
  }
  if (href.match(/decoy:|about:/)) {
    return (1)
  } else if (href.match(/menu:|be:|read\.cgi|\.2ch\.net\/.*\/kako/)) {
    return (0)
  } else if (href.match(/https?:\/\/www.youtube.com\/watch\?/)) {//http://www.youtube.com/watch?v=PmTtyQ6HAkM
    return (3)
  } else if (href.match(/https?:\/\/youtu.be\/\w+/)) {//http://youtu.be/PmTtyQ6HAkM
    return (4)
  } else {
    return (2)
  }
}


//==========リンク設定
function addAnchor(inner, num) {
  if (!t_url) {
    threadurl()
  }
  var url = document.getElementsByName("ThreadURL")[0].content;
  if (url.match(/&/)) {
    return ('<a href="../test/read.cgi?bbs=' + t_bbs + '&key=' + t_key + '&st=' + inner + '&to=' + inner +
      '&nofirst=true" target="_blank" onclick="blur()">' + num + '</a>')
  } else {
    return ('<a href="../test/read.cgi/' + t_bbs + '/' + t_key + '/' + inner + '" target="_blank" onclick="blur()">' +
      num + '</a>')
  }
}


//==========スレッドURLの取得
function threadurl() {
  var threadurl = document.getElementsByName("ThreadURL")[0].content;
  if (threadurl.match(/&/)) {
    threadurl.match(/bbs=(.*)&key=(\d*)/);
  } else {
    threadurl.match(/^.*\/test\/read.cgi\/(.*)\/(.*)\//);
  }
  t_url = true;
  t_bbs = RegExp.$1;
  t_key = RegExp.$2;
}


//==========非表示レスの表示-ギコナビのみ
function hiddenRes(e) {
  var number = tohan(event.srcElement.innerText.replace(/>|＞/g, ""));
  var i = 0;
  while (document.anchors[i].name.match(/\D/)) {
    i++
  }
  var startRes = parseInt(document.anchors[i + 1].name.replace(/\D/g, ""));
  if (number.match(/(\d*)\D+(\d*)/)) {
    var start = parseInt(RegExp.$1);
  } else {
    var start = parseInt(number);
  }
  //alert(startRes+">"+start+" && "+start+"!="+1);
  if (startRes > start && start != 1) {
    return true
  } else {
    return false
  }
}


//==========スレのロードにかかった時間の表示
function loadtime() {
  var end_time = new Date();
  var start_num = start_time.getMilliseconds() + 1000 * (start_time.getSeconds() + 60 * start_time.getMinutes() + 3600 *
    start_time.getHours());
  var end_num = end_time.getMilliseconds() + 1000 * (end_time.getSeconds() + 60 * end_time.getMinutes() + 3600 *
    end_time.getHours());
  document.getElementById("sizetime").innerHTML += (end_num - start_num) / 1000 + '秒';
}