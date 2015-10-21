// Saves options to chrome.storage
var debug = false;

chrome.storage.sync.get("readTimeDefaultSpeed", function(result) {
  if(!result || !result.readTimeDefaultSpeed) {
    document.getElementById("input-box").value = 200;
  }
  else {
    document.getElementById("input-box").value = result.readTimeDefaultSpeed;
  }
});

function saveOptions() {
  var speed = parseInt(document.getElementById('input-box').value);
  chrome.storage.sync.set({"readTimeDefaultSpeed": speed}, function() {
    if(debug) {
      alert('Options saved');
    }
  });
}

document.getElementById("input-speed").onsubmit = saveOptions;
