function getPageWordCount() {
	alert('Running!');
	var text = document.getElementByTagName('body').innerHTML;
	alert('Running1!');

	var words = text.replace(/([ .,;]+)/g,'$1§sep§').split('§sep§');
	var count = words.length;
	// console.log(count);
	return count;	
}

function computeReadingTime(){

	count = getPageWordCount();
	alert('Count' + count);
	averageReadSpeedWPM = 200;
	readTime = count / averageReadSpeedWPM;
	return readTime;
}

time = computeReadingTime();

// chrome.browserAction.onClicked.addListener(function(tab) {
// 	chrome.tabs.executeScript({
// 		code: "$('#status').html("+time+");"
// 	});
// });