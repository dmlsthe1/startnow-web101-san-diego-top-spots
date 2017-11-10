
var map, infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.715057,lng: -117.164200},
        zoom: 12,
    });
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("You are here");
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handelLocationError(true, infoWindow, map.getCenter());
        });
    }   else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

} // end of initMap()

function handelLocationError(browseHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation.");
        infoWindow.open(map);
}

function addMarkerWithTimeout(position, label, name, timeout) {
    window.setTimeout(function() {
        var marker = new google.maps.Marker({
        position: position,
        map: map,
        label: label,
        animation: google.maps.Animation.DROP,
        infoWindow: {
            content: name
        },
        mouseover: function() {
            infoWindow.open(map, this)
        },
        mouseout: function() {
            infoWindow.close();
        }
        });
        $(marker).click(function() {
            map.panTo(position)
        });
    }, timeout);
}

$(document).ready(function() { 
    $.getJSON("../data.json", function(data) {
        //for (var i = 0; i < data.length; i++) {
        $.each(data, function(i, data) {
            var $num = $("<td></td>").addClass("text-center").text(i + 1);
            var $name = $("<td></td>").addClass("text-center").text(data.name);
            var $description = $("<td></td>").text(data.description);
            var $button = $("<button></button>").text("Open in Google Maps").addClass("btn btn-primary")
            .attr({"type": "button",
                    "data-index": i,
                    "data-name": data.name,
                    "data-description": data.description,
                    "data-location": data.location
            })
            .click(function() {
                map.panTo({ lat: data.location[0], lng: data.location[1] });
                //infoWindow.setContent("<div>" + data.description + "</div>");
                infoWindow.open(map, this);
            });
            var $location = $("<td></td>").append($($button)); 
            var $table = $("<tr></tr>").append([
                //$num,
                $name,
                $description,
                $location
            ]);

            $("table").append(
                $table
            );

            

        }) // end of for data.length

        $.each($(".btn"), function(i, data) {
            //console.log(data);
            var $location = $(this).attr("data-location");
            var $name = $(this).attr("data-name");
            var $description = $(this).attr("data-description");
            var $label = $(this).attr("data-index") + 1;
            addMarkerWithTimeout({lat: parseInt($location[0]), lng: parseInt($location[1])}, $label, $description, i * 50);
            
        })

    }) // end of getJSON
}); // end of $ready
