//==========以下はスクリプト本文ですよ。
//イベントハンドラ定義
//外部関数
//giko_cus::loadtime
//giko_cus::checkAnchor(href)
//chie_image::allImageLoad
//chie_image::insButton
//chie_search::setHash
//chie_search::getID
//chie_search::searchPerson(obj)
//chie_search::searchRef(obj)
//chie_search::findIt(arg)
//chie_popup::tohan
//外部変数
//giko_cus::anchorHead
//giko_cus::skinName
//giko_cus::browser
//chie_image::lightmode
//chie_search::dts


//=========グローバル変数
var waited = false; //command表示後trueにし、選択後にfalseにする。
var viewed = false; //thumb読込み後trueにし、thumbPanelに乗降後falseにする。
var searched = false; //検索後に、trueにし、foundPanelに乗降後falseにする。
var cp, tp, vp, fp;

//mousedownEvent(), copyMenu()
var clickCancel, e, ex, ey, clickTimer;

//=========グローバル関数
//clickEvent()
//mouseOverEvent()
//mouseMoveEvent()
//panelOver()
//imgCommand(mode, s)
//fndCommand(mode, s)
//clearCommand()
//mousedownEvent()
//copyMenu()
//colorChange()
//copyText(target)
//defaultPopup()
//key()
//onscrollEvent()
//onLoadEvent()


//========Click処理→search,他
document.onclick = clickEvent;

function clickEvent() {
  if (clickCancel) {
    return false;
  } else {
    clearTimeout(clickTimer);
    if (document.getElementById("context")) {
      document.getElementById("context").removeNode(true);
    }
  }
  var obj = window.event.srcElement;
  var tag = obj.tagName;
  if (tag == "B" || tag == "U" || tag == "SPAN") {
    if (e.innerText.match(/^あぼ～ん$/)) {
      abonePopup(e);
    } else
    searchPerson(obj);
  } //名前,トリップ,ID
  else if (tag == "DT") {
    searchRef(obj);
  } else if (tag == "DD") {
    defaultPopup();
  } else if (tag == "A") {
    if (obj.rel) {
      obj.href = obj.rel;
    }
    //非表示レスの表示
    if (hiddenRes(obj)) {
      showModelessDialog(document.getElementsByName("ThreadURL")[0].content.replace(/\/l50$/, "/") + tohan(obj.innerText
        .replace(/[>＞]/g, "")), window, "dialogWidth:" + document.body.clientWidth +
        "px;help:no;resizable:yes;status:no;unadorned:yes;");
      window.focus();
    }
    //レスジャンプ補正
    if (obj.href.match(/^about|jumpres/)) {
      var h = tohan(obj.innerText.replace(/[>＞]/g, ""));
      var anchor = document.anchors(anchorHead + h);
      if (anchor) {
        anchor.scrollIntoView(true);
        return false
      }
    }
    return true;
  } else {
    panelOver();
    return
  }
}


//=========MouseOver処理→image,popup
document.onmouseover = mouseOverEvent;

function mouseOverEvent() {
  var e = window.event.srcElement;
  if (e.tagName == 'B') {
    if (e.innerText.match(/^([^\d０-９]*)([\d０-９]+)([^\d０-９]*.*)/)) {
      namePopup(e, RegExp.$1, RegExp.$2, RegExp.$3);
      }
  }
  if (e.tagName == 'A') {
    if (e.innerText.match(/%/)) { // URLエンコードでありがちな%
      try {
        e.title = decodeURI(e.innerText);
      } catch (err) {
        // ShiftJIS,EUC-JPのデコードは面倒だからつけない。
      }
    }
    if (checkAnchor(e.href) == 2) {
      insButton(e);
      return;
    } else if (checkAnchor(e.href) == 3) {
      insYouTube(e,3);
      return;
    } else if (checkAnchor(e.href) == 4) {
      insYouTube(e,4);
      return;
    } else if (checkAnchor(e.href) == 0) { // 逆参照ポップアップ
      if (e.href.match(/menu:/)) {// && event.shiftKey) {alert("gyaku");
        searchPopup(e)
      }
    }
  } else if (e.tagName == "SPAN" || e.tagName == "TT") {
    var obj = e;
    var onPopup;
    while (obj.tagName != "BODY") {
      if (obj.id.match(/p\d+/)) {
        onPopup = true;
        break
      } else {
        obj = obj.parentElement
      }
    }
    if (e.tagName == "SPAN") {
      if (!onPopup && event.shiftKey) {
        searchPopup(e)
      }
    } else {
      searchPopup(e)
    }
  } else { // 多段ポップアップ消去
    var obj = e;
    var onPopup;
    if (obj.sourceIndex < 0) {
      obj = document.body;
      if (document.getElementById("popupBase")) {
        onPopup = true;
      }
    } // namePopupとの競合でノードが外れる瞬間の回避
    while (obj.tagName != "BODY") {
      if (obj.id.match(/(p\d+)/)) {
        onPopup = true;
        break
      } else {
        obj = obj.parentElement;
      }
    }
    if (onPopup) {
      while (obj.id != obj.parentElement.lastChild.id) {
        obj.parentElement.lastChild.removeNode(true)
      }
    } else {
      removePopup()
    }
  }
}


//=========MouseMove処理→panelOver()
document.onmousemove = mouseMoveEvent;

function mouseMoveEvent() {
  if (!cp) {
    var nHTML = '<div id="controlPanel">' + '<input type="button" value="IMG" onmouseup="imgCommand();blur()">' +
      '<input type="button" value="FND" onclick="fndCommand();blur();">' + '</div>' +
      '<div id="foundPanel" onmouseout="searched=false"></div>';
    if (skinName.match(/30-2/)) {
      nHTML += '<div id="thumbPanel" onmouseout="viewed=false"></div>' + '<div id="viewPanel"></div>';
    }
    document.body.insertAdjacentHTML("afterBegin", nHTML);
    cp = document.getElementById("controlPanel");
    fp = document.getElementById("foundPanel");
    if (skinName.match(/30-2/)) {
      tp = document.getElementById("thumbPanel");
      vp = document.getElementById("viewPanel");
    } else {
      tp = vp = new Object();
    }
    cp.condition = "waited";
    tp.condition = "vp.firstChild || viewed || !lightmode";
    fp.condition = resultView ? "fp.hasChildNodes()" : "searched";
    cp.territorymax = "<25";
    cp.territorymin = ">0";
    tp.territorymin = ">20";
    tp.territorymax = "<110";
    fp.territorymax = "<(30+fp.clientHeight) && fp.hasChildNodes()";
    fp.territorymin = ">0";
  }
  if (event) {
    panelOver();
  }
  //if(!idHash.length){setHash();searchColoring();}
}

// 各パネル
function panelOver() {
  var territoryW = document.body.clientWidth - 120;
  var territoryH = 25;
  var panels = new Array("cp", "tp", "fp");
  for (var i in panels) {
    var panel = eval(panels[i]);
    var territoryYmin = eval("event.y" + panel.territorymin);
    var territoryYmax = eval("event.y" + panel.territorymax);
    var territoryX = eval(event.x > document.body.clientWidth - panel.offsetWidth - 15);
    if (eval(panel.condition)) {
      panel.style.visibility = "visible";
      return;
    }
    if (territoryYmin && territoryYmax && territoryX) {
      panel.style.visibility = "visible";
      if (panels[i] == "tp") {
        panel.style.height = document.body.clientHeight - 25;
        panel.territorymax = ">20";
      }
    } else {
      panel.style.visibility = "hidden";
      if (panels[i] == "tp") {
        panel.style.height = "90px";
        panel.territorymax = "<110";
      }
    }
  }
}

// IMG
function imgCommand(mode, s) {
  if (fp) fp.style.visibility = "hidden";
  if (!waited) {
    var nHTML =
      '<div id="command" onclick="clearCommand()"><input type="button" onclick="allImageLoad(\'all\')" value="全レス一括読込"><br><input type="button" onclick="allImageLoad(\'new\')" value="新レス一括読込"><br><input type="button" onclick="removeError()" value="Error画像削除"><br><input type="button" onclick="changeMode()" value="モード切替"></div>';
    event.srcElement.parentElement.insertAdjacentHTML('beforeEnd', nHTML);
    waited = true;
  } else {
    clearCommand();
  }
}

function fndCommand(mode, s) {
  if (fp) fp.style.visibility = "hidden";
  if (!waited) {
    var nHTML =
    '<div id="command" onclick="clearCommand()"><input type="button" onclick="findIt(document.selection.createRange().text)" value="スレ内検索"><br><a href="http://find.2ch.net/?STR=\'+encodeURI(document.selection.createRange().text)+\'"><input type="button" onclick="allBoardSearch(document.selection.createRange().text)" value="全板検索"></a></div>';
    event.srcElement.parentElement.insertAdjacentHTML('beforeEnd', nHTML);
    waited = true;
    //event.cancelBubble = true;
  } else {
    clearCommand();
  }
}

function clearCommand() {
  waited = false;
  document.getElementById("command").removeNode(true);
}


//=========左長押処理→copyMenu()
document.onmousedown = mousedownEvent;

function mousedownEvent() {
  var obj = e = event.srcElement;
  ex = event.x;
  ey = event.y;
  if (document.getElementById("context") && obj.innerText == document.getElementById("context").name) {
    return
  }
  clickCancel = false;
  if (obj.nextSibling && obj.nextSibling.tagName == "U" && event.button == 1) {
    clickTimer = setTimeout("copyMenu()", 500);
  }
}

//コピーメニュー→colorChange(), copyText()

function copyMenu() {
  clickCancel = true;
  clearTimeout(clickTimer);
  if (document.getElementById("context")) {
    document.getElementById("context").removeNode(true);
  }
  var nHTML = '<div id="context" name="' + e.innerText + '">'+
    '<div onclick="copyText(\'name\')" onmouseover="colorChange()" onmouseout="colorChange()">名前をコピー</div>'+
    '<div onclick="copyText(\'id\')" onmouseover="colorChange()" onmouseout="colorChange()">IDをコピー</div>'+
    '<div onclick="changeAAmode()" onmouseover="colorChange()" onmouseout="colorChange()">AAモード</div>'+
  '</div>';
  document.body.insertAdjacentHTML("afterBegin", nHTML);
  var context = document.getElementById("context");
  context.style.pixelLeft = document.body.scrollLeft + ex
  context.style.pixelTop = document.body.scrollTop + ey;
  context.style.visibility = "visible";
  context.style.zIndex = 10;
}

function colorChange() {
  var style = event.srcElement.style;
  if (event.type == "mouseout") {
    style.backgroundColor = "Menu";
    style.color = "MenuText";
  } else {
    style.backgroundColor = "Highlight";
    style.color = "HighlightText";
  }
}

//クリップボードにコピー
function copyText(target) {
  var num = event.srcElement.parentElement.name;
  var obj = getDTfromAnc(num);
  var textarea = document.createElement("TEXTAREA");
  var message = obj.nextSibling.innerText.replace(/\s(\r\n|$)/g, "\n");
  if (target == "res") {
    textarea.value = obj.firstChild.innerText + " ：" + obj.childNodes[1].innerText + " ：" + obj.lastChild.innerText +
      "\n" + message;
  } else if (target == "name") {
    textarea.value = obj.childNodes[0].childNodes[1].innerText + "\n";
  } else if (target == "id") {
    textarea.value = "ID:" + (obj.lastChild.innerText.split(/ID:/))[1] + "\n";
  }
  var copyText = textarea.createTextRange();
  copyText.execCommand("Copy")
  event.srcElement.parentElement.removeNode(true);
}

//AAモード
function changeAAmode () {
  var num = event.srcElement.parentElement.name;
  var obj = getDTfromAnc(num);
  var aamodeWS = obj.nextSibling.style.whiteSpace;
  var aamodeZM = obj.nextSibling.style.zoom;
  if (aamodeWS == "nowrap" && aamodeZM == 0.8) {
    obj.nextSibling.style.removeAttribute("whiteSpace");
    obj.nextSibling.style.removeAttribute("zoom");
    obj.nextSibling.style.removeAttribute("fontSize");
    obj.nextSibling.style.removeAttribute("fontFamily");
    document.body.style.removeAttribute("overflowX");
  } else {
    obj.nextSibling.style.whiteSpace = "nowrap";
    obj.nextSibling.style.zoom = 0.8;
    obj.nextSibling.style.fontSize = "16px";
    obj.nextSibling.style.fontFamily = "MS Pゴシック";    
    document.body.style.overflowX = "auto";
  }
}

//=========DoubleClick処理→defaultPopup()
document.ondblclick = defaultPopup;

function defaultPopup() {
  var num = document.selection.createRange().text.replace(/\s$/, "");
  var hnum = tohan(num);
  if (!isNaN(hnum) && hnum <= 1000) {
    var obj = document.createElement("a");
    obj.innerText = num;
    obj.href = "#" + hnum;
    makePopContent(obj);
  } else if (num.match(/\S{8,9}/)) { //\w{8}ではだめぽ？
    var obj = document.createElement("DT");
    obj.innerHTML = "<span>date time ID:" + num + "</span>";
    searchPerson(obj.firstChild);
  }
}


//=========キーボード入力（skin30-2でのキー無効の回避＋α）
document.onkeydown = key;

function key() {
  var dl = document.getElementsByTagName("DL").item(0);
  var code = event.keyCode;
  if (code == "32" && !event.shiftKey || code == "34") {//space, pageDown
    dl.scrollTop += dl.offsetHeight;
  } else if (code == "32" && event.shiftKey || code == "33") {//shift + space, pageUp
    dl.scrollTop -= dl.offsetHeight;
  } else if (code == "40") {//↓
    dl.scrollTop += 36;
  } else if (code == "38") {//↑
    dl.scrollTop -= 36;
    return true;
  } else if (code == "70" && event.shiftKey) {//shift + f
    findIt(document.selection.createRange().text);
    return false;
  } // shift+F
}


//=========onScroll処理
//window.onscroll=function(){clearInterval(beforeScrollTimer);onscrollEvent()}
window.onscroll = onscrollEvent;

function onscrollEvent() {
  mouseMoveEvent();
  searchColoring();
}

if (document.getElementById("dl")) {
  document.getElementById("dl").onscroll = function () {
    onscrollEvent()
  }
}


//=========onLoad処理
window.onload = onLoadEvent;

function onLoadEvent() {
  loadtime();
  setHash();
}

setTimeout(onscrollEvent, 1000); // 一回だけ着色