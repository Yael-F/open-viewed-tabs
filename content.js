var title;
var boldTitle;
var boldFlag = 0;
var changedFlag = 3;
var observer;

function boldString(str){
  boldStr = "";
  var len = str.length;
  for(var i = 0 ; i<len ; i++){
    var char = str[i];
    if (/[A-Z]/.test (char))
      boldChar = String.fromCodePoint (char.codePointAt (0) + 120211);
    else{
      if (/[a-z]/.test (char))
        boldChar = String.fromCodePoint (char.codePointAt (0) + 120205);
      else {
        if (/[0-9]/.test (char))
          boldChar = String.fromCodePoint (char.codePointAt (0) + 120764);
        else {
          boldChar = char;
        }
      }
    }
    boldStr += boldChar;
  }
  return boldStr;
}

function transToBold() {
  title = document.title;
  boldTitle = boldString(title);
  document.title = boldTitle;
  if(boldFlag)
    return;
  setObserverToTitle();
  boldFlag = 1;
}

function unBold() {
if(title != ""){
  document.title = title;
  boldFlag = 0;

}
}

function onchangeVisibility() {
  if (document.visibilityState == "visible" && boldFlag){
    unBold();
    }
}

function setObserverToTitle(){
  var target = document.querySelector('head > title');
  observer = new window.WebKitMutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (boldFlag){
          if(mutation.target.textContent == boldTitle)
            return;
          if(mutation.target.textContent != title){
            transToBold(mutation.target.textContent);
            observer.disconnect();
            }
          else{
            mutation.target.textContent = boldTitle;
          }
        }
      });
  });
  observer.observe(target, { subtree: true, characterData: true, childList: true });
}

function checkSiteVisibility() {
  if (document.visibilityState == "hidden")
    transToBold();
}

function waitForTitle(){
  var interval = setInterval(function(){
      if(document.getElementsByTagName("title")[0]){
          clearInterval(interval);
          checkSiteVisibility();
      }}, 100);
}

waitForTitle();
document.addEventListener("visibilitychange", onchangeVisibility);
