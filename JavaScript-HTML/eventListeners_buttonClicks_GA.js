
// function to pull cookie value
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
    return parts.pop().split(";").shift();
}

// OptanonWrapper function that should already be present on every page
function OptanonWrapper() {
    console.log("OptanonWrapper called");
    
    var bannerAcceptButton = document.getElementById("onetrust-accept-btn-handler");
    var pcAllowAllButton = document.getElementById("accept-recommended-btn-handler");
    var pcSaveButton = document.getElementsByClassName("save-preference-btn-handler onetrust-close-btn-handler button-theme")[0];
    var OABCcookieName = "OptanonAlertBoxClosed";
    var OABCcookie = getCookie(OABCcookieName);

    // IF logic needed here because ot-banner-sdk DIV is not injected on page loads if banner is not exposed
    if (!OABCcookie) {
        bannerAcceptButton.addEventListener('click', function(){
	        console.log("Allowed all via Banner");
            
            // GTM dataLayer event push
            window.dataLayer.push({event:'OTBannerAllowAll'});
        });
    }

    pcAllowAllButton.addEventListener('click', function(){
	    console.log("Allowed all via Preference Center");
       
        // GTM dataLayer event push
        window.dataLayer.push({event:'OTPCAllowAll'});
    });

    pcSaveButton.addEventListener('click', function(){
	    console.log("Set custom settings via Preference Center");
        
        // GTM dataLayer event push
        window.dataLayer.push({event:'OTPCSaveSettings'});
    });
}