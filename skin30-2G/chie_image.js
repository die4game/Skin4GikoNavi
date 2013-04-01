//======画像読込の設定
var onMouseLoad = false; // true:カーソルを合わせただけ、false:LOADボタンをクリックしてから
var takeArisk = false; // true:画像読み込み時にモード切替、false:手動でモード切替

//==========以下はスクリプト本文ですよ。
// イベントハンドラ
//onMouseover
// 外部関数
//giko_cus::addAnchor
// 外部変数
//chie_event::cp
//chie_event::tp
//chie_event::vp
//chie_search::dds

//==========グローバル変数
var lightmode = true;

//ローカル変数
var panel; // changeMode(), changePanel(), loadImage()
var imageMoveX, imageMoveY; // imageMoveStart(), imageMove()

//=========グローバル関数
//changeMode()
//changePanel()
//loadImage(btn, href)
//imgResult(img)
//changeSize(btn)
//removeThumb(btn)
//removeError()
//changeView(mode, href)
//clearView(flg)
//imageMoveStart(obj)
//imageMove(obj)
//htmlNotFound()
//imageExt(isu)
//imageExt2(isu)
//allImageLoad(mode)
//imgOver(my, num)


//==========画像処理等
// モード切替
function changeMode() {
  var bd = document.body;
  var dl = document.getElementById("dl");
  var tp = document.getElementById("thumbPanel");
  if (lightmode) { //normalへ
    /* scroll位置記憶 */
    var y = bd.scrollTop;
    /* 擬似フレーム化 */
    //bd.style.overflowY="hidden";
    dl.style.posWidth = bd.clientWidth - 120;
    dl.style.height = "100%";
    dl.style.overflowY = "scroll";
    /* モード移行 */
    lightmode = false;
    /* スクロール */
    dl.scrollTop = y;
    scrollTo(0, 0);
    /* tpの表示   */
    tp.style.visibility = "visible";
    /* cpの移動   */
    cp.style.posRight = 3;
    /* panel=on   */
    panel = true;
    // thumbPanelのスタイル変更
    if (tp) {
      tp.style.height = document.body.clientHeight - 25
    }
  } else { //lightへ
    var dcW = panel ? dl.clientWidth + 120 : dl.clientWidth;
    /* scroll位置記憶 */
    var y = dl.scrollTop;
    /* 擬似フレーム解除 */
    dl.removeAttribute("style", 1);
    //bd.style.overflowY="scroll";
    //dl.style.posWidth =dcW;
    //dl.style.posHeight="";
    //dl.style.overflowY="auto";
    /* モード移行 */
    lightmode = true;
    /* スクロール */
    bd.scrollTop = y;
    /* tpの非表示 */
    tp.style.visibility = "hidden";
    /* cpの移動   */
    cp.style.posRight = 3;
    /* panel=off  */
    panel = false;
  }
}

// パネルの展開
function changePanel() {
  if (lightmode) {
    return
  }
  var dl = document.getElementById("DL");
  /* 閉 */
  if (panel) {
    cp.style.posRight = 18;
    dl.style.posWidth = document.body.clientWidth;
    tp.style.visibility = "hidden";
    panel = false;
  }
  /* 開 */
  else {
    cp.style.posRight = 3;
    dl.style.posWidth = document.body.clientWidth - 120;
    tp.style.visibility = "visible";
    panel = true;
  }
}

// LOADボタン
function insButton(a, hRH) {
  if (!a.nextSibling) return;
  if (a.nextSibling.tagName != 'INPUT' && a.parentElement.tagName != 'DIV') {
    if (imageExt2(a.href)) {
      var nHTML = '<input type="button" value="LOAD" onClick=\'loadImage(this,"' + a.href + '");blur()\'>';
    } else if (imageExt(a.href)) {
      var nHTML = '<input type="button" value="LOAD" onClick=\'loadImage(this,"' + a.href + '");blur()\'>' +
        '<input type="button" value="VIEW" onClick=\'changeView("swf","' + a.href + '");blur()\'>';
    } else {
      var ahref = (hRH) ? hRH : a.href;
      var xhref = 'http://die4game.wkeya.com/ba-simple-proxy.php?mode=native&url=';
      if (ahref.match(/^javascript:.*'(.*)'.*/)) {
        ahref = RegExp.$1 + document.getElementsByName("ThreadURL")[0].content;
        a.href = ahref
      }
      var nHTML = '<input type="button" value="VIEW" onClick=\'changeView("html","' + ahref + '");blur()\'>' +
        '<input type="button" value="XV" onClick=\'changeView("html","' + xhref + ahref + '");blur()\'>' +
        '<input type="button" value="CHK" onClick=\'changeView("html","http://www.aguse.jp/?url=' + ahref +
        '");blur()\'>';
    }
    a.insertAdjacentHTML('AfterEnd', nHTML);
  }
  if (a.className != 'replaced' && a.parentElement.tagName != 'DIV') {
    if (imageExt2(a.href)) {
      if (event.type == "mouseover") { // mouseoverでの読込
        if (onMouseLoad) {
          loadImage(a.nextSibling, a.href);
          a.className = 'replaced';
        }
      } else if (event.type == "click") { // allImageloadでの読込
        loadImage(a.nextSibling, a.href);
        a.className = 'replaced';
      }
    }
    return;
  }
}

// 画像読込
function loadImage(btn, href) {
  if (!panel) {
    changePanel()
  }
  if (takeArisk && lightmode) {
    changeMode()
  }
  // 同一画像確認
  var thumbs = document.images;
  var l = thumbs.length;
  for (var i = l; i--;) {
    if (thumbs[i].src == href) {
      if (lightmode) {
        tp.style.visibility = "visible";
        viewed = true;
      }
      //thumbs[i].scrollIntoView(true);
      imgOver(thumbs[i], 100);
      return true;
    }
  }
  if (btn.parentElement.tagName == "DD") {
    var dt = btn.parentElement.previousSibling;
  } else {
    var dt = btn.parentElement;
  }
  var num = dt.firstChild.firstChild.innerText;
  if (href.match(/www.securityfocus.com/)) {
    if (!confirm(num + "のレスにあるhttp://www.securityfocus.com/の画像はブラクラの可能性が高いですが、開きますか？")) {
      return
    }
  }
  if (href.search(/\.swf/i) == -1) {
    var nHTML = '<div><img src="' + href +
      '" onLoad="imgResult(this)" onError="imgResult(this)" onClick="changeView(\'img\')" onmouseover="imgOver(this,100)" onmouseout="imgOver(this,30)">' +
      addAnchor(num, num) + ' ' + '<button onClick="changeSize(this);blur()">...</button>' +
      '<button onClick="removeThumb(this)">DEL</button>' + '</div>';
  } else {
    var nHTML = '<div><embed src="' + href + '" onFocus="changeView(\'swf\')"></embed>' + addAnchor(num, num) + ' ' +
      '<button onClick="blur()">___</button>' + '<button onClick="removeThumb(this)">DEL</button>' + '</div>';
  }
  if (btn.tagName == "INPUT") {
    btn.value = 'LOADED';
  }
  tp.insertAdjacentHTML('BeforeEnd', nHTML);
  //表示継続
  if (!viewed) {
    tp.style.visibility = "visible";
    viewed = true;
  }
}

// 画像読込判定
function imgResult(img) {
  var btn = img.parentElement.children.item(2);
  if (event.type == "load") {
    btn.value = '___';
    img.style.display = 'block';
  } else {
    btn.value = 'NONE';
    btn.style.color = '#C00';
  }
  if (event.type == "error") {
    var dt = getDTfromAnc(img.parentElement.children.item(1).innerText);
    if (!dt.nextSibling) return;
    var ddAnc = dt.nextSibling.getElementsByTagName("A");
    var a;
    var i = 0;
    do {
      a = ddAnc[i];
      i++;
    } while (a.href != img.href);
    var btn = a.nextSibling;
    btn.value = 'NONE';
    btn.style.color = '#C00';
  }
}

// サイズの切替
function changeSize(btn) {
  var img = vp.firstChild;
  if (!img) {
    return
  }
  if (btn.innerText.match(/100%|_+/)) {
    var hRatio = vp.style.pixelWidth / img.offsetWidth;
    var vRatio = vp.style.pixelHeight / img.offsetHeight;
    var ratio = (hRatio > vRatio) ? vRatio : hRatio;
    if (ratio > 1) {
      ratio = 1
    } else {
      img.style.zoom = ratio * 100 + '%';
    }
    btn.innerText = Math.round(ratio * 100 - 0.5) + "%";
  } else {
    img.style.zoom = "100%";
    btn.innerText = "100%";
  }
}

// サムネイルの削除
function removeThumb(btn) {
  btn.parentElement.removeNode(true);
}

function removeError() {
  if (tp) {
    var l = tp.childNodes.length;
    for (var i = l; i--;) {
      var stateBtn = tp.childNodes[i].childNodes[2];
      if (stateBtn.tagName == "BUTTON" && stateBtn.innerText == "NONE") {
        stateBtn.parentElement.removeNode(true);
      }
    }
  }
}

// 画像表示の切替
function changeView(mode, href) {
  if (!href) {
    href = event.srcElement.src
  }
  if (tp && mode == "img") {
    var l = tp.childNodes.length;
    for (var i = l; i--;) {
      var stateBtn = tp.childNodes[i].childNodes[2];
      if (stateBtn.tagName == "BUTTON" && stateBtn.innerText != "NONE") {
        stateBtn.innerText = "___"
      } //embedはchildNodesに入らない?
    }
  }
  if (!vp.hasChildNodes() || vp.firstChild.src != href) {
    var nHTML, buttons, vpW;
    buttons = '<button onclick="clearView(1)">CLOSE</button>';
    if (mode == "img") {
      nHTML = '<img src="' + href +
        '" ondragstart="imageMoveStart(this)" ondrag="imageMove(this)" onclick="clearView()">';
      vpW = document.body.clientWidth - 130;
    } else if (mode == "swf") {
      nHTML = '<embed src="' + href + '"></embed>' + buttons;
      vpW = document.body.clientWidth - 20;
    } else if (mode == "html") {
      tp.style.display = "none";
      vp.style.right = "10px";
      nHTML = '<object data="' + href + '" type="text/html" onError="htmlNotFound()"></object>' + buttons;
      vpW = document.body.clientWidth - 20;
    }
    vp.innerHTML = nHTML;
    vp.style.posWidth = vpW;
    vp.style.posHeight = document.body.clientHeight - 20;
    if (mode == "img") {
      changeSize(event.srcElement.parentElement.childNodes[2])
    }
  } else {
    clearView();
  }
}

//Viewパネルクリア
function clearView(flg) {
  while (vp.hasChildNodes()) {
    vp.childNodes[0].removeNode(true);
  }
  vp.style.posWidth = "";
  vp.style.posHeight = "";
  if (flg == 1) {
    tp.style.display = "block";
    vp.style.right = "119px";
  }
}

function imageMoveStart(obj) {
  imageMoveX = obj.parentElement.scrollLeft + event.clientX;
  imageMoveY = obj.parentElement.scrollTop + event.clientY
}

function imageMove(obj) {
  obj.parentElement.scrollLeft = imageMoveX - event.clientX;
  obj.parentElement.scrollTop = imageMoveY - event.clientY
}

function htmlNotFound() {
  alert('404 NotFound かも\ ');
  clearView();
}

// LOADボタン挿入対象拡張子（通常用）
function imageExt(isu) {
  if (isu.search(/\.png$|\.jp(g|e|eg)$|\.gif$|\.bmp$|\.swf/i) != -1) {
    return true
  } else {
    return false
  }
}

// LOADボタン挿入対象拡張子（一括読込用）
function imageExt2(isu) {
  if (isu.search(/\.png$|\.jp(g|e|eg)$|\.gif$|\.bmp$/i) != -1) {
    return true
  } else {
    return false
  }
}

// 画像一括読み込み
function allImageLoad(mode) {
  var ddl = dds.length;
  var exist;
  for (var i = 0; i < ddl; i++) {
    if (mode == "new" && dds[i].previousSibling.className.search(/new/) < 0) continue;
    var ddAnc = dds[i].getElementsByTagName("A");
    for (j = 0; j < ddAnc.length; j++) {
      cn = ddAnc[j];
      if (imageExt2(cn.href)) {
        insButton(cn, cn.href);
        exist = true
      }
    }
  }
  if (!exist) {
    var target;
    if (mode == "new") {
      target = "新着レス"
    } else {
      target = "全てのレス"
    }
    alert(target + "に画像はないよ\ ")
  }
}

// モザイク処理
function imgOver(my, num) {
  my.style.filter = "Alpha(opacity=" + num + ")"
}