chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var sel = window.getSelection();
    sendResponse(sel ? sel.toString() : '');
});

window.addEventListener('keydown', shortcutCopy, true);

var keymap = null;

function shortcutCopy(event) {
  var fn = getFormatNum(event);
  if (fn === null) return;
  // console.log(fn);
  
  var url = document.location.href;
  var title = document.title;
  var sel = window.getSelection();
  var txt = (sel ? sel.toString() : '');
  chrome.extension.sendRequest({command: "formatClipboard", formatNum: fn, url: url, title: title, text: txt });
}

function getFormatNum(event) {
  if (keymap == null) {
    chrome.extension.sendRequest({command: "getKeymap"}, function(response) { keymap = response; getFormatNum(event) });
    return null;
  }
  var k = keymap[event.keyCode];
  if (!k) return null;
  k = k[event.ctrlKey ? 1 : 0];
  if (!k) return null;
  k = k[event.metaKey ? 1 : 0];
  if (!k) return null;
  k = k[event.altKey ? 1 : 0];
  if (!k) return null;
  k = k[event.shiftKey ? 1 : 0]
  if (!k) return null;
  k = k[isSelected() ? 1 : 0];
  return (k == null) ? null : k;
}

function isSelected() {
    var sel = window.getSelection();
    if (sel.rangeCount <= 0) return false;
    if (sel.rangeCount > 1)  return true;

    var range = sel.getRangeAt(0);
    if (! range.collapsed) return true;
    if (range.startContainer != range.endContainer) return true;
    if (range.startOffset    != range.endOffset)    return true;
    if (document.activeElement.tagName.toLowerCase() != "body") return true;

    return false;
}
