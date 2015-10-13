
 // alert("Send article length "+count)
// document.getElementsByTagName("body")[0].innerHTML = "SDFSDF";
function showTimeLeft(){
	var scrollPos = window.pageYOffset | document.body.scrollTop
	var body = document.body, html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	console.log("Remaining Time: " + Math.ceil((1-scrollPos/height)*count/200 ))
    // alert("Remaining Time: " + Math.ceil((1-scrollPos/height)*count/200 ));
	chrome.extension.sendRequest({remainingTime:Math.ceil((1-scrollPos/height)*count/200)});
}
// var location = document.location;

window.onscroll = function(){
	showTimeLeft()	
};


showTimeLeft()


