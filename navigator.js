var hFoV = 90;
var vFoV = 40;
   

manual = function () {
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
    document.getElementById("lat").innerHTML = position.coords.latitude;
    document.getElementById("lon").innerHTML = position.coords.longitude;
    document.getElementById("alt").innerHTML = position.coords.altitude;
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

deviceOrientationHandler = function (gamma, beta, dir) {
    var horizonRotation = -beta + 90;
    var horizonPosition = Math.abs((Math.abs(gamma) / 1.8) - 100);

    var horizon = document.getElementById("horizon");
    horizon.style.webkitTransform = "rotate(" + horizonRotation + "deg)";
    horizon.style.MozTransform = "rotate(" + horizonRotation + "deg)";
    horizon.style.transform = "rotate(" + horizonRotation + "deg)";

    horizon.style.top = horizonPosition + "%";


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
    pole.style.left = polePosition + "%";


    document.getElementById("gamma").innerHTML = Math.ceil(gamma);
    document.getElementById("beta").innerHTML = Math.ceil(beta);
    document.getElementById("direction").innerHTML = Math.ceil(dir);

}


document.addEventListener("DOMContentLoaded", function (event) {

    if (window.DeviceOrientationEvent) {

        manual();

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