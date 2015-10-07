
alert('Running!');

var domContent = document.getElementsByTagName("body")[0].outerHTML;
var words = domContent.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
var count = words.length;
console.log(count);

chrome.extension.sendRequest(count);