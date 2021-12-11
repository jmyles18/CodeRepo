

function passToIframe() {
    function find(arr, fn) {
        for (var i = 0; i < arr.length; i += 1) {
            if (fn(arr[i])) {
                return arr[i];
            }
        }
    }

    function map(arr, fn) {
        var newArr = [];
        for (var i = 0; i < arr.length; i += 1) {
            newArr.push(fn(arr[i]));
        }
        return newArr;
    }

    function getCookie(name) {
        var decodedCookie = document.cookie;
        var cookies = map(decodedCookie.split(';'), function(c) {
            return c.trim()
        });
        var matching = find(cookies, function(cookie) {
            return cookie.indexOf(name) === 0
        });
        return matching;
    }
    var OptanonConsent = getCookie('OptanonConsent');
    var OptanonAlertBoxClosed = getCookie('OptanonAlertBoxClosed');
    var pass_data = {
        OptanonConsent,
        OptanonAlertBoxClosed,
        OptanonActiveGroups: window.OptanonActiveGroups
    };
    for (var i = 0; i < window.frames.length; i++) {
        if (typeof window.frames[i].postMessage === 'function') {
            window.frames[i].postMessage(pass_data, '*');
        }
    }
}

var existingOptanonWrapper = window.OptanonWrapper;
window.OptanonWrapper = function() {
    if (existingOptanonWrapper && typeof existingOptanonWrapper === 'function') {
        existingOptanonWrapper();
    }
    passToIframe();
};