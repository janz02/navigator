var hFoV = 90;
var vFoV = 40;
var pos = {};

function manual() {
    deviceOrientationHandler(
        document.getElementById("gammaManual").value,
        document.getElementById("betaManual").value,
        document.getElementById("dirManual").value);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}
function showPosition(position) {

    pos = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        alt: position.coords.altitude
    };

    document.getElementById("lat").innerHTML = pos.lat;
    document.getElementById("lon").innerHTML = pos.lon;
    document.getElementById("alt").innerHTML = pos.alt;

    if (document.URL.indexOf('?') > 0) {
        var objCoords = document.URL.substring(document.URL.indexOf('?') + 1).split(',')
        var obj = {
            lat: objCoords[0],
            lon: objCoords[1],
            alt: objCoords[2]
        };

        calculateDirection(obj);

        console.log("Célpont " + Math.floor(obj.dir) + "° " + Math.floor(obj.dist * 1000) + "m");
    }


    //Calculate Sight directions

    for (var i = 0; i < sights.length; i++) {
        var sight = sights[i];
        calculateDirection(sight);

        console.log(sight.text + " " + Math.floor(sight.dir) + "° " + Math.floor(sight.dist * 1000) + "m");

    }
}

function openCamera() {
    var video = document.getElementById('video');

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now

        constraints = {
            advanced: [{
                facingMode: "environment"
            }]
        };

        navigator.mediaDevices.getUserMedia({ video: constraints }).then(function (stream) {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
        });
    }

}

function deviceOrientationHandler(gamma, beta, dir) {

    //var isInLandscape = false; Math.abs(gamma) > Math.abs(beta);

    var horizonRotation = -beta;


    var horizon = document.getElementById("horizon");
    horizon.style.webkitTransform = "rotate(" + horizonRotation + "deg)";
    horizon.style.MozTransform = "rotate(" + horizonRotation + "deg)";
    horizon.style.transform = "rotate(" + horizonRotation + "deg)";


    //if (isInLandscape) {
    var normalizedGamma = gamma;
    if (gamma < 0) {
        normalizedGamma = Number(gamma) + 180;
    }

    if (normalizedGamma < 90 - vFoV || normalizedGamma > 90 + vFoV) {
        horizon.style.visibility = "hidden";
    } else {
        var horizonPosition = (normalizedGamma - 90 + vFoV) * (99 / (2 * vFoV));
        horizon.style.left = horizonPosition + "%";
        horizon.style.visibility = "visible";
    }
    /*} else {
        if (Math.abs(beta) < 90 - vFoV || Math.abs(beta) > 90 + vFoV) {
            horizon.style.visibility = "hidden";
        } else {
            var horizonPosition = (Math.abs(beta) - 90 + vFoV) * (99 / (2 * vFoV));
            horizon.style.top = horizonPosition + "%";
            horizon.style.left = "0%";
            horizon.style.visibility = "visible";
        }
        
    }*/

    //POLE

    var pole = document.getElementById("pole");

    var poleRotation = (Number(dir) + 360) % 360;
    var polePosition = ((poleRotation + 45) % 90);

    var poleName = "N";
    if (poleRotation < 45 || poleRotation > 315) {
        poleName = "N"
    } else if (45 < poleRotation && poleRotation < 135) {
        poleName = "W"
    } else if (135 < poleRotation && poleRotation < 225) {
        poleName = "S"
    } else if (225 < poleRotation && poleRotation < 315) {
        poleName = "E"
    }

    pole.innerHTML = poleName;

    //if (isInLandscape) {
    pole.style.top = polePosition + "%";
    pole.style.left = "100%";
    /*
        } else {
            pole.style.left = polePosition + "%";
            pole.style.top = "0%";
        }*/


    //DEBUG

    document.getElementById("gamma").innerHTML = Math.ceil(gamma);
    document.getElementById("beta").innerHTML = Math.ceil(beta);
    document.getElementById("direction").innerHTML = Math.ceil(dir);

    document.getElementById("gammaManual").value = Math.ceil(gamma);
    document.getElementById("betaManual").value = Math.ceil(beta);
    document.getElementById("dirManual").value = Math.ceil(dir);

}


document.addEventListener("DOMContentLoaded", function (event) {

    if (window.DeviceOrientationEvent) {

        // manual();

        openCamera();

        getLocation();

        window.addEventListener('deviceorientation',
            function (eventData) {
                // gamma: Tilting the device from left to right. Tilting the device to the right will result in a positive value.
                var gamma = eventData.gamma;

                // beta: Tilting the device from the front to the back. Tilting the device to the front will result in a positive value.
                var beta = eventData.beta;

                // alpha: The direction the compass of the device aims to in degrees.
                var dir = eventData.alpha

                // Call the function to use the data on the page.
                if (gamma != null && beta != null && dir != null) {

                    deviceOrientationHandler(gamma, beta, dir);
                }
            },
            false);
    };
});


function calculateDirection(obj) {
    var latDiff = obj.lat - pos.lat;
    var lonDiff = obj.lon - pos.lon;

    var sightDir = 90 + Math.atan(latDiff / lonDiff) * (180 / 3.14);

    if (lonDiff > 0) {
        sightDir += 180;
    }

    obj.dir = sightDir;
    obj.dist = distanceInKmBetweenEarthCoordinates(obj.lat, obj.lon, pos.lat, pos.lon);
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

var sights =
    [
        {
            text: "János hegy",
            lat: 47.518053,
            lon: 18.960178,
            alt: 500
        },
        {
            text: "Citadella",
            lat: 47.486944,
            lon: 19.047011,
            alt: 230
        },
        {
            text: "Bazilika",
            lat: 47.500801,
            lon: 19.053814,
            alt: 170
        },
        {
            text: "Hármashatárhegy",
            lat: 47.555880,
            lon: 19.002418,
            alt: 500
        },
        {
            text: "Telekom adótorony",
            lat: 47.468714,
            lon: 19.126104,
            alt: 130
        },
        {
            text: "Lakihegyi adótorony",
            lat: 47.373155,
            lon: 19.004955,
            alt: 420
        },
        {
            text: "Liszt Ferenc reptér",
            lat: 47.435109,
            lon: 19.253196,
            alt: 120
        },
        {
            text: "Kékes tetö",
            lat: 47.871354,
            lon: 20.011534,
            alt: 1014
        },
    ];


function share() {
    var url = document.querySelector('link[rel=canonical]')
        ? document.querySelector('link[rel=canonical]').href
        : window.location.href;

    if (url.indexOf('?') > 0) {
        url = url.substring(0, url.indexOf('?'));
    }

    url += "?" + pos.lat + "," + pos.lon

    if (alt.length > 0) {
        url += "," + pos.alt
    }
    var copyText = document.getElementById("clipboard");

    copyText.value = url;

    if (navigator.share) {
        navigator.share({
            title: "Navigator position share",
            text: 'With this page you can check where am I',
            url: url
        })
            .then(() => console.log('Successfully shared'))
            .catch((error) => console.log('Error sharing:', error));
    } else  {

        copyText.select();
        document.execCommand("copy");
        alert("Copied the text: " + copyText.value);
    }

}