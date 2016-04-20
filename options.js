/**
 * Options file to save read speed to chrome.storage.
*/
var debug = false;

/**
 * Sets the value of the input box to the chosen value or a default of 200.
 *
*/
chrome.storage.sync.get("readTimeDefaultSpeed", function(result) {
  if (!result || !result.readTimeDefaultSpeed) {
    document.getElementById("input-box").value = 200;
  } else {
    document.getElementById("input-box").value = result.readTimeDefaultSpeed;
  }
});

/**
 * Add a link back to the popup page, and bind submit button to function.
 */
window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("backLink").href = chrome.extension.getURL("popup.html");
    document.getElementById("input-speed").onsubmit = saveOptions;

});


/**
 * Saves the chose speed to chrome.storage.
 *
*/
function saveOptions() {
  var speed = parseInt(document.getElementById('input-box').value);
  chrome.storage.sync.set({"readTimeDefaultSpeed": speed}, function() {
    if (debug) {
      alert('Options saved');
    }
  });
  window.close();
}

/** 
 * Anonymous function for creating graph visualization of read speed
 */
// $(function() {

// // generate data set from a parametric function with a fractal look

//     function sumf(f, t, m) {
//         var res = 0;
//         for (var i = 1; i < m; ++i) {
//             res += f(i * i * t) / (i * i);
//         }
//         return res;
//     }

//     var d1 = [];
//     for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
//         d1.push([sumf(Math.cos, t, 10), sumf(Math.sin, t, 10)]);
//     }


//     chrome.storage.sync.get("readTimeDefaultSpeed", function(result) {
//         if (!result || !result.readTimeDefaultSpeed) {
//             document.getElementById("input-box").value = 200;
//         } else {
//             document.getElementById("input-box").value = result.readTimeDefaultSpeed;
//         }
//     });

//     chrome.storage.sync.get("readTimerWPM", function(result) {
//         if (!result || (result.length <= 0)) {
//             console.log("Error. Displaying dummy values.");
//         } else {
//             d1 = result.readTimerWPM;
//         }
//         var data = [ d1 ],
//         placeholder = $("#placeholder");

//         var timeArr = [], speedArr = [];
//         for (var i = 0; i<d1.length; i++) {
//             timeArr.push(d1[i][0]);
//             speedArr.push(d1[i][1]);
//         }
//         minTime  = Math.min.apply(Math, timeArr);
//         maxTime  = Math.max.apply(Math, timeArr);
//         minSpeed = Math.min.apply(Math, speedArr);
//         maxSpeed = Math.max.apply(Math, speedArr);
//         if (debug) {
//             console.log(minTime + " " + maxTime + " " + minSpeed + " " + maxSpeed);
//         }

//         $("<div id='flot_tooltip'></div>").css({
//             position: "absolute",
//             display: "none",
//             border: "1px solid #fdd",
//             padding: "2px",
//             "background-color": "#fee",
//             opacity: 0.80
//         }).appendTo("body");

//         var plot = $.plot(placeholder, data, {
//             grid: {
//                 hoverable: true,
//                 clickable: true
//             },
//             series: {
//                 lines: {
//                     show: true
//                 },
//                 points: {
//                     show: true
//                 },
//                 shadowSize: 0
//             },
//             xaxis: {
//                 mode: "time",
//                 tickLength: 5,
//                 zoomRange: [100000, maxTime-minTime],
//                 panRange: [0, maxTime * 2]
//             },
//             selection: {
//                 mode: "x"
//             },
//             yaxis: {
//                 zoomRange: false,
//                 panRange: [0, maxSpeed]
//             },
//             zoom: {
//                 interactive: true
//             },
//             pan: {
//                 interactive: true
//             }

//         });

//         placeholder.bind("plothover", function (event, pos, item) {
//             if (item) {
//                 var x = (new Date(item.datapoint[0].toFixed(2)/1000)).toLocaleDateString(),
//                     y = item.datapoint[1].toFixed(2);

//                 $("#flot_tooltip").html("Read Speed on " + x + " is " + y)
//                     .css({top: item.pageY+5, left: item.pageX+5})
//                     .fadeIn(200);
//             } else {
//                 $("#flot_tooltip").hide();
//             }
//         });

//         // add zoom out button

//         $("<div class='button' style='right:20px;top:20px'>zoom out</div>")
//             .appendTo(placeholder)
//             .click(function (event) {
//                 event.preventDefault();
//                 plot.zoomOut();
//             });

//         // and add panning buttons

//         // little helper for taking the repetitive work out of placing
//         // panning arrows

//         function addArrow(dir, right, top, offset) {
//             $("<img class='button' src='resources/arrow-" + dir + ".gif' style='right:" + right + "px;top:" + top + "px'>")
//                 .appendTo(placeholder)
//                 .click(function (e) {
//                     e.preventDefault();
//                     plot.pan(offset);
//             });
//         }

//         addArrow("left", 55, 60, { left: -100 });
//         addArrow("right", 25, 60, { left: 100 });
//         addArrow("up", 40, 45, { top: -100 });
//         addArrow("down", 40, 75, { top: 100 });

//     });
// });

$(document).ready(function(){
    $('.wrapper').find('a[href="#"]').on('click', function (e) {
        e.preventDefault();
        this.expand = !this.expand;
        $('.wrapper a').html(this.expand ? "<img src='resources/collapse.svg'></a>"
                            : "<img src='resources/expand.svg'>");
        $(this).closest('.wrapper').find('.small, .big').toggleClass('small big');
    });
});








