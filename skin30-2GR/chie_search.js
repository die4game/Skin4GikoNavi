beID = false; // be�Ƀ��O�C���o����ꍇ�́Atrue

//==========�����ݒ�
var expression = "multiAND"; // �������@�@�@default:�W���AregExp:���K�\���AmultiAnd:AND�����AmultiOR:OR����
var searchView = "resList"; // �������ʕ\���@�@resList:�Y�����X�ԍ��\���AresPopup:�Y�����X�|�b�v�A�b�v�A
var resultView = false; // �������ʂ̏펞�\���@�@true:�펞�\���Afalse:�}�E�X�ŋ߂Â����Ƃ��̂ݕ\��
var listLimit = 10; // searchView��resPopup�łȂ��ꍇ�́A���X�ԍ��̕\������

//==========���X�ԍ��A���t������̒��F�ݒ�
coloring = 1; // ���F����:1�@���F���Ȃ�:0
threshold1 = [2, "#0000ff"]; // �������݂���������ID �̂������l�ƐF
threshold2 = [5, "#aaaa00"]; // �������݂���������ID �̂������l�ƐF
threshold3 = [8, "#ff0000"]; // �������݂���������ID �̂������l�ƐF
threshold4 = [1, "#0000FF"]; // �������݂�����    ���X �̂������l�ƃ��X�ԍ��̐F
threshold5 = [4, "#aaaa00"]; // �������݂��������郌�X �̂������l�ƃ��X�ԍ��̐F
threshold6 = [7, "#ff0000"]; // �������݂��������郌�X �̂������l�ƃ��X�ԍ��̐F

//==========���O�EID�����ɂ�郌�X�̑т̐F�w��i16�i������Web�`���̐F���Ŏw��B�����ł��B�A���t�@�x�b�g�͏������ł��肢�j
var foundResColor = new Array("#ffdfee", "#eeffdf", "#ffeedf", "#dfffee", "#eedfff", "#ffffe1");

//==========�P�ꌟ���ɂ��n�C���C�g�F�w��i����j
var highlightColor = new Array("#ffff66", "#a0ffff", "#99ff99", "#ff9999", "#ff66ff", "#880000", "#00aa00", "#886800",
  "#004699", "#990099");


//==========�ȉ��̓X�N���v�g�{���ł���B
// �C�x���g�n���h���FonClick,onScroll,onMousemove
// �O���֐�
//addAnchor
//giko_cus::checkAnchor(href)
//tohan
//searchPopup
//chie_popup::returnString(num)
// �O���ϐ��FanchorHead,browser,fp
// �t�Q�Ƃ̓����F�C�x���g����DT�ɑΉ�����DD���ɁADL-DT-DD�\�����쐬����B


//==========CSS�̏o��
var nCSS = '';
nCSS += '#foundPanel {position:absolute;top:expression(body.scrollTop+25);right:18px;padding:2px 5px;' +
  'z-index:6;background-color:white;border:1px solid #999;visibility:hidden}';
