// Use-case: if user clicks "X" on banner, client wants the banner to resurface
// This script will fire function on click of "X" button to use JS to expire the OABC cookie

function OptanonWrapper() {
    // function to pull cookie value
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2)
            return parts.pop().split(";").shift();
    }

    var date = new Date();
    // date calculation - days * hours * minutes * seconds * converting seconds to milliseconds
    // change this whatever time frame you need to update expiration date to (ex. change 365 to 180 to update from 12 to 6 months)
    date.setTime(date.getTime() + (-365 * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    console.log("expires: " + expires);
    var bannerCloseBtn = document.getElementsByClassName("onetrust-close-btn-handler onetrust-close-btn-ui banner-close-button onetrust-lg close-icon")[0];
    var OABCcookieName = "OptanonAlertBoxClosed";

    bannerCloseBtn.addEventListener('click', function() {
        console.log("Banner Close Button Clicked!!");

        // Function to set cookieValue
        setTimeout(updateOTExpiration, 1000);
    });

    function updateOTExpiration() {
        //updating the OptanonAlertBoxClosed cookie expiration date
        // uncomment the domain portion of this for Production CDN scripts
        var OABCcookie = getCookie(OABCcookieName);
        document.cookie = OABCcookieName + "=" + OABCcookie + expires + ";path=/; Samesite=Lax;domain=.onetoso.com;";
        console.log("OptanonAlertBoxClosed cookie overwritten");
    }
}