function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

consentCookie = getCookie('OptanonConsent').split('&');
consentId = consentCookie.find(element => element.includes("consentId")).split('=')[1]
consentIdDescription = '<br>Your unique consent ID is '+consentId +'. If you have any questions about your consent records, please share this identifier with our team when submitting your request.';
description = window.document.getElementById('ot-pc-desc');
description.insertAdjacentHTML('beforeend', consentIdDescription);