nCSS += '#foundPanel div{padding-left:5px;text-align:right;font-size:100%;}';
nCSS += '.refResult{margin:0.5em 0.3em; border:1px solid #666;padding-right:0px}';
nCSS += '.refResult{border-top:none}';
nCSS += '.refResult dt{margin-right:0px;}';
nCSS += '.refResult dd{margin-left:0.8em;}';
document.write('<style type="text/css">' + nCSS + '</style>\n');
var nCSS = '';
for (var css in foundResColor) {
  var c = foundResColor[css].replace(/#/, "");
  nCSS += '#COLOR' + c + " a{border-color:" + foundResColor[css] + "}\n";
  nCSS += '#COLOR' + c + " a:hover{border-color:red}\n";
}
document.write('<style type="text/css">' + nCSS + '</style>\n');

//=========�O���t�@�C�����p�̃O���[�o���ϐ�
var dts = document.getElementsByTagName('DT');
var dds = document.getElementsByTagName('DD');
var idHash = new Array();
var refHash = new Array();
var foundRes, highlight;

var setEndIdx = setEndNum = 0;
var resUnit = new Array();
var regID = new RegExp(); // HOST���\�ɂ��Ă݂�
regID.compile(".*?\\s.*?\\s.*:(.*?)(\\s|$)"); // 1000res��0.02�b�قǍ���
var markedDT;
var searchWindow = null;
var word = "";
var range;
var searchTarget = {
  "word": true
};
var ancs = document.anchors;
var regIMG = new RegExp(".*?\\s.*?\\s.*:.*?\\sIMG:(.*?)(\\s|$)"); // �摜���\�ɂ��Ă݂�

//=========�O���[�o���֐�
//setHash()
//searchColoring()
//setSearchColor(dt)
//searchPerson(obj)
//getID(span)
//createHash(name, key, arr, word)
//selectColor(type)
//clearColor(type, color)
//toggleResColor(dt, c)
//removeRes(dt)
//returnFound(type, color)
//moveToSearchRes(type, color)
//changeSearchView()
//findIt(arg)
//createSearchPanel(arg)
//searchWord()
//setHighlight(reg)
//searchRef(obj)
//getDTfromAnc(num)
//getIMG(obj)


//==========ID�ƎQ�Ƃ��n�b�V���Ɋi�[
// �z��̃n�b�V�����y�����ۂ��̂ŁA�󔒋�؂�̒l�ɂ��P���ȃn�b�V���ɂ��Ă݂�e�X�g�B
// setEndIdx:�{���̓����X���d���������Ȃ��悤�ɁAHash���ʒu�Ƃ��Ă�dts�̍ŏIindex���L��
// setEndNum:�{���ȊO���X���d���������Ȃ��悤�ɁA�ŏI���X�ԍ����L��
function setHash() {
  //var t0=new Date();
  var l = Math.min(dts.length, dds.length);
  var lastNum = l ? parseInt(dts[l - 1].firstChild.innerText) : 0; //lastNum�ɃX���̃T�C�Y���擾
  if (isNaN(lastNum) && l > 1) {
    lastNum = parseInt(dts[l - 2].firstChild.firstChild.innerText)
  } //Footer����Ȃ��O lastNum�ɍŏI���X �ԍ����擾
  if (l == 0 || lastNum <= setEndNum) {
    return
  } // �Ō�܂Œ����ς݂Ȃ���
  for (var i = setEndIdx; i < l; i++) {
    if (dds[i].parentElement.className == "refResult") {
      continue
    } // �t�Q�Ɠ���DD�Ȃ���
    if (!dts[i].firstChild.firstChild) {
      continue
    } // ���X�Ԃ��擾�ł��Ȃ���Ή��
    var num = dts[i].firstChild.firstChild.innerText;
    var span = dts[i].lastChild;
    // ID
    var t = getID(span);
    if (t && t.length > 3) {
      idHash[t] = idHash[t] ? idHash[t] + " " + num : num;
    } // ???��ID:0,ID:#(@�]�k)�̓X���[�B
    // �摜��
    var imgURL = getIMG(span);
    if (imgURL) {
      var dd = dts[i].nextSibling;
      if (tp && imgURL && !dd.getElementsByTagName("IMG").length) {
        var aObj = (dd.innerText) ? '<br><a href="' + imgURL + '">' + imgURL + '</a>' : '<a href="' + imgURL + '">' +
          imgURL + '</a>';
        if (!beID && imgURL.match(/kako/)) { //dd.insertAdjacentHTML("beforeEnd","<br>Be�Ƀ��O�C�����ĂȂ��Ǝ擾�ł��܂���")
        } else {
          dd.insertAdjacentHTML("beforeEnd", aObj)
        }
      }
    }
    // ref,IMG
    var ddAnc = dds[i].getElementsByTagName("A");
    for (var j = 0; j < ddAnc.length; j++) {
      var ddAnch_ref = ddAnc[j].innerText;
      if (ddAnch_ref.match(/%(.?[^0-9a-fA-F]|.?$)/)) { // �s���ȃp�[�Z���g�G���R�[�h��r��
        ddAnc[j].clearAttributes();
        continue;
      }
      if (checkAnchor(ddAnc[j].href) == 0) {
        continue;
      } else if (checkAnchor(ddAnc[j].href) == 1) {
        var anc = tohan(ddAnc[j].innerText.replace(/[>��]/g, ""));
        var start, end;
        if (anc.match(/(\d*)\D+(\d*)/)) {
          start = parseInt(RegExp.$1);
          end = parseInt(RegExp.$2);
          if ((end - start > 100) || (num - end < 4 && start == 1)) {
            continue
          } // >>1-1000�Ƃ�>>1-n(���O���X)�Ƃ��͉ؗ�ɃX���[
        } else {
          start = end = parseInt(anc);
        }
        var k = start - 1;
        do {
          k++;
          if ((!refHash[k] || refHash[k].indexOf(num) == -1) && num > k) {
            refHash[k] = refHash[k] ? refHash[k] + " " + num : num;
          } // �d���▢���ւ̃A���J�[�̓X���[
        } while (k < end);
      } //else if(imageExt2(ddAnc[j].href) && onOpenLoad!=0){
      /*
    if(onOpenLoad==1 && !dds[i].previousSibling.className.match(/new/)) {
        continue;
        alert(true);
    }else{
        alert(false);
    }
    insButton(ddAnc[j],ddAnc[j].href);
    */
      //}
    }
  }
  setEndIdx = l;
  setEndNum = lastNum;
  //var t1=new Date(); var t=(t1-t0)/1000; if(t){alert(t+"�b");}
}

// �X���b�h�E�B���h�E���S�ɑO��5���X�𒅐F
function searchColoring() {
  if (!coloring) {
    return;
  } // ���F�s�v�Ȃ�I��
  var scr = lightmode ? document.body : document.getElementById("dl");
  var nowScrollPos = scr.scrollTop + document.body.clientHeight / 2;
  var l = Math.min(dts.length, dds.length);
  var st, ed;
  // dt��offsetTop���i�[�i25���X�P�ʁj
  if (resUnit.length <= Math.floor(dts.length / 25)) {
    resUnit[0] = 0;
    for (var i = 25; i < l; i += 25) {
      resUnit[i / 25] = dts[i].offsetTop;
    }
  }
  // ���݂ǂ̂�����܂ŃX�N���[�����Ă邩����
  var rul = resUnit.length - 1;
  if (rul == 0) {
    st = 0;
    ed = l - 1;
  } //25����
  else if (resUnit[0] > nowScrollPos) {
    st = 0;
    ed = 24;
  } //0-24
  else if (resUnit[rul] < nowScrollPos) {
    st = l - 26;
    ed = l - 1;
  } // �ŏI25���X
  else {
    for (var i = rul; i--;) {
      if (resUnit[i + 1] > nowScrollPos && resUnit[i] <= nowScrollPos) {
        st = i * 25;
        ed = st + 25;
        break
      }
    }
  }
  // ���݂͈͓̔�����E�B���h�E�̐^�񒆂�����ɕ\�����Ă郌�X���擾
  //�i�����Œ��F����ƁA25���X�P�ʂ̐ؑ֎��ɐ����X�����F����Ȃ��j
  var dtIdx = 0; //if(cp){cp.childNodes[1].value=(st+1)+"-"+(ed+1);cp.style.visibility="visible";}
  for (var i = st; i <= ed; i++) {
    if (!dts[i + 1]) {
      dtIdx = ed;
      break;
    }
    if (dts[i + 1].offsetTop > nowScrollPos && dts[i].offsetTop <= nowScrollPos) {
      dtIdx = i;
      break;
    }
  }
  // dtIdx���炻�̎��ӂ����
  var start = dtIdx - 5;
  var end = dtIdx + 5; //
  for (var i = start; i <= end; i++) {
    if (dts[i]) {
      setSearchColor(dts[i])
    }
  }
}

// IDHash�ArefHash�����ɒ��F
function setSearchColor(dt) {
  if (!dt.innerText || !dt.firstChild.firstChild) {
    return
  } // dt����܂���dt�����X�w�b�_�ł͂Ȃ��Ƃ��̓��^�[��
  // ID
  var span = dt.lastChild;
  var t = getID(span); //alert(t +"&&"+ idHash[t] +"&&"+ span);
  if (browser == "�z�b�g�]�k�Q") {
    span = span.lastChild
  } else if (browser == "A Bone") {
    span = span.childNodes[1]
  }
  if (t && idHash[t] && span) {
    var idResult = idHash[t].split(" ");
    if (t.match(/\?\?\?/)) {
      idResult = "";
      idHash[t] = "";
    }
    if (idResult.length >= threshold3[0]) {
      span.style.color = threshold3[1];
      span.title = "����ID (" + idResult.length + "��)\n" + idHash[t]
    } else if (idResult.length >= threshold2[0]) {
      span.style.color = threshold2[1];
      span.title = "����ID (" + idResult.length + "��)\n" + idHash[t]
    } else if (idResult.length >= threshold1[0]) {
      span.style.color = threshold1[1];
      span.title = "����ID (" + idResult.length + "��)\n" + idHash[t]
    } else if (idResult.length == 1) {
      span.title = "����ID��\n����܂���"
    }
  }
  // ref
  var numA = dt.firstChild.firstChild;
  var num = parseInt(numA.innerText);
  if (refHash[num]) {
    var refResult = refHash[num].split(" ");
    if (refResult.length >= threshold6[0]) {
      numA.style.color = threshold6[1];
      dt.firstChild.title = "����ւ̃��X (" + refResult.length + "��)\n" + refHash[num];
    } else if (refResult.length >= threshold5[0]) {
      numA.style.color = threshold5[1];
      dt.firstChild.title = "����ւ̃��X (" + refResult.length + "��)\n" + refHash[num];
    } else if (refResult.length >= threshold4[0]) {
      numA.style.color = threshold4[1];
      dt.firstChild.title = "����ւ̃��X (" + refResult.length + "��)\n" + refHash[num];
    } else {
      dt.firstChild.title = "����ւ̃��X�͂Ȃ��͗l"
    }
  } else {
    dt.firstChild.title = "����ւ̃��X�͂Ȃ��͗l"
  }
}


//==========���O�EID������
function searchPerson(obj) {
  var by, thisDT, reg;
  if (obj.tagName == "DT") {
    by = "ID";
    thisDT = obj;
    reg = getID(obj);
  } else if (obj.tagName == "SPAN") {
    by = "ID";
    thisDT = obj.parentElement;
    reg = getID(obj);
  } else if (obj.tagName == "U") { //�g���b�v�݂̂Ɍ���
    by = "NAME";
    thisDT = obj.parentElement.parentElement;
    reg = obj.innerHTML.replace(/<B>(.*?)<\/B>/ig, "").replace(/.*��/ig, "��");
    if (!reg) {
      reg = RegExp.$1.replace(/<.*?A.*?>/ig, "");
    }
    /*���O������*/
  } else if (obj.tagName == "B") {
    by = "NAME";
    thisDT = obj.parentElement.parentElement.parentElement;
    reg = obj.innerText
  } else {
    return;
  }
  if (thisDT.parentElement.parentElement.id == "popupBase") return;
  if (!thisDT.rel) {
    var c = selectColor("res");
    if (!c) return;
    var color = new Array(c); // �J���[�I��
    if (by == "ID") {
      if (!reg || !idHash[reg]) {
        return
      } // ID�Ȃ��AID:???�A�{�����̑��X���̃R�s�yID
      // �����n�b�V���ɒl��ݒ肵�āA����Ɋ�Â����X���F
      foundRes[c] = idHash[reg].split(" ");
      foundRes[c].word = "ID:" + reg;
      for (i in foundRes[c]) {
        var dt = getDTfromAnc(foundRes[c][i]);
        toggleResColor(dt, c);
        //�t�Q�Ɠ��̒��F
        for (var key in refResultHash) {
          dt = refResultHash[key].nextSibling.getElementsByTagName("DT");
            for (var j=0; j<dt.length; j++) {
            if (dt[j].firstChild.firstChild.innerHTML == foundRes[c][i]) {
              toggleResColor(dt[j], c);
            }
          }
        }
      }
    } else {
      var us = document.getElementsByTagName("U");
      var l = us.length;
      var regName = new RegExp();
      regName.compile(reg);
      // ���[�v���Ƀ��X���F�E�l�̐ݒ�𓯎����s
      for (var i = l; i--;) {
        var dt = us[i].parentElement.parentElement;
        if (regName.test(us[i].innerText)) {
          toggleResColor(dt, c);
          if (dt.parentElement.className != "refResult") {
            foundRes[c].unshift(dt.firstChild.firstChild.innerText);
          }
        }
      }
      foundRes[c].word = reg;
    }
    returnFound("res", color);
  } else {
    clearColor("res", thisDT.style.backgroundColor);
  }
}

// ID������̒��o
function getID(span) {
  if (regID.test(span.innerText)) {
    return (RegExp.$1)
  } else {
    return (false)
  }
}


//==========�F�ݒ����
// �I�u�W�F�N�g�̏�����
function createHash(name, key, arr, word) {
  name[key] = arr ? arr : new Array();
  name[key].word = word ? word : "";
  name[key].justMovedRes = undefined;
}

// �F�I��(�Y�����X�ԍ��z��������Ȃ��L�[��Ԃ�)
function selectColor(type) {
  if (!foundRes) {
    foundRes = new Array();
    for (var i in foundResColor) {
      createHash(foundRes, foundResColor[i]);
    }
  } // Hash foundRes  ={�F:�Y�����X�ԍ��z��}
  if (!highlight) {
    highlight = new Array();
    for (var i in highlightColor) {
      createHash(highlight, highlightColor[i]);
    }
  } // Hash hightLight={�F:�Y�����X�ԍ��z��}
  var cHash, cArray, cMess;
  if (type == "res") {
    cHash = foundRes;
    cArray = foundResColor;
    cMess = "���܂ł̃��X���F���������܂����H";
  } else {
    cHash = highlight;
    cArray = highlightColor;
    cMess = "���܂ł̃n�C���C�g���������܂����H";
  }
  var i = 0;
  while (cHash[cArray[i]].word) {
    i++;
    if (i == cArray.length) {
      if (confirm(cMess)) {
        clearColor(type);
        i = 0;
        break
      } else {
        i = null;
        break
      }
    }
  }
  return (cArray[i]);
}

// �F�����i�n�b�V���A�ΏہAfoundPanel�j
function clearColor(type, color) {
  var cHash = (type == "res") ? foundRes : highlight;
  if (event && event.altKey) {
    color = ""
  }
  for (var i in cHash) {
    if (type == "res") {
      if (color && i != color) {
        continue
      } // �w��F�łȂ���΃X���[
      for (var j in cHash[i]) {
        if (event.srcElement.value == "DEL") {
          removeRes(getDTfromAnc(cHash[i][j]))
        } else {
          toggleResColor(getDTfromAnc(cHash[i][j]))
          //�t�Q�Ɠ��̒��F
          for (var key in refResultHash) {
            dt = refResultHash[key].nextSibling.getElementsByTagName("DT");
              for (var k=0; k<dt.length; k++) {
              if (dt[k].firstChild.firstChild.innerHTML == cHash[i][j]) {
                toggleResColor(dt[k]);
              }
            }
          }
        }
      }
      cHash[i] = new Array();
      document.getElementById("c" + i).removeNode(true);
    } else {
      var strongs = document.getElementsByTagName("STRONG");
      var reg = new RegExp(i);
      if (!color.match(i)) {
        continue
      } // �w��F�łȂ���΃X���[
      for (var j = 0; j < strongs.length; j++) {
        if (strongs[j].style.backgroundColor == i) {
          if (event.srcElement.value == "DEL") {
            removeRes(strongs[j].parentElement.previousSibling);
            j--
          } else {
            strongs[j].removeNode(false);
            j--
          }
        }
      }
      cHash[i] = new Array();
      if (document.getElementById("c" + i)) {
        document.getElementById("c" + i).removeNode(true);
      } // and,or�����łP�F�ڂ̂�
    }
  }
  if (!fp.hasChildNodes()) {
    fp.style.visibility = "hidden";
    searched = false;
  }
}

// ���X�F�g�O��
function toggleResColor(dt, c) {
  if (!dt) {
    return
  } // for-in�ő�����ԍ��ȊO��obj�Ȃ�I��
  if (c) {
    dt.rev = dt.style.backgroundColor;
    dt.rel = "colored";
    dt.id = "COLOR" + c.replace(/#/, "");
    dt.style.backgroundColor = c;
  } else {
    dt.style.backgroundColor = dt.rev;
    if (dt.id.match(/COLOR/)) {
      dt.removeAttribute("id")
    } //else{alert("dt��COLOR***�ȊO��id�i"+dt.id+"�j���ݒ肳��Ă��܂�")}
    dt.removeAttribute("rev");
    dt.removeAttribute("rel");
  }
}
// �t�Q�Ɠ��g�O��
function toggleResColor_Ref(dt, c) {
  if (!dt) {
    return
  } // for-in�ő�����ԍ��ȊO��obj�Ȃ�I��
    dt.style.backgroundColor = c;
}

// �������ʂɊ�Â�����
function removeRes(dt) {
  if (!dt) {
    return
  } // cHash[i][j]=ID:xxxxxxxx�̂Ƃ�
  if (browser == "Live2ch") {
    location.href = 'func:ABONECLEAR?' + dt.firstChild.innerText;
  } // Live�̂�-�������ځ`��
  dt.nextSibling.removeNode(true);
  dt.removeNode(true);
}


//==========���ʕ\��
// ���X�ԍ����X�g�i�|�b�v�A�b�v�A���J�[���܂ށj
function returnFound(type, color) {
  var cHash = (type == "res") ? foundRes : highlight;
  var nDIV = "";
  var numArray = cHash[color[0]];
  var display = new Array(["none", "POP"], ["inline", "LST"]);
  if (searchView == "resPopup" || numArray.length >= listLimit) {
    display = display.reverse();
  }
  // �|�b�v�A�b�v
  var nTT = "";
  for (var i = 0; i < color.length; i++) {
    nTT += '<tt style="background-color:' + color[i] + '"> ' + cHash[color[i]].word + '</tt>';
  }
  nDIV += '<span rel="' + type + '" style="display:' + display[0][0] + '">' + nTT + '</span>';
  // ���X�g
  var nA = "";
  for (var i = 0; i < numArray.length; i++) {
    nA += addAnchor(numArray[i], numArray[i]) + " "
  }
  nDIV += '<tt style="background-color:' + color[0] + '" style="display:' + display[1][0] + '"> ' + nA + '</tt>';
  // ��
  nDIV += '&nbsp;' + numArray.length + ' ';
  var buttons = '<input type="button" value="' + display[0][1] +
    '" onclick="changeSearchView();blur()"><input type="button" value="��" onclick="moveToSearchRes(\'' + type + '\',\'' +
    color + '\')" title="���֌���"><input type="button" value="��" onclick="moveToSearchRes(\'' + type + '\',\'' + color +
    '\')" title="��֌���"><input type="button" value="CLR" onclick="clearColor(\'' + type + '\',\'' + color +
    '\')" title="Alt������\n���F���X�S��"><input type="button" value="DEL" onclick="clearColor(\'' + type + '\',\'' + color +
    '\')" title="Alt������\n���F���X�S��">';
  fp.innerHTML += '<div id="c' + color[0] + '">' + nDIV + buttons + '</div>';
  fp.style.visibility = "visible";
  searched = true;
}

// �Ώۃ��X�ɃW�����v
function moveToSearchRes(type, color) {
  if (color.match(/(.*?),/)) {
    color = RegExp.$1
  }
  var scope = (event && event.srcElement.value == "��") ? false : true;
  var numArray = (type == "res") ? foundRes[color] : highlight[color];
  if (isNaN(numArray.justMovedRes)) {
    numArray.justMovedRes = 0
  } else {
    markedDT.style.borderColor = "#999";
    if (scope) {
      numArray.justMovedRes++;
      if (numArray.justMovedRes >= numArray.length) {
        numArray.justMovedRes--;
        alert("�����艺�ɂ͂���܂���")
      }
    } else {
      numArray.justMovedRes--;
      if (numArray.justMovedRes < 0) {
        numArray.justMovedRes++;
        alert("�������ɂ͂���܂���")
      }
    }
  }
  markedDT = getDTfromAnc(numArray[numArray.justMovedRes]);
  markedDT.style.borderColor = "red";
  markedDT.scrollIntoView(true);
  setTimeout('markedDT.style.borderColor="#999"', 5000);
}

// �|�b�v�A�b�v�ƃ��X�g�\���؂�ւ�
function changeSearchView() {
  var e = event.srcElement;
  if (e.value == "POP") {
    e.value = "LST";
    e.parentElement.childNodes[0].style.display = "inline";
    e.parentElement.childNodes[1].style.display = "none";
  } else {
    e.value = "POP";
    e.parentElement.childNodes[0].style.display = "none";
    e.parentElement.childNodes[1].style.display = "inline";
  }
}


//==========�S�X���^�C����
function allBoardSearch (arg) {
  //window.open("http://find.2ch.net/?TYPE=TITLE&BBS=ALL&ENCODING=SJIS&COUNT=50&STR="+arg,"_parent");
  var allBoardSearchWindow = showModelessDialog("",window, 'dialogWidth:480px;dialogHeight:10px;dialogTop:10px;dialogLeft:10px;');
  var nWin =
  '<html>'+
    '<head>'+
      '<script type="text/javascript">' +
        'function submitEvent() {' +
          'var fo = document.forms[0];' +
          'window.open("http://find.2ch.net/?TYPE=TITLE&BBS=ALL&ENCODING=SJIS&COUNT=50&STR="+fo.STR.value,"_blank")'+
        '}' +
      '</script>' +
      '<style>'+
        '* {background-color:whitesmoke;}'+
        'h1 {font-size:small;margin:1ex;}'+
        'form {margin:1ex 1ex 0 2ex;}'+
      '</style>'+
      '<title>�S�X���^�C����</title>'+
    '</head>'+
    '<body>'+
      '<h1>Find.2ch</h1>'+
      '<form onsubmit="submitEvent();return false;">'+
        '<input name="STR" type="text" size="60" value="'+arg+'">' +
        '<input type="submit" value="����" onsubmit="submitEvent();return false;">'+
      '</form>' +
    '</body>'+
  '</html>';
  allBoardSearchWindow.document.write(nWin);
  allBoardSearchWindow.document.forms[0].elements[0].select();
  //"http://find.2ch.net/?TYPE=TITLE&BBS=ALL&ENCODING=SJIS&COUNT=50&STR="+arg
}

//==========�P�ꌟ��
function findIt(arg) {
  createSearchPanel(arg);
}

// �����E�B���h�E�̕\��
function createSearchPanel(arg) {
  // ��p�u���E�U�ł�modelessDialog�ւ̊O���ǂݍ��݂ł́AdialogArguments������Ȃ��̂Œ��ڏ����o��
  if (arg) {
    word = arg
  }
  if (searchWindow && !searchWindow.closed) {
    return
  }
  var skinPath = document.getElementsByName("SkinPath")[0].content;
  searchWindow = showModelessDialog("", window,
    'dialogWidth:500px;dialogHeight:200px;dialogTop:0px;dialogLeft:0px;help:no;resizable:yes;status:no;unadorned:yes;');
  var nWin =
    '<html>' +
      '<head>' +
        '<title>�P��̌���<\/title>' +
        '<script type="text/javascript">' +
          'function submitEvent() {' +
            'var fo = document.forms[0];' +
            'dialogArguments.word = fo.word.value;' +
            'var i = -1;' +
            'do {' +
              'i++;' +
              'dialogArguments.expression = fo.expression[i].value;' +
            '} while (!fo.expression[i].checked);' +
            'var i = 0;' +
            'while (fo.searchTarget[i]) {' +
              'dialogArguments.searchTarget[fo.searchTarget[i].value] = fo.searchTarget[i].checked;' +
              'i++;' +
            '}' +
            'var i = -1;' +
            'do {' +
              'i++;' +
              'dialogArguments.searchView = fo.searchView[i].value;' +
            '} while (!fo.searchView[i].checked);' +
            'dialogArguments.searchWord();' +
          '}' +
        '</script>' +
        '<style type="text/css">' +
          'body {' +
            'background:ThreeDFace;' +
            'padding:0.5em;' +
            'overflow:auto' +
          '}' +
          'fieldset {' +
            'padding:0.5em;' +
            'margin-top:0.5em;' +
          '}' +
          'legend, label, input {' +
            'font:message-box;' +
          '}' +
        '</style>' +
      '<\/head>' +
      '<body onunload="unloadEvent()">' +
        '<form onsubmit="submitEvent();return false;">' +
          '<table width="100%">' +
            '<tr>' +
              '<td valign="top" colspan="3">' +
                '<label for="word">����������F</label><br/>' +
                '<input type="text" name="word" id="word" size="30" value="' + word + '" tabindex="0">' +
                '<br>' +
              '</td>' +
              '<td align="right" valign="top" rowspan="2">' +
                '<input type="submit" name="submit" value="�@���@���@" tabindex="7">' +
                '<br>' +
                '<br>' +
                '<input type="button" name="cancel" value="�L�����Z��" onclick="window.close()" tabindex="8">' +
              '</td>' +
            '</tr>' +
            '<tr valign="top">' +
              '<td>' +
                '<fieldset>' +
                  '<legend>�������@</legend>' +
                  '<input type="radio" name="expression" value="default" id="tDef" tabindex="1">' +
                  '<label for="tDef">�ʏ팟��</label>' +
                  '<br>' +
                  '<input type="radio" name="expression" value="regExp" id="tReg">' +
                  '<label for="tReg">���K�\��</label>' +
                  '<br>' +
                  '<input type="radio" name="expression" value="multiAND" id="tAND">' +
                  '<label for="tAND">AND����</label>' +
                  '<br>' +
                  '<input type="radio" name="expression" value="multiOR" id="tOR">' +
                  '<label for="tOR">OR����</label>' +
                '</fieldset>' +
              '</td>' +
              '<td>' +
                '<fieldset>' +
                  '<legend>�����Ώ�</legend>' +
                  '<input type="checkbox" name="searchTarget" value="name" id="tName" tabindex="2" checked>' +
                  '<label for="tName">���O</label>' +
                  '<br>' +
                  '<input type="checkbox" name="searchTarget" value="mail" id="tMail" tabindex="3" checked>' +
                  '<label for="tMail">���[��</label>' +
                  '<br>' +
                  '<input type="checkbox" name="searchTarget" value="id" id="tID" tabindex="4" checked>' +
                  '<label for="tID">���t��ID</label>' +
                  '<br>' +
                  '<input type="checkbox" name="searchTarget" value="mess" id="tMess" tabindex="5" checked>' +
                  '<label for="tMess">�{��</label>' +
                '</fieldset>' +
              '</td>' +
              '<td>' +
                '<fieldset>' +
                  '<legend>���ʕ\��</legend>' +
                  '<input type="radio" name="searchView" value="resList" id="rList" tabindex="6">' +
                  '<label for="rList">���X�ԍ���\��</label>' +
                  '<br>' +
                  '<input type="radio" name="searchView" value="resPopup" id="rPop">' +
                  '<label for="rPop">���X���|�b�v�A�b�v</label>' +
                  '<br>' +
                  '<input type="radio" name="searchView" value="resJump" id="rJump">' +
                  '<label for="rJump">���X�փW�����v</label>' +
                '</fieldset>' +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</form>' +
      '<\/body>' +
    '<\/html>';
  searchWindow.document.write(nWin);
  sdf = searchWindow.document.forms[0];
  sdf.elements[0].select();
  var ex = sdf.expression;
  for (var i = 0; i < ex.length; i++) {
    if (ex[i].value == expression) {
      ex[i].checked = true
    }
  }
  var sv = sdf.searchView;
  for (var i = 0; i < sv.length; i++) {
    if (sv[i].value == searchView) {
      sv[i].checked = true
    }
  }
  range = document.body.createTextRange();
}

// �����������C��
function searchWord() {
  word = word.replace(/^\s*|\s*$/g, "");
  if (!word) {
    return
  }
  var matchs = new Array();
  var color = new Array();
  // �������@
  // AND/OR�ň�P��Ȃ�default�Ō���
  if (expression == "regExp" || expression == "default" || (expression.match(/multi/) && !word.match(/\s/))) {
    // ������w��i�d���r���ō������H�j
    if (expression == "regExp") {
      var regWord = word.replace(/[\^\$]/g, "");
      var reg = new RegExp(regWord, "g");
      var tmpArr = range.text.match(reg);
      var tmp;
      if (!tmpArr || !tmpArr.length) {
        tmpArr = new Array(tmpArr)
      } // ��������0or1�Ȃ�A�z��쐬
      tmpArr.sort();
      for (var i = 0; i < tmpArr.length; i++) {
        if (tmp != tmpArr[i]) {
          matchs.push(tmpArr[i])
        }
        tmp = tmpArr[i]
      }
      if (!matchs || !matchs.length) {
        matchs[0] = word
      } // ��������0or1�Ȃ�A�z��쐬
    } else {
      matchs[0] = word
    }
    // �n�C���C�g
    for (var i = 0; i < matchs.length; i++) {
      color.push(setHighlight(matchs[i]));
    }
    highlight[color[0]].word = word;
  } else {
    // ������w��
    var matchs = word.split(" ");
    var tmpArr = new Array();
    var tmp;
    // �n�C���C�g���d������
    for (var i = 0; i < matchs.length; i++) {
      color.unshift(setHighlight(matchs[i]));
      highlight[color[0]].word = matchs[i];
      tmpArr = tmpArr.concat(highlight[color[0]])
    }
    color.reverse();
    tmpArr.sort();
    createHash(highlight, color[0], "", matchs[0]); // ��U������
    var judge = (expression == "multiAND") ? "tmp==tmpArr[i]" : "tmp!=tmpArr[i]";
    for (var i = 0; i < tmpArr.length; i++) {
      if (eval(judge)) {
        highlight[color[0]].push(tmpArr[i])
      }
      tmp = tmpArr[i]
    } // �������ʂ�highlight[color[0]]�ɓ����
  }
  // ���ʕ\��
  if (searchView == "resList") {
    returnFound("search", color);
    searchWindow.close();
  } else if (searchView == "resPopup") {
    returnFound("search", color);
    searchWindow.close();
  } else if (searchView == "resJump") {
    returnFound("search", color);
    searchWindow.close();
    if (highlight[color[0]].length) {
      moveToSearchRes("search", color.join(","))
    }
  }
}

// �n�C���C�g����
function setHighlight(reg) {
  // �J���[�I��
  var c = selectColor("highlight");
  if (!c) {
    return
  }
  // ����
  while (range.findText(reg)) {
    var dt = range.parentElement();
    var tag = dt.tagName;
    var thisRange;
    // �����Ώۂōi�荞��
    if (tag == "B" || tag == "U") {
      thisRange = "name"
    } else if (tag == "DT") {
      thisRange = "mail"
    } else if (tag == "SPAN" && dt.className == "r") {
      thisRange = "id"
    } else if (tag == "DD" || tag == "A" && dt.parentElement.tagName == "DD") {
      thisRange = "mess"
    } else if (tag == "STRONG") {
      thisRange = "word"
    } else { /*alert("tag�F"+tag+"\ndt:"+dt.outerHTML);*/
      range.collapse(false);
      continue;
    } // ���X�ԍ�(A)�⌟�����ʎ���(TT)
    if (!searchTarget[thisRange]) {
      range.collapse(false);
      continue;
    }
    // ���K�\���̈ʒu�w��q������ꍇ�A��ܗv�f�����ōČ���
    if (expression == "regExp" && word.match(/[\^|\$]/)) {
      var thisReg = new RegExp(word);
      var targetText = (tag == "STRONG") ? dt.parentElement.innerText : dt.innerText;
      if (!targetText.match(thisReg)) {
        range.collapse(false);
        continue
      }
    }
    // dt�擾�����X�ԍ��擾���n�C���C�g
    if (dt.tagName != "DT") {
      while (dt.tagName != "DT" && dt.tagName != "DD") {
        dt = dt.parentElement
      }
      if (dt.tagName == "DD") {
        dt = dt.previousSibling
      }
    }
    var num = dt.firstChild.firstChild.innerText;
    if (dt.parentElement.className != "refResult" && num != highlight[c][highlight[c].length - 1]) {
      highlight[c].push(num)
    } // �t�Q�Ɠ���DT,����ԍ��Ȃ���
    range.pasteHTML('<strong style="background-color:' + c + '">' + range.text + '</strong>');
    range.collapse(false);
  }
  range = document.body.createTextRange(); // �����W�����ɖ߂��Ă���
  return (c);
}

var refResultHash={}, rrhnum=0;
//==========�t�Q��
function searchRef(obj) {
  if (!obj.name || obj.name.search(/referred/)<0) {
    var num = obj.firstChild.firstChild.innerText;
    if (refHash[num]) {
      var refArr = refHash[num].split(/\s/);
      var refs = "";
      for (var i = 0; i < refArr.length; i++) {
        refs += returnString(refArr[i]);
      }
      obj.nextSibling.insertAdjacentHTML("beforeEnd", '<dl class="refResult">' + refs + '</dl>')
      obj.name = "referred";
      if (obj.parentNode.id && obj.parentNode.id=="dl") {
        refResultHash[num] = obj;
      }
    }
  } else {
    obj.nextSibling.lastChild.removeNode(true);
    obj.name = '';
    if (obj.parentNode.id && obj.parentNode.id=="dl") {
      delete refResultHash[num];
    }
  }
}

            
//==========�A���J�[����DT�����
function getDTfromAnc(num) {//alert(num);alert(ancs(num));alert(ancs.length);alert(document.links.length);
  var anc = ancs(anchorHead + num);
  if (!anc||!anc.parentElement) return (""); //LABELNUMBER�Ή��̂��ځ`��Ⴕ���͖��o�ԍ��Ȃ�I��
  var obj = anc.parentElement.parentElement; //LABELNUMBER�Ή��̂���
  if (!obj || !obj.tagName) return false;
  if (obj.tagName != "DT") { //LABELNUMBER��Ή��̂���
    if (num == 1) {
      if (anc) obj = anc.nextSibling;
      else return ("");
    } else {
      if (!anc.nextSibling) obj = anc.parentElement.nextSibling;
      else return ("");
    }
  }
  return (obj);
}

// �摜�֘A
function getIMG(obj) {
  if (regIMG.test(obj.innerText)) {
    var filename = RegExp.$1;
    var tmp = filename.match(/(\d\d\d\d)(\d\d\d\d)(\d\d)/);
    var today = new Date();
    var last = new Date(today - 7 * 24 * 60 * 60 * 1000);
    var date = "";
    date += last.getMonth() < 9 ? "0" + (last.getMonth() + 1) : last.getMonth() + 1;
    date += last.getDate() < 10 ? "0" + last.getDate() : last.getDate();
    var log = (RegExp.$1 + "" + RegExp.$2 < last.getYear() + "" + date) ? "_kako/" : "_img/";
    var fileurl = "http://up01.2ch.io/" + log + RegExp.$1 + "/" + RegExp.$1 + RegExp.$2 + "/" + RegExp.$3 + "/" +
      filename;
    return (fileurl)
  } else {
    return (false)
  }
}