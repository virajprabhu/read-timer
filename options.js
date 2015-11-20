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

// Bind submit button to function.
document.getElementById("input-speed").onsubmit = saveOptions;

  $(function() {


    // generate data set from a parametric function with a fractal look

    function sumf(f, t, m) {
        var res = 0;
        for (var i = 1; i < m; ++i) {
            res += f(i * i * t) / (i * i);
        }
        return res;
    }

    var d1 = [];
    for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
        d1.push([sumf(Math.cos, t, 10), sumf(Math.sin, t, 10)]);
    }



    d1 = [[1196463600000, 0], [1196550000000, 0], [1196636400000, 0], [1196722800000, 77], [1196809200000, 3636], [1196895600000, 3575], [1196982000000, 2736], [1197068400000, 1086], [1197154800000, 676], [1197241200000, 1205], [1197327600000, 906], [1197414000000, 710], [1197500400000, 639], [1197586800000, 540], [1197673200000, 435], [1197759600000, 301], [1197846000000, 575], [1197932400000, 481], [1198018800000, 591], [1198105200000, 608], [1198191600000, 459], [1198278000000, 234], [1198364400000, 1352], [1198450800000, 686], [1198537200000, 279], [1198623600000, 449], [1198710000000, 468], [1198796400000, 392], [1198882800000, 282], [1198969200000, 208], [1199055600000, 229], [1199142000000, 177], [1199228400000, 374], [1199314800000, 436], [1199401200000, 404], [1199487600000, 253], [1199574000000, 218], [1199660400000, 476], [1199746800000, 462], [1199833200000, 448], [1199919600000, 442], [1200006000000, 403], [1200092400000, 204], [1200178800000, 194], [1200265200000, 327], [1200351600000, 374], [1200438000000, 507], [1200524400000, 546], [1200610800000, 482], [1200697200000, 283], [1200783600000, 221], [1200870000000, 483], [1200956400000, 523], [1201042800000, 528], [1201129200000, 483], [1201215600000, 452], [1201302000000, 270], [1201388400000, 222], [1201474800000, 439], [1201561200000, 559], [1201647600000, 521], [1201734000000, 477], [1201820400000, 442], [1201906800000, 252], [1201993200000, 236], [1202079600000, 525], [1202166000000, 477], [1202252400000, 386], [1202338800000, 409], [1202425200000, 408], [1202511600000, 237], [1202598000000, 193], [1202684400000, 357], [1202770800000, 414], [1202857200000, 393], [1202943600000, 353], [1203030000000, 364], [1203116400000, 215], [1203202800000, 214], [1203289200000, 356], [1203375600000, 399], [1203462000000, 334], [1203548400000, 348], [1203634800000, 243], [1203721200000, 126], [1203807600000, 157], [1203894000000, 288]];

    var data = [ d1 ],
        placeholder = $("#placeholder");

    $("<div id='flot_tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #fdd",
        padding: "2px",
        "background-color": "#fee",
        opacity: 0.80
    }).appendTo("body");

    var plot = $.plot(placeholder, data, {
        grid: {
            hoverable: true,
            clickable: true
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            },
            shadowSize: 0
        },
        xaxis: {
            mode: "time",
            tickLength: 5,
            zoomRange: [100000, 1203894000000-1196463600000],
            panRange: [-1196463600000, 1203894000000*2]
        },
        selection: {
            mode: "x"
        },
        yaxis: {
            zoomRange: false,
            panRange: [-1000,4000]
        },
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true
        }

    });

    placeholder.bind("plothover", function (event, pos, item) {
        if (item) {
                var x = (new Date(item.datapoint[0].toFixed(2)/1000)).toLocaleDateString(),
                    y = item.datapoint[1].toFixed(2);

                $("#flot_tooltip").html("Read Speed on " + x + " is " + y)
                    .css({top: item.pageY+5, left: item.pageX+5})
                    .fadeIn(200);
            } else {
                $("#flot_tooltip").hide();
        }
    });

    // add zoom out button

    $("<div class='button' style='right:20px;top:20px'>zoom out</div>")
        .appendTo(placeholder)
        .click(function (event) {
            event.preventDefault();
            plot.zoomOut();
        });

    // and add panning buttons

    // little helper for taking the repetitive work out of placing
    // panning arrows

    function addArrow(dir, right, top, offset) {
        $("<img class='button' src='arrow-" + dir + ".gif' style='right:" + right + "px;top:" + top + "px'>")
            .appendTo(placeholder)
            .click(function (e) {
                e.preventDefault();
                plot.pan(offset);
            });
    }

    addArrow("left", 55, 60, { left: -100 });
    addArrow("right", 25, 60, { left: 100 });
    addArrow("up", 40, 45, { top: -100 });
    addArrow("down", 40, 75, { top: 100 });
})  
