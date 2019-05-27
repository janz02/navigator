document.addEventListener("DOMContentLoaded", function (event) {

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function (eventData) {
            // gamma: Tilting the device from left to right. Tilting the device to the right will result in a positive value.
            var gamma = eventData.gamma;

            // beta: Tilting the device from the front to the back. Tilting the device to the front will result in a positive value.
            var beta = eventData.beta;

            // alpha: The direction the compass of the device aims to in degrees.
            var dir = eventData.alpha

            // Call the function to use the data on the page.
            deviceOrientationHandler(gamma, beta, dir);
        }, false);
    };

    function  deviceOrientationHandler(gamma, beta, dir) {
        var horizonRotation = 0;
        var horizonPosition = Math.abs((Math.abs(gamma) / 1.8) - 100);

        var horizon = document.getElementById("horizon");
        horizon.style.webkitTransform = "rotate(" + horizonRotation + "deg)";
        horizon.style.MozTransform = "rotate(" + horizonRotation + "deg)";
        horizon.style.transform = "rotate(" + horizonRotation + "deg)";

        horizon.style.top = horizonPosition + "%";


        var pole = document.getElementById("pole");

        var poleRotation = (direction + 360) % 360;
        var polePosition = ((poleRotation + 45) % 90) * (90.0 / 100.0);

        var poleName = "N";
        if (poleRotation < 45 || poleRotation > 315) {
            poleName = "N"
        } else if (45 < poleRotation || polerotation < 135) {
            poleName = "W"
        } else if (135 < poleRotation || polerotation < 225) {
            poleName = "S"
        } else if (225 < poleRotation || polerotation < 315) {
            poleName = "E"
        }

        pole.innerHTML = poleName;
        pole.style.left = polePosition + "%";


        document.getElementById("gamma").innerHTML = Math.ceil(gamma);
        document.getElementById("beta").innerHTML = Math.ceil(beta);
        document.getElementById("direction").innerHTML = Math.ceil(dir);

    }

});