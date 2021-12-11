function OptanonWrapper() {
    var geoData = window.OneTrust.getGeolocationData();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        customer: {
            country: geoData.country,
            state: geoData.state
        }
    });
};

window.addEventListener("OneTrustGroupsUpdated", function(event) {
    var OtherThanStrictlyNecessaryVendors = 'C0035';
    var noop = function noop() {};
    if (typeof(window.Shopify && window.Shopify.customerPrivacy && window.Shopify.customerPrivacy.setTrackingConsent) === 'function') {
        if (event.detail.indexOf(OtherThanStrictlyNecessaryVendors) > -1) {
            window.Shopify.customerPrivacy.setTrackingConsent(true, noop);
        } else {
            window.Shopify.customerPrivacy.setTrackingConsent(false, noop);
        }
    }
});