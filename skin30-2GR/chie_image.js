//======�摜�Ǎ��̐ݒ�
var onMouseLoad = false; // true:�J�[�\�������킹�������Afalse:LOAD�{�^�����N���b�N���Ă���
var takeArisk = false; // true:�摜�ǂݍ��ݎ��Ƀ��[�h�ؑցAfalse:�蓮�Ń��[�h�ؑ�

//==========�ȉ��̓X�N���v�g�{���ł���B
// �C�x���g�n���h��
//onMouseover
// �O���֐�
//giko_cus::addAnchor
// �O���ϐ�
//chie_event::cp
//chie_event::tp
//chie_event::vp
//chie_search::dds

//==========�O���[�o���ϐ�
var lightmode = true;

//���[�J���ϐ�
var panel; // changeMode(), changePanel(), loadImage()
var imageMoveX, imageMoveY; // imageMoveStart(), imageMove()

//=========�O���[�o���֐�
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


//==========�摜������
// ���[�h�ؑ�
function changeMode() {
  var bd = document.body;
  var dl = document.getElementById("dl");
  var tp = document.getElementById("thumbPanel");
  if (lightmode) { //normal��
    /* scroll�ʒu�L�� */
    var y = bd.scrollTop;
    /* �[���t���[���� */
    //bd.style.overflowY="hidden";
    dl.style.posWidth = bd.clientWidth - 120;
    dl.style.height = "100%";
    dl.style.overflowY = "scroll";
    /* ���[�h�ڍs */
    lightmode = false;
    /* �X�N���[�� */
    dl.scrollTop = y;
    scrollTo(0, 0);
    /* tp�̕\��   */
    tp.style.visibility = "visible";
    /* cp�̈ړ�   */
    cp.style.posRight = 3;
    /* panel=on   */
    panel = true;
    // thumbPanel�̃X�^�C���ύX
    if (tp) {
      tp.style.height = document.body.clientHeight - 25
    }
  } else { //light��
    var dcW = panel ? dl.clientWidth + 120 : dl.clientWidth;
    /* scroll�ʒu�L�� */
    var y = dl.scrollTop;
    /* �[���t���[������ */
    dl.removeAttribute("style", 1);
    //bd.style.overflowY="scroll";
    //dl.style.posWidth =dcW;
    //dl.style.posHeight="";
    //dl.style.overflowY="auto";
    /* ���[�h�ڍs */
    lightmode = true;
    /* �X�N���[�� */
    bd.scrollTop = y;
    /* tp�̔�\�� */
    tp.style.visibility = "hidden";
    /* cp�̈ړ�   */
    cp.style.posRight = 3;
    /* panel=off  */
    panel = false;
  }
}

// �p�l���̓W�J
function changePanel() {
  if (lightmode) {
    return
  }
  var dl = document.getElementById("DL");
  /* �� */
  if (panel) {
    cp.style.posRight = 18;
    dl.style.posWidth = document.body.clientWidth;
    tp.style.visibility = "hidden";
    panel = false;
  }
  /* �J */
  else {
    cp.style.posRight = 3;
    dl.style.posWidth = document.body.clientWidth - 120;
    tp.style.visibility = "visible";
    panel = true;
  }
}

// LOAD�{�^��
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
      if (event.type == "mouseover") { // mouseover�ł̓Ǎ�
        if (onMouseLoad) {
          loadImage(a.nextSibling, a.href);
          a.className = 'replaced';
        }
      } else if (event.type == "click") { // allImageload�ł̓Ǎ�
        loadImage(a.nextSibling, a.href);
        a.className = 'replaced';
      }
    }
    return;
  }
}

// �摜�Ǎ�
function loadImage(btn, href) {
  if (!panel) {
    changePanel()
  }
  if (takeArisk && lightmode) {
    changeMode()
  }
  // ����摜�m�F
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
    if (!confirm(num + "�̃��X�ɂ���http://www.securityfocus.com/�̉摜�̓u���N���̉\���������ł����A�J���܂����H")) {
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
  //�\���p��
  if (!viewed) {
    tp.style.visibility = "visible";
    viewed = true;
  }
}

// �摜�Ǎ�����
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

// �T�C�Y�̐ؑ�
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

// �T���l�C���̍폜
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

// �摜�\���̐ؑ�
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
      } //embed��childNodes�ɓ���Ȃ�?
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

//View�p�l���N���A
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
  alert('404 NotFound ����\ ');
  clearView();
}

// LOAD�{�^���}���Ώۊg���q�i�ʏ�p�j
function imageExt(isu) {
  if (isu.search(/\.png$|\.jp(g|e|eg)$|\.gif$|\.bmp$|\.swf/i) != -1) {
    return true
  } else {
    return false
  }
}

// LOAD�{�^���}���Ώۊg���q�i�ꊇ�Ǎ��p�j
function imageExt2(isu) {
  if (isu.search(/\.png$|\.jp(g|e|eg)$|\.gif$|\.bmp$/i) != -1) {
    return true
  } else {
    return false
  }
}

// �摜�ꊇ�ǂݍ���
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
      target = "�V�����X"
    } else {
      target = "�S�Ẵ��X"
    }
    alert(target + "�ɉ摜�͂Ȃ���\ ")
  }
}

// ���U�C�N����
function imgOver(my, num) {
  my.style.filter = "Alpha(opacity=" + num + ")"
}