/**
 * Options file to save read speed to chrome.storage.
*/
var debug = false;

/**
 * Sets the value of the input box to the chosen value or a default of 200.
 *
*/
chrome.storage.sync.get("readTimeDefaultSpeed", function(result) {
  if(!result || !result.readTimeDefaultSpeed) {
    document.getElementById("input-box").value = 200;
  }
  else {
    document.getElementById("input-box").value = result.readTimeDefaultSpeed;
  }
});


/**
 * Saves the chose speed to chrome.storage.
 *
*/
function saveOptions() {
  var speed = parseInt(document.getElementById('input-box').value);
  chrome.storage.sync.set({"readTimeDefaultSpeed": speed}, function() {
    if(debug) {
      alert('Options saved');
    }
  });
  window.close();
}

// Bind submit button to function.
document.getElementById("input-speed").onsubmit = saveOptions;