//==========�ȉ��̓X�N���v�g�{���ł���B
//�C�x���g�n���h����`
//�O���֐�
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
//�O���ϐ�
//giko_cus::anchorHead
//giko_cus::skinName
//giko_cus::browser
//chie_image::lightmode
//chie_search::dts


//=========�O���[�o���ϐ�
var waited = false; //command�\����true�ɂ��A�I�����false�ɂ���B
var viewed = false; //thumb�Ǎ��݌�true�ɂ��AthumbPanel�ɏ�~��false�ɂ���B
var searched = false; //������ɁAtrue�ɂ��AfoundPanel�ɏ�~��false�ɂ���B
var cp, tp, vp, fp;

//mousedownEvent(), copyMenu()
var clickCancel, e, ex, ey, clickTimer;

//=========�O���[�o���֐�
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


//========Click������search,��
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
    if (e.innerText.match(/^���ځ`��$/)) {
      abonePopup(e);
    } else
    searchPerson(obj);
  } //���O,�g���b�v,ID
  else if (tag == "DT") {
    searchRef(obj);
  } else if (tag == "DD") {
    defaultPopup();
  } else if (tag == "A") {
    if (obj.rel) {
      obj.href = obj.rel;
    }
    //��\�����X�̕\��
    if (hiddenRes(obj)) {
      showModelessDialog(document.getElementsByName("ThreadURL")[0].content.replace(/\/l50$/, "/") + tohan(obj.innerText
        .replace(/[>��]/g, "")), window, "dialogWidth:" + document.body.clientWidth +
        "px;help:no;resizable:yes;status:no;unadorned:yes;");
      window.focus();
    }
    //���X�W�����v�␳
    if (obj.href.match(/^about|jumpres/)) {
      var h = tohan(obj.innerText.replace(/[>��]/g, ""));
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


//=========MouseOver������image,popup
document.onmouseover = mouseOverEvent;

function mouseOverEvent() {
  var e = window.event.srcElement;
  if (e.tagName == 'B') {
    if (e.innerText.match(/^([^\d�O-�X]*)([\d�O-�X]+)([^\d�O-�X]*.*)/)) {
      namePopup(e, RegExp.$1, RegExp.$2, RegExp.$3);
      }
  }
  if (e.tagName == 'A') {
    if (e.innerText.match(/%/)) { // URL�G���R�[�h�ł��肪����%
      try {
        e.title = decodeURI(e.innerText);
      } catch (err) {
        // ShiftJIS,EUC-JP�̃f�R�[�h�͖ʓ|��������Ȃ��B
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
    } else if (checkAnchor(e.href) == 0) { // �t�Q�ƃ|�b�v�A�b�v
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
  } else { // ���i�|�b�v�A�b�v����
    var obj = e;
    var onPopup;
    if (obj.sourceIndex < 0) {
      obj = document.body;
      if (document.getElementById("popupBase")) {
        onPopup = true;
      }
    } // namePopup�Ƃ̋����Ńm�[�h���O���u�Ԃ̉��
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


//=========MouseMove������panelOver()
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

// �e�p�l��
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
      '<div id="command" onclick="clearCommand()"><input type="button" onclick="allImageLoad(\'all\')" value="�S���X�ꊇ�Ǎ�"><br><input type="button" onclick="allImageLoad(\'new\')" value="�V���X�ꊇ�Ǎ�"><br><input type="button" onclick="removeError()" value="Error�摜�폜"><br><input type="button" onclick="changeMode()" value="���[�h�ؑ�"></div>';
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
    '<div id="command" onclick="clearCommand()"><input type="button" onclick="findIt(document.selection.createRange().text)" value="�X��������"><br><a href="http://find.2ch.net/?STR=\'+encodeURI(document.selection.createRange().text)+\'"><input type="button" onclick="allBoardSearch(document.selection.createRange().text)" value="�S����"></a></div>';
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


//=========������������copyMenu()
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

//�R�s�[���j���[��colorChange(), copyText()

function copyMenu() {
  clickCancel = true;
  clearTimeout(clickTimer);
  if (document.getElementById("context")) {
    document.getElementById("context").removeNode(true);
  }
  var nHTML = '<div id="context" name="' + e.innerText + '">'+
    '<div onclick="copyText(\'name\')" onmouseover="colorChange()" onmouseout="colorChange()">���O���R�s�[</div>'+
    '<div onclick="copyText(\'id\')" onmouseover="colorChange()" onmouseout="colorChange()">ID���R�s�[</div>'+
    '<div onclick="changeAAmode()" onmouseover="colorChange()" onmouseout="colorChange()">AA���[�h</div>'+
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

//�N���b�v�{�[�h�ɃR�s�[
function copyText(target) {
  var num = event.srcElement.parentElement.name;
  var obj = getDTfromAnc(num);
  var textarea = document.createElement("TEXTAREA");
  var message = obj.nextSibling.innerText.replace(/\s(\r\n|$)/g, "\n");
  if (target == "res") {
    textarea.value = obj.firstChild.innerText + " �F" + obj.childNodes[1].innerText + " �F" + obj.lastChild.innerText +
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

//AA���[�h
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
    obj.nextSibling.style.fontFamily = "MS P�S�V�b�N";    
    document.body.style.overflowX = "auto";
  }
}

//=========DoubleClick������defaultPopup()
document.ondblclick = defaultPopup;

function defaultPopup() {
  var num = document.selection.createRange().text.replace(/\s$/, "");
  var hnum = tohan(num);
  if (!isNaN(hnum) && hnum <= 1000) {
    var obj = document.createElement("a");
    obj.innerText = num;
    obj.href = "#" + hnum;
    makePopContent(obj);
  } else if (num.match(/\S{8,9}/)) { //\w{8}�ł͂��߂ہH
    var obj = document.createElement("DT");
    obj.innerHTML = "<span>date time ID:" + num + "</span>";
    searchPerson(obj.firstChild);
  }
}


//=========�L�[�{�[�h���́iskin30-2�ł̃L�[�����̉���{���j
document.onkeydown = key;

function key() {
  var dl = document.getElementsByTagName("DL").item(0);
  var code = event.keyCode;
  if (code == "32" && !event.shiftKey || code == "34") {//space, pageDown
    dl.scrollTop += dl.offsetHeight;
  } else if (code == "32" && event.shiftKey || code == "33") {//shift + space, pageUp
    dl.scrollTop -= dl.offsetHeight;
  } else if (code == "40") {//��
    dl.scrollTop += 36;
  } else if (code == "38") {//��
    dl.scrollTop -= 36;
    return true;
  } else if (code == "70" && event.shiftKey) {//shift + f
    findIt(document.selection.createRange().text);
    return false;
  } // shift+F
}


//=========onScroll����
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


//=========onLoad����
window.onload = onLoadEvent;

function onLoadEvent() {
  loadtime();
  setHash();
}

setTimeout(onscrollEvent, 1000); // ��񂾂����F