var count = -1;
var startTime = new Date();
var timeTaken = 0;


function totalTime(wc){
	var count = wc;
	var wordLength = wc;	
	var averageReadSpeedWPM = 200;
	var readTime = wordLength / averageReadSpeedWPM;
	document.getElementById('status').innerHTML= Math.ceil(readTime) + "m read";	
}
function getSpeedCookie(){
	/*chrome.cookies.get({url:document.location,name:"read_timer_timetaken"},function(cookie){
		if(cookie!=null)
			alert("Got Cookie "+cookie.name+" "+cookie.value);
	});	*/
}

getSpeedCookie();

function stopTimer(){
	var endTime = new Date();
	timeTaken += endTime - startTime;
    // alert(timeTaken);
	chrome.cookies.set({url:document.location,name:"read_timer_timetaken",value:timeTaken,expirationDate:2147483647});
	// alert("hey");
}
setTimeout(stopTimer,2000);

chrome.tabs.onRemoved.addListener(function(tabId,removeInfo) {
	stopTimer();
});
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
	if(changeInfo.url){
		stopTimer();
	}
});
chrome.extension.onRequest.addListener(function(request) {
	if(request.remainingTime!=undefined){
		document.getElementById('remaining').innerHTML=request.remainingTime + " left";
	}
});

window.onload = function() {
	chrome.tabs.executeScript(null, { file: "readability/Readability.js" }, function() {
		chrome.tabs.executeScript(null, { file: 'sendArticleLength.js', allFrames: true}, function(result) {
			count = result;
			totalTime(count);					
			// chrome.tabs.executeScript({file: 'test.js', allFrames: true});		
		});
	});
}