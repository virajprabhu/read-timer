var count = -1;
function totalTime(wc){
	// alert("Total time "+count)
	var count = wc;
	var wordLength = wc;	
	var averageReadSpeedWPM = 200;
	var readTime = wordLength / averageReadSpeedWPM;
	document.getElementById('status').innerHTML= Math.ceil(readTime) + " min read. ";	
	// setTimeout(function(){
	// },1000);
}
chrome.extension.onRequest.addListener(function(request) {
	if(request.remainingTime!=undefined){
		document.getElementById('remaining').innerHTML=request.remainingTime + " left";
	}
});
window.onload = function() {
	// chrome.windows.getCurrent(function (currentWindow) {
		chrome.tabs.query({ active: true, currentWindow: true}, function(activeTabs){
			chrome.tabs.executeScript(activeTabs[0].id, { file: "readability/Readability.js" }, function() {
				chrome.tabs.executeScript(activeTabs[0].id, {file: 'sendArticleLength.js', allFrames: true}, function(result) {
					count = result;
					totalTime(count);					
					// chrome.windows.getCurrent(function (currentWindow1) {
						// chrome.tabs.query({ active: true, currentWindow: true}, function(activeTabs1){			
							chrome.tabs.executeScript({file: 'test.js', allFrames: true});		
						// });
					// });
				});
			});
		});
	// });
}