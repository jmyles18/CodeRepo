var OneTrustStub = (function (exports) {
    'use strict';

    var OtUtil = /** @class */ (function () {
        function OtUtil() {
            this.optanonCookieName = 'OptanonConsent';
            this.optanonHtmlGroupData = [];
            this.IABCookieValue = '';
            this.oneTrustIABCookieName = 'eupubconsent';
            this.oneTrustIsIABCrossConsentEnableParam = 'isIABGlobal';
            this.isStubReady = true;
            this.geolocationCookiesParam = 'geolocation';
            this.EUCOUNTRIES = [
                'BE',
                'BG',
                'CZ',
                'DK',
                'DE',
                'EE',
                'IE',
                'GR',
                'ES',
                'FR',
                'IT',
                'CY',
                'LV',
                'LT',
                'LU',
                'HU',
                'MT',
                'NL',
                'AT',
                'PL',
                'PT',
                'RO',
                'SI',
                'SK',
                'FI',
                'SE',
                'GB',
                'HR',
                'LI',
                'NO',
                'IS'
            ];
            this.stubFileName = 'otSDKStub';
            this.DATAFILEATTRIBUTE = 'data-domain-script';
            this.bannerScriptName = 'otBannerSdk.js';
            this.mobileOnlineURL = [];
            this.isMigratedURL = false;
            this.migratedCCTID = '[[OldCCTID]]';
            this.migratedDomainId = '[[NewDomainId]]';
            this.userLocation = {
                country: '',
                state: '',
            };
        }
        return OtUtil;
    }());
    var otUtil = new OtUtil();

    var OtSDKStub = /** @class */ (function () {
        function OtSDKStub() {
            var _this = this;
            this.iabType = null; // Enums ['IAB', 'IAB2'];IAB-CMP, IAB2-TCF
            this.iabTypeAdded = true;
            this.addBannerSDKScript = function (domainData) {
                // TODO: below check(only) to be removed in the next release
                var regionRule = null;
                if (_this.iabTypeAdded) {
                    regionRule = _this.getRegionSet(domainData); // Find the applicable rule
                    if (regionRule.Type === 'IAB' || regionRule.Type === 'IAB2') { // Initialize stub only if IAB is enabled
                        _this.iabType = regionRule.Type;
                        _this.intializeIabStub();
                    }
                }
                var stubElement = otUtil.stubScriptElement.cloneNode(true);
                var bannerScriptURL = '';
                if (domainData.UseSDKRefactor) { // Wwhen refactor feature pack is enabled
                    if (otUtil.isMigratedURL) {
                        stubElement.src = otUtil.storageBaseURL + "/scripttemplates/new/scripttemplates/" + otUtil.stubFileName + ".js";
                    }
                    bannerScriptURL = otUtil.storageBaseURL + "/scripttemplates/new/scripttemplates/" + domainData.Version + "/" + otUtil.bannerScriptName;
                }
                else if (domainData.Version === '5.11.0') { // When refeactor feature pack is not enabled and Only for 5.11 release scritps
                    if (otUtil.isMigratedURL) {
                        stubElement.src = otUtil.storageBaseURL + "/scripttemplates/old/scripttemplates/" + otUtil.stubFileName + ".js";
                    }
                    bannerScriptURL = otUtil.storageBaseURL + "/scripttemplates/old/scripttemplates/5.11.0/" + otUtil.bannerScriptName;
                }
                else { // for all releases except 5.11 
                    if (otUtil.isMigratedURL) {
                        stubElement.src = otUtil.storageBaseURL + "/scripttemplates/" + otUtil.stubFileName + ".js";
                    }
                    bannerScriptURL = otUtil.storageBaseURL + "/scripttemplates/" + domainData.Version + "/" + otUtil.bannerScriptName;
                }
                var attrArr = ['charset', 'data-language', 'data-domain-script'];
                attrArr.forEach(function (attr) {
                    if (otUtil.stubScriptElement.getAttribute(attr)) {
                        stubElement.setAttribute(attr, otUtil.stubScriptElement.getAttribute(attr));
                    }
                });
                window.otStubData = {
                    domainData: domainData,
                    stubElement: stubElement,
                    bannerBaseDataURL: otUtil.bannerBaseDataURL,
                    mobileOnlineURL: otUtil.mobileOnlineURL,
                    userLocation: otUtil.userLocation,
                    regionRule: regionRule
                };
                _this.jsonp(bannerScriptURL, null);
            };
            // IAB Stub
            this.intializeIabStub = function () {
                var win = window;
                if (_this.iabTypeAdded) {
                    var stubType = null;
                    if (_this.iabType === 'IAB') {
                        window.__cmp = _this.executeCmpApi;
                        stubType = '__cmp';
                    }
                    else {
                        window.__tcfapi = _this.executeTcfApi;
                        stubType = '__tcfapi';
                    }
                    if (typeof win[stubType] === undefined) {
                        win[stubType] = {};
                    }
                    _this.addIabFrame();
                }
                else {
                    // else block to be removed in the next release
                    _this.initializeBackwardStub();
                    _this.addBackwardIabFrame();
                }
                win.receiveOTMessage = _this.receiveIabMessage;
                var listen = win.attachEvent || window.addEventListener;
                listen('message', win.receiveOTMessage, false);
            };
            this.initializeBackwardStub = function () {
                var win = window;
                // CMP
                if (typeof win['__cmp'] === undefined) {
                    win['__cmp'] = {};
                }
                // TCF
                if (typeof win['__tcfapi'] === undefined) {
                    win['__tcfapi'] = {};
                }
            };
            this.addIabFrame = function () {
                var win = window;
                var locatorName = _this.iabType === 'IAB' ? '__cmpLocator' : '__tcfapiLocator';
                var locatorExists = !!win.frames[locatorName];
                if (!locatorExists) {
                    if (win.document.body) {
                        _this.addLocator(locatorName, 'CMP');
                    }
                    else {
                        setTimeout(_this.addIabFrame, 5);
                    }
                }
                return;
            };
            this.addBackwardIabFrame = function () {
                var win = window;
                // CMP
                var cmpLocatorName = '__cmpLocator';
                var cmpLocatorExists = !!win.frames[cmpLocatorName];
                if (!cmpLocatorExists) {
                    if (win.document.body) {
                        _this.addLocator(cmpLocatorName, 'CMP');
                    }
                    else {
                        setTimeout(_this.addIabFrame, 5);
                    }
                }
                // TCF
                var tcfLocatorName = '__tcfapiLocator';
                var tcfLocatorExists = !!win.frames[tcfLocatorName];
                if (!tcfLocatorExists) {
                    if (win.document.body) {
                        _this.addLocator(tcfLocatorName, 'TCF');
                    }
                    else {
                        setTimeout(_this.addIabFrame, 5);
                    }
                }
                return;
            };
            this.addLocator = function (locatorName, title) {
                var win = window;
                var iframe = win.document.createElement('iframe');
                iframe.style.cssText = 'display:none';
                iframe.name = locatorName;
                iframe.setAttribute('title', title + " Locator");
                win.document.body.appendChild(iframe);
            };
            this.receiveIabMessage = function (event) {
                var msgIsString = typeof event.data === 'string';
                var data = {};
                try {
                    if (msgIsString) {
                        data = JSON.parse(event.data);
                    }
                    else {
                        data = event.data;
                    }
                }
                catch (ignore) { }
                // CMP
                if (data.__cmpCall && _this.iabType === 'IAB') {
                    var callId_1 = data.__cmpCall.callId, command_1 = data.__cmpCall.command, parameter = data.__cmpCall.parameter;
                    _this.executeCmpApi(command_1, parameter, function (returnValue, success) {
                        var returnMsg = {
                            __cmpReturn: {
                                returnValue: returnValue,
                                success: success,
                                callId: callId_1,
                                command: command_1
                            }
                        };
                        event.source.postMessage(msgIsString ? JSON.stringify(returnMsg) : returnMsg, event.origin);
                    });
                }
                else if (data.__cmpCall && _this.iabType === 'IAB2') {
                    console.log('Expecting IAB TCF v2.0 vendor iFrame call; Received IAB TCF v1.1');
                }
                // TCF
                if (data.__tcfapiCall && _this.iabType === 'IAB2') {
                    var callId_2 = data.__tcfapiCall.callId, command_2 = data.__tcfapiCall.command, parameter = data.__tcfapiCall.parameter, version = data.__tcfapiCall.version;
                    _this.executeTcfApi(command_2, parameter, function (returnValue, success) {
                        var returnMsg = {
                            __tcfapiReturn: {
                                returnValue: returnValue,
                                success: success,
                                callId: callId_2,
                                command: command_2
                            }
                        };
                        event.source.postMessage(msgIsString ? JSON.stringify(returnMsg) : returnMsg, event.origin);
                    }, version);
                }
                else if (data.__tcfapiCall && _this.iabType === 'IAB') {
                    console.log('Expecting IAB TCF v1.1 vendor iFrame call; Received IAB TCF v2.0');
                }
            };
            this.executeCmpApi = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.iabType = 'IAB';
                var command = args[0], parameter = args[1], callback = args[2];
                if (typeof callback === 'function' && command) {
                    if (otUtil.isStubReady && otUtil.IABCookieValue) {
                        switch (command) {
                            case 'ping':
                                _this.getPingRequest(callback, true);
                                break;
                            case 'getConsentData':
                                _this.getConsentDataRequest(callback);
                                break;
                            default:
                                _this.addToQueue(command, parameter, callback);
                                break;
                        }
                    }
                    else {
                        _this.addToQueue(command, parameter, callback);
                    }
                }
            };
            this.executeTcfApi = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.iabType = 'IAB2';
                if (!args.length) {
                    return window['__tcfapi'].a;
                }
                var command = args[0], parameter = args[1], callback = args[2], version = args[3];
                if (typeof callback === 'function' && command) {
                    if (otUtil.isStubReady && otUtil.IABCookieValue && command === 'ping') {
                        _this.getPingRequest(callback);
                    }
                    else {
                        _this.addToQueue(command, parameter, callback, version);
                    }
                }
            };
            // CMP : command, parameter, callback
            // TCF: command, version, callback, parameter
            // For backward copatability appending version at the end and retaining the previous arguments order
            // Same order is evaluated in the main script.DO NOT modify this argument order
            this.addToQueue = function (command, parameter, callback, version) {
                var win = window;
                var type = _this.iabType === 'IAB' ? '__cmp' : '__tcfapi';
                win[type].a = win[type].a || [];
                if (command === 'ping') {
                    _this.getPingRequest(callback);
                }
                else {
                    win[type].a.push([command, parameter, callback, version]);
                }
            };
            // CMP/ TCF Ping request
            this.getPingRequest = function (callback, isIabCookieValueExists) {
                if (isIabCookieValueExists === void 0) { isIabCookieValueExists = false; }
                if (callback) {
                    var pingData = {};
                    var isValidCommand = false;
                    if (_this.iabType === 'IAB') {
                        pingData = {
                            gdprAppliesGlobally: otUtil.oneTrustIABgdprAppliesGlobally,
                            cmpLoaded: isIabCookieValueExists
                        };
                        isValidCommand = true;
                    }
                    else if (_this.iabType === 'IAB2') {
                        pingData = {
                            gdprApplies: otUtil.oneTrustIABgdprAppliesGlobally,
                            cmpLoaded: false,
                            cmpStatus: 'stub',
                            displayStatus: 'stub',
                            apiVersion: '2.0',
                            cmpVersion: undefined,
                            cmpId: undefined,
                            gvlVersion: undefined,
                            tcfPolicyVersion: undefined
                        };
                        isValidCommand = true;
                    }
                    callback(pingData, isValidCommand);
                }
            };
            // CMP get consent data
            this.getConsentDataRequest = function (callback) {
                if (callback && otUtil.IABCookieValue) {
                    var consentData = {
                        gdprApplies: otUtil.oneTrustIABgdprAppliesGlobally,
                        hasGlobalScope: otUtil.hasIABGlobalScope,
                        consentData: otUtil.IABCookieValue
                    };
                    callback(consentData, true);
                }
            };
            this.initConsentSDK();
        }
        OtSDKStub.prototype.initConsentSDK = function () {
            this.initCustomEventPolyfill();
            this.ensureHtmlGroupDataInitialised();
            this.updateGtmMacros();
            this.fetchBannerSDKDependency();
        };
        OtSDKStub.prototype.fetchBannerSDKDependency = function () {
            this.setDomainDataFileURL();
            this.otFetch(otUtil.bannerDataParentURL, this.getLocation.bind(this));
        };
        OtSDKStub.prototype.getLocation = function (domainData) {
            // TODO: below condition to be removed in the next release
            if (!domainData.RuleSet[0].Type) {
                this.iabTypeAdded = false;
                window.__cmp = this.executeCmpApi;
                window.__tcfapi = this.executeTcfApi;
                this.intializeIabStub(); // initialize stub for Backward comptability
                return this.addBannerSDKScript(domainData);
            }
            var win = window;
            if (win.OneTrust && win.OneTrust.geolocationResponse) {
                var response = win.OneTrust.geolocationResponse;
                this.setGeoLocation(response.countryCode, response.stateCode);
                this.addBannerSDKScript(domainData);
            }
            else {
                var userLocation = this.readCookieParam(otUtil.optanonCookieName, otUtil.geolocationCookiesParam);
                if (userLocation || domainData.SkipGeolocation) {
                    var country = userLocation.split(';')[0];
                    var state = userLocation.split(';')[1];
                    this.setGeoLocation(country, state);
                    this.addBannerSDKScript(domainData);
                }
                else {
                    this.getGeoLocation(domainData);
                }
            }
        };
        OtSDKStub.prototype.getGeolocationURL = function (domainData) {
            var url = "" + otUtil.stubScriptElement.getAttribute('src').split(otUtil.stubFileName)[0] + domainData.Version;
            if (new RegExp('^file://', 'i').test(url) && domainData.MobileSDK) {
                return "./" + domainData.GeolocationUrl.replace(/^(http|https):\/\//, '').split('/').slice(1).join('/') + ".js";
            }
            else {
                return domainData.GeolocationUrl;
            }
        };
        OtSDKStub.prototype.getGeoLocation = function (domainData) {
            var _this = this;
            window.jsonFeed = function (data) {
                _this.setGeoLocation(data.country, data.state);
            };
            this.jsonp(this.getGeolocationURL(domainData), this.addBannerSDKScript.bind(this, domainData));
        };
        // set Geo location
        OtSDKStub.prototype.setGeoLocation = function (country, state) {
            if (state === void 0) { state = ''; }
            otUtil.userLocation = {
                country: country,
                state: state
            };
        };
        OtSDKStub.prototype.otFetch = function (url, callback) {
            if (new RegExp('^file://', 'i').test(url)) {
                this.otFetchOfflineFile(url, callback);
            }
            else {
                otUtil.mobileOnlineURL.push(url);
                var request = new XMLHttpRequest();
                request.onload = function () {
                    callback(JSON.parse(this.responseText));
                };
                request.open('GET', url);
                request.send();
            }
        };
        OtSDKStub.prototype.otFetchOfflineFile = function (url, callback) {
            url = url.replace('.json', '.js');
            var urlPath = url.split('/');
            var fileName = urlPath[urlPath.length - 1];
            var fileObject = fileName.split('.js')[0];
            var PromiseResolve = function () {
                callback(window[fileObject]);
            };
            this.jsonp(url, PromiseResolve);
        };
        OtSDKStub.prototype.jsonp = function (url, callback) {
            var bannerScript = document.createElement('script');
            bannerScript.setAttribute('src', url);
            bannerScript.async = true;
            bannerScript.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(bannerScript);
            if (!new RegExp('^file://', 'i').test(url)) {
                otUtil.mobileOnlineURL.push(url);
            }
            if (callback) {
                bannerScript.onload = function () {
                    callback();
                };
            }
        };
        OtSDKStub.prototype.getRegionSet = function (responseDomainData) {
            var countryRegionRule;
            var stateRegionRule;
            var globalRegionRule;
            var userLocation = otUtil.userLocation;
            var defaultRule = responseDomainData.
                RuleSet.filter(function (ruleSet) {
                return ruleSet.Default === true;
            });
            if (!userLocation.country && !userLocation.state) {
                return defaultRule && defaultRule.length > 0 ? defaultRule[0] : null;
            }
            else {
                var userState = userLocation.state.toLowerCase();
                var userCountry = userLocation.country.toLowerCase();
                for (var i = 0; i < responseDomainData.RuleSet.length; i++) {
                    if (responseDomainData.RuleSet[i].Global === true) {
                        globalRegionRule = responseDomainData.RuleSet[i];
                    }
                    else {
                        var states = responseDomainData.RuleSet[i].States;
                        if (states[userCountry] && states[userCountry].indexOf(userState) >= 0) {
                            stateRegionRule = responseDomainData.RuleSet[i];
                            break;
                        }
                        else if (responseDomainData.RuleSet[i].Countries.indexOf(userCountry) >= 0) {
                            countryRegionRule = responseDomainData.RuleSet[i];
                        }
                    }
                }
            }
            return stateRegionRule || countryRegionRule || globalRegionRule;
        };
        OtSDKStub.prototype.ensureHtmlGroupDataInitialised = function () {
            this.initializeIABData();
            this.initializeGroupData();
        };
        OtSDKStub.prototype.initializeGroupData = function () {
            if (this.readCookieParam(otUtil.optanonCookieName, 'groups')) {
                otUtil.optanonHtmlGroupData = this.deserialiseStringToArray(this.readCookieParam(otUtil.optanonCookieName, 'groups'));
            }
        };
        OtSDKStub.prototype.initializeIABData = function () {
            this.validateIABGDPRApplied();
            this.validateIABGlobalScope();
        };
        OtSDKStub.prototype.validateIABGlobalScope = function () {
            var isIabThirdPartyCookieEnabled = this.readCookieParam(otUtil.optanonCookieName, otUtil.oneTrustIsIABCrossConsentEnableParam);
            if (isIabThirdPartyCookieEnabled) {
                if (isIabThirdPartyCookieEnabled === 'true') {
                    otUtil.hasIABGlobalScope = true;
                    otUtil.isStubReady = false;
                }
                else {
                    otUtil.hasIABGlobalScope = false;
                    otUtil.IABCookieValue = this.getCookie(otUtil.oneTrustIABCookieName);
                }
            }
            else {
                otUtil.isStubReady = false;
            }
        };
        OtSDKStub.prototype.validateIABGDPRApplied = function () {
            var geolocation = this.readCookieParam(otUtil.optanonCookieName, otUtil.geolocationCookiesParam).split(';')[0];
            if (geolocation) {
                if (this.isBoolean(geolocation)) { // To handle backward compatibility for old workflow scripts
                    otUtil.oneTrustIABgdprAppliesGlobally = geolocation === 'true' ? true : false;
                }
                else {
                    otUtil.oneTrustIABgdprAppliesGlobally = otUtil.EUCOUNTRIES.indexOf(geolocation) >= 0;
                }
            }
            else {
                otUtil.isStubReady = false;
            }
        };
        OtSDKStub.prototype.isBoolean = function (geolocation) {
            if (geolocation === 'true' || geolocation === 'false') {
                return true;
            }
            else {
                return false;
            }
        };
        OtSDKStub.prototype.readCookieParam = function (cookieName, paramName) {
            var cookie = this.getCookie(cookieName);
            var i, data, values, pair;
            if (cookie) {
                data = {};
                values = cookie.split('&');
                for (i = 0; i < values.length; i += 1) {
                    pair = values[i].split('=');
                    data[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                }
                if (paramName && data[paramName]) {
                    return data[paramName];
                }
                if (paramName && !data[paramName]) {
                    return '';
                }
                return data;
            }
            return '';
        };
        OtSDKStub.prototype.getCookie = function (name) {
            var nameEq = name + '=';
            var ca = document.cookie.split(';');
            var i, c;
            for (i = 0; i < ca.length; i += 1) {
                c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEq) == 0) {
                    return c.substring(nameEq.length, c.length);
                }
            }
            return null;
        };
        OtSDKStub.prototype.updateGtmMacros = function () {
            var gtmOptanonActiveGroups = [];
            var i;
            for (i = 0; i < otUtil.optanonHtmlGroupData.length; i++) {
                if (this.endsWith(otUtil.optanonHtmlGroupData[i], ':1')) {
                    gtmOptanonActiveGroups.push(otUtil.optanonHtmlGroupData[i].replace(':1', ''));
                }
            }
            var serializeArrayString = ',' + this.serialiseArrayToString(gtmOptanonActiveGroups) + ',';
            window.OnetrustActiveGroups = serializeArrayString;
            window.OptanonActiveGroups = serializeArrayString;
            if (typeof window.dataLayer !== 'undefined') {
                if (window.dataLayer.constructor === Array) {
                    window.dataLayer.push({
                        OnetrustActiveGroups: serializeArrayString
                    });
                    window.dataLayer.push({
                        OptanonActiveGroups: serializeArrayString
                    });
                }
            }
            else {
                window.dataLayer = [
                    {
                        event: 'OneTrustLoaded',
                        OnetrustActiveGroups: serializeArrayString
                    },
                    {
                        event: 'OptanonLoaded',
                        OptanonActiveGroups: serializeArrayString
                    }
                ];
            }
            setTimeout(function () {
                var event = new CustomEvent('consent.onetrust', {
                    detail: gtmOptanonActiveGroups
                });
                window.dispatchEvent(event);
            });
        };
        OtSDKStub.prototype.deserialiseStringToArray = function (cookieGroupsString) {
            if (!cookieGroupsString) {
                return [];
            }
            return cookieGroupsString.split(',');
        };
        OtSDKStub.prototype.endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };
        OtSDKStub.prototype.serialiseArrayToString = function (cookieGroupsArray) {
            return cookieGroupsArray.toString();
        };
        OtSDKStub.prototype.setStubScriptElement = function () {
            otUtil.stubScriptElement = document.querySelector("script[src*='" + otUtil.stubFileName + "']");
            if (otUtil.stubScriptElement &&
                otUtil.stubScriptElement.hasAttribute(otUtil.DATAFILEATTRIBUTE)) {
                otUtil.domainDataFileName = otUtil.stubScriptElement.getAttribute(otUtil.DATAFILEATTRIBUTE).trim();
            }
            else if (!otUtil.stubScriptElement) {
                otUtil.stubScriptElement = document.querySelector("script[src*='" + otUtil.migratedCCTID + "']");
                if (otUtil.stubScriptElement) {
                    otUtil.isMigratedURL = true;
                    otUtil.domainDataFileName = otUtil.migratedDomainId.trim();
                }
            }
        };
        OtSDKStub.prototype.setDomainDataFileURL = function () {
            this.setStubScriptElement();
            var stubScriptURL = otUtil.stubScriptElement.getAttribute('src');
            if (stubScriptURL) {
                if (!otUtil.isMigratedURL) {
                    otUtil.storageBaseURL = stubScriptURL.split("/scripttemplates/" + otUtil.stubFileName)[0];
                }
                else {
                    otUtil.storageBaseURL = stubScriptURL.split("/consent/" + otUtil.migratedCCTID)[0];
                }
            }
            otUtil.bannerBaseDataURL = otUtil.storageBaseURL
                && otUtil.storageBaseURL + "/consent/" + otUtil.domainDataFileName;
            otUtil.bannerDataParentURL = otUtil.bannerBaseDataURL + "/" + otUtil.domainDataFileName + ".json";
        };
        OtSDKStub.prototype.initCustomEventPolyfill = function () {
            if (typeof window.CustomEvent === 'function') {
                return false; // If CustomEvent supported return
            }
            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        };
        return OtSDKStub;
    }());
    var otSdkStub = new OtSDKStub();

    exports.OtSDKStub = OtSDKStub;
    exports.otSdkStub = otSdkStub;

    return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RTREtTdHViLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc3R1Yi9vdFN0dWJVdGlsLnRzIiwiLi4vLi4vLi4vc3JjL3N0dWIvb3RTREtTdHViLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBPdFV0aWwge1xuICAgIG9wdGFub25Db29raWVOYW1lID0gJ09wdGFub25Db25zZW50JztcbiAgICBvcHRhbm9uSHRtbEdyb3VwRGF0YTogYW55ID0gW107XG4gICAgSUFCQ29va2llVmFsdWUgPSAnJztcbiAgICBvbmVUcnVzdElBQkNvb2tpZU5hbWUgPSAnZXVwdWJjb25zZW50JztcbiAgICBvbmVUcnVzdElBQmdkcHJBcHBsaWVzR2xvYmFsbHk6IGJvb2xlYW47XG4gICAgb25lVHJ1c3RJc0lBQkNyb3NzQ29uc2VudEVuYWJsZVBhcmFtID0gJ2lzSUFCR2xvYmFsJztcbiAgICBoYXNJQUJHbG9iYWxTY29wZTogYm9vbGVhbjtcbiAgICBpc1N0dWJSZWFkeSA9IHRydWU7XG4gICAgZ2VvbG9jYXRpb25Db29raWVzUGFyYW0gPSAnZ2VvbG9jYXRpb24nO1xuICAgIEVVQ09VTlRSSUVTID0gW1xuICAgICAgICAnQkUnLFxuICAgICAgICAnQkcnLFxuICAgICAgICAnQ1onLFxuICAgICAgICAnREsnLFxuICAgICAgICAnREUnLFxuICAgICAgICAnRUUnLFxuICAgICAgICAnSUUnLFxuICAgICAgICAnR1InLFxuICAgICAgICAnRVMnLFxuICAgICAgICAnRlInLFxuICAgICAgICAnSVQnLFxuICAgICAgICAnQ1knLFxuICAgICAgICAnTFYnLFxuICAgICAgICAnTFQnLFxuICAgICAgICAnTFUnLFxuICAgICAgICAnSFUnLFxuICAgICAgICAnTVQnLFxuICAgICAgICAnTkwnLFxuICAgICAgICAnQVQnLFxuICAgICAgICAnUEwnLFxuICAgICAgICAnUFQnLFxuICAgICAgICAnUk8nLFxuICAgICAgICAnU0knLFxuICAgICAgICAnU0snLFxuICAgICAgICAnRkknLFxuICAgICAgICAnU0UnLFxuICAgICAgICAnR0InLFxuICAgICAgICAnSFInLFxuICAgICAgICAnTEknLFxuICAgICAgICAnTk8nLFxuICAgICAgICAnSVMnXG4gICAgXTtcbiAgICBzdHViRmlsZU5hbWUgPSAnb3RTREtTdHViJztcbiAgICBEQVRBRklMRUFUVFJJQlVURSA9ICdkYXRhLWRvbWFpbi1zY3JpcHQnO1xuICAgIGJhbm5lclNjcmlwdE5hbWUgPSAnb3RCYW5uZXJTZGsuanMnO1xuICAgIG1vYmlsZU9ubGluZVVSTDogc3RyaW5nW10gPSBbXTtcbiAgICBkb21haW5EYXRhRmlsZU5hbWU6IHN0cmluZztcbiAgICBzdHViU2NyaXB0RWxlbWVudDogSFRNTFNjcmlwdEVsZW1lbnQ7XG4gICAgYmFubmVyRGF0YVBhcmVudFVSTDogc3RyaW5nO1xuICAgIGJhbm5lckJhc2VEYXRhVVJMOiBzdHJpbmc7XG4gICAgc3RvcmFnZUJhc2VVUkw6IHN0cmluZztcbiAgICBpc01pZ3JhdGVkVVJMID0gZmFsc2U7XG4gICAgbWlncmF0ZWRDQ1RJRCA9ICdbW09sZENDVElEXV0nO1xuICAgIG1pZ3JhdGVkRG9tYWluSWQgPSAnW1tOZXdEb21haW5JZF1dJztcbiAgICB1c2VyTG9jYXRpb24gPSB7XG4gICAgICAgIGNvdW50cnk6ICcnLFxuICAgICAgICBzdGF0ZTogJycsXG4gICAgfTtcbn1cbmV4cG9ydCBjb25zdCBvdFV0aWwgPSBuZXcgT3RVdGlsKCk7XG5leHBvcnQgZGVmYXVsdCBvdFV0aWw7XG4iLCJpbXBvcnQgb3RVdGlsIGZyb20gJy4vb3RTdHViVXRpbCc7XG5pbXBvcnQgeyBSZWdpb25SdWxlTWFwcGluZyB9IGZyb20gJy4uL2ludGVyZmFjZXMvYmVoYXZpb3VyTW9kdWxlJztcbmV4cG9ydCBjbGFzcyBPdFNES1N0dWIge1xuICAgIGlhYlR5cGU6ICdJQUInIHwgJ0lBQjInID0gbnVsbDsgLy8gRW51bXMgWydJQUInLCAnSUFCMiddO0lBQi1DTVAsIElBQjItVENGXG4gICAgaWFiVHlwZUFkZGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXRDb25zZW50U0RLKCk7XG4gICAgfVxuXG4gICAgaW5pdENvbnNlbnRTREsoKSB7XG4gICAgICAgIHRoaXMuaW5pdEN1c3RvbUV2ZW50UG9seWZpbGwoKTtcbiAgICAgICAgdGhpcy5lbnN1cmVIdG1sR3JvdXBEYXRhSW5pdGlhbGlzZWQoKTtcbiAgICAgICAgdGhpcy51cGRhdGVHdG1NYWNyb3MoKTtcbiAgICAgICAgdGhpcy5mZXRjaEJhbm5lclNES0RlcGVuZGVuY3koKTtcbiAgICB9XG5cbiAgICBmZXRjaEJhbm5lclNES0RlcGVuZGVuY3koKSB7XG4gICAgICAgIHRoaXMuc2V0RG9tYWluRGF0YUZpbGVVUkwoKTtcbiAgICAgICAgdGhpcy5vdEZldGNoKG90VXRpbC5iYW5uZXJEYXRhUGFyZW50VVJMLCB0aGlzLmdldExvY2F0aW9uLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGdldExvY2F0aW9uKGRvbWFpbkRhdGE6IGFueSkge1xuICAgICAgICAvLyBUT0RPOiBiZWxvdyBjb25kaXRpb24gdG8gYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCByZWxlYXNlXG4gICAgICAgIGlmICghZG9tYWluRGF0YS5SdWxlU2V0WzBdLlR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMuaWFiVHlwZUFkZGVkID0gZmFsc2U7XG4gICAgICAgICAgICAod2luZG93IGFzIGFueSkuX19jbXAgPSB0aGlzLmV4ZWN1dGVDbXBBcGk7XG4gICAgICAgICAgICAod2luZG93IGFzIGFueSkuX190Y2ZhcGkgPSB0aGlzLmV4ZWN1dGVUY2ZBcGk7XG4gICAgICAgICAgICB0aGlzLmludGlhbGl6ZUlhYlN0dWIoKTsgLy8gaW5pdGlhbGl6ZSBzdHViIGZvciBCYWNrd2FyZCBjb21wdGFiaWxpdHlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZEJhbm5lclNES1NjcmlwdChkb21haW5EYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3aW4gPSAod2luZG93IGFzIGFueSk7XG4gICAgICAgIGlmICh3aW4uT25lVHJ1c3QgJiYgd2luLk9uZVRydXN0Lmdlb2xvY2F0aW9uUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gd2luLk9uZVRydXN0Lmdlb2xvY2F0aW9uUmVzcG9uc2U7XG4gICAgICAgICAgICB0aGlzLnNldEdlb0xvY2F0aW9uKHJlc3BvbnNlLmNvdW50cnlDb2RlLCByZXNwb25zZS5zdGF0ZUNvZGUpO1xuICAgICAgICAgICAgdGhpcy5hZGRCYW5uZXJTREtTY3JpcHQoZG9tYWluRGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyTG9jYXRpb24gPSB0aGlzLnJlYWRDb29raWVQYXJhbShvdFV0aWwub3B0YW5vbkNvb2tpZU5hbWUsIG90VXRpbC5nZW9sb2NhdGlvbkNvb2tpZXNQYXJhbSk7XG4gICAgICAgICAgICBpZiAodXNlckxvY2F0aW9uIHx8IGRvbWFpbkRhdGEuU2tpcEdlb2xvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY291bnRyeSA9IHVzZXJMb2NhdGlvbi5zcGxpdCgnOycpWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gdXNlckxvY2F0aW9uLnNwbGl0KCc7JylbMV07XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRHZW9Mb2NhdGlvbihjb3VudHJ5LCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRCYW5uZXJTREtTY3JpcHQoZG9tYWluRGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0R2VvTG9jYXRpb24oZG9tYWluRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRHZW9sb2NhdGlvblVSTChkb21haW5EYXRhOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHtvdFV0aWwuc3R1YlNjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKS5zcGxpdChvdFV0aWwuc3R1YkZpbGVOYW1lKVswXX0ke2RvbWFpbkRhdGEuVmVyc2lvbn1gO1xuICAgICAgICBpZiAobmV3IFJlZ0V4cCgnXmZpbGU6Ly8nLCAnaScpLnRlc3QodXJsKSAmJiBkb21haW5EYXRhLk1vYmlsZVNESykge1xuICAgICAgICAgICAgcmV0dXJuIGAuLyR7ZG9tYWluRGF0YS5HZW9sb2NhdGlvblVybC5yZXBsYWNlKC9eKGh0dHB8aHR0cHMpOlxcL1xcLy8sICcnKS5zcGxpdCgnLycpLnNsaWNlKDEpLmpvaW4oJy8nKX0uanNgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRvbWFpbkRhdGEuR2VvbG9jYXRpb25Vcmw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRHZW9Mb2NhdGlvbihkb21haW5EYXRhOiBhbnkpIHtcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLmpzb25GZWVkID0gKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRHZW9Mb2NhdGlvbihkYXRhLmNvdW50cnksIGRhdGEuc3RhdGUpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmpzb25wKHRoaXMuZ2V0R2VvbG9jYXRpb25VUkwoZG9tYWluRGF0YSksIHRoaXMuYWRkQmFubmVyU0RLU2NyaXB0LmJpbmQodGhpcywgZG9tYWluRGF0YSkpO1xuICAgIH07XG5cbiAgICAvLyBzZXQgR2VvIGxvY2F0aW9uXG4gICAgc2V0R2VvTG9jYXRpb24oY291bnRyeTogc3RyaW5nLCBzdGF0ZTogc3RyaW5nID0gJycpOiB2b2lkIHtcbiAgICAgICAgb3RVdGlsLnVzZXJMb2NhdGlvbiA9IHtcbiAgICAgICAgICAgIGNvdW50cnk6IGNvdW50cnksXG4gICAgICAgICAgICBzdGF0ZTogc3RhdGVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhZGRCYW5uZXJTREtTY3JpcHQgPSAoZG9tYWluRGF0YTogYW55KSA9PiB7XG4gICAgICAgIC8vIFRPRE86IGJlbG93IGNoZWNrKG9ubHkpIHRvIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgcmVsZWFzZVxuICAgICAgICBsZXQgcmVnaW9uUnVsZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmlhYlR5cGVBZGRlZCkge1xuICAgICAgICAgICAgcmVnaW9uUnVsZSA9IHRoaXMuZ2V0UmVnaW9uU2V0KGRvbWFpbkRhdGEpOyAvLyBGaW5kIHRoZSBhcHBsaWNhYmxlIHJ1bGVcbiAgICAgICAgICAgIGlmIChyZWdpb25SdWxlLlR5cGUgPT09ICdJQUInIHx8IHJlZ2lvblJ1bGUuVHlwZSA9PT0gJ0lBQjInKSB7ICAvLyBJbml0aWFsaXplIHN0dWIgb25seSBpZiBJQUIgaXMgZW5hYmxlZFxuICAgICAgICAgICAgICAgIHRoaXMuaWFiVHlwZSA9IHJlZ2lvblJ1bGUuVHlwZTtcbiAgICAgICAgICAgICAgICB0aGlzLmludGlhbGl6ZUlhYlN0dWIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgc3R1YkVsZW1lbnQ6IEhUTUxTY3JpcHRFbGVtZW50ID0gb3RVdGlsLnN0dWJTY3JpcHRFbGVtZW50LmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MU2NyaXB0RWxlbWVudDtcbiAgICAgICAgbGV0IGJhbm5lclNjcmlwdFVSTCA9ICcnO1xuICAgICAgICBpZiAoZG9tYWluRGF0YS5Vc2VTREtSZWZhY3RvcikgeyAvLyBXd2hlbiByZWZhY3RvciBmZWF0dXJlIHBhY2sgaXMgZW5hYmxlZFxuICAgICAgICAgICAgaWYgKG90VXRpbC5pc01pZ3JhdGVkVVJMKSB7XG4gICAgICAgICAgICAgICAgc3R1YkVsZW1lbnQuc3JjID0gYCR7b3RVdGlsLnN0b3JhZ2VCYXNlVVJMfS9zY3JpcHR0ZW1wbGF0ZXMvbmV3L3NjcmlwdHRlbXBsYXRlcy8ke290VXRpbC5zdHViRmlsZU5hbWV9LmpzYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJhbm5lclNjcmlwdFVSTCA9IGAke290VXRpbC5zdG9yYWdlQmFzZVVSTH0vc2NyaXB0dGVtcGxhdGVzL25ldy9zY3JpcHR0ZW1wbGF0ZXMvJHtkb21haW5EYXRhLlZlcnNpb259LyR7b3RVdGlsLmJhbm5lclNjcmlwdE5hbWV9YDtcbiAgICAgICAgfSBlbHNlIGlmIChkb21haW5EYXRhLlZlcnNpb24gPT09ICc1LjExLjAnKSB7IC8vIFdoZW4gcmVmZWFjdG9yIGZlYXR1cmUgcGFjayBpcyBub3QgZW5hYmxlZCBhbmQgT25seSBmb3IgNS4xMSByZWxlYXNlIHNjcml0cHNcbiAgICAgICAgICAgIGlmIChvdFV0aWwuaXNNaWdyYXRlZFVSTCkge1xuICAgICAgICAgICAgICAgIHN0dWJFbGVtZW50LnNyYyA9IGAke290VXRpbC5zdG9yYWdlQmFzZVVSTH0vc2NyaXB0dGVtcGxhdGVzL29sZC9zY3JpcHR0ZW1wbGF0ZXMvJHtvdFV0aWwuc3R1YkZpbGVOYW1lfS5qc2A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiYW5uZXJTY3JpcHRVUkwgPSBgJHtvdFV0aWwuc3RvcmFnZUJhc2VVUkx9L3NjcmlwdHRlbXBsYXRlcy9vbGQvc2NyaXB0dGVtcGxhdGVzLzUuMTEuMC8ke290VXRpbC5iYW5uZXJTY3JpcHROYW1lfWA7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZvciBhbGwgcmVsZWFzZXMgZXhjZXB0IDUuMTEgXG4gICAgICAgICAgICBpZiAob3RVdGlsLmlzTWlncmF0ZWRVUkwpIHtcbiAgICAgICAgICAgICAgICBzdHViRWxlbWVudC5zcmMgPSBgJHtvdFV0aWwuc3RvcmFnZUJhc2VVUkx9L3NjcmlwdHRlbXBsYXRlcy8ke290VXRpbC5zdHViRmlsZU5hbWV9LmpzYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJhbm5lclNjcmlwdFVSTCA9IGAke290VXRpbC5zdG9yYWdlQmFzZVVSTH0vc2NyaXB0dGVtcGxhdGVzLyR7ZG9tYWluRGF0YS5WZXJzaW9ufS8ke290VXRpbC5iYW5uZXJTY3JpcHROYW1lfWA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXR0ckFyciA9IFsnY2hhcnNldCcsICdkYXRhLWxhbmd1YWdlJywgJ2RhdGEtZG9tYWluLXNjcmlwdCddO1xuICAgICAgICBhdHRyQXJyLmZvckVhY2goKGF0dHI6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKG90VXRpbC5zdHViU2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICAgICAgICAgICAgICBzdHViRWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgICAgIGF0dHIsXG4gICAgICAgICAgICAgICAgICAgIG90VXRpbC5zdHViU2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cilcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLm90U3R1YkRhdGEgPSB7XG4gICAgICAgICAgICBkb21haW5EYXRhOiBkb21haW5EYXRhLFxuICAgICAgICAgICAgc3R1YkVsZW1lbnQ6IHN0dWJFbGVtZW50LFxuICAgICAgICAgICAgYmFubmVyQmFzZURhdGFVUkw6IG90VXRpbC5iYW5uZXJCYXNlRGF0YVVSTCxcbiAgICAgICAgICAgIG1vYmlsZU9ubGluZVVSTDogb3RVdGlsLm1vYmlsZU9ubGluZVVSTCxcbiAgICAgICAgICAgIHVzZXJMb2NhdGlvbjogb3RVdGlsLnVzZXJMb2NhdGlvbixcbiAgICAgICAgICAgIHJlZ2lvblJ1bGU6IHJlZ2lvblJ1bGVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5qc29ucChiYW5uZXJTY3JpcHRVUkwsIG51bGwpO1xuICAgIH07XG5cbiAgICBvdEZldGNoKHVybDogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgaWYgKG5ldyBSZWdFeHAoJ15maWxlOi8vJywgJ2knKS50ZXN0KHVybCkpIHtcbiAgICAgICAgICAgIHRoaXMub3RGZXRjaE9mZmxpbmVGaWxlKHVybCwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3RVdGlsLm1vYmlsZU9ubGluZVVSTC5wdXNoKHVybCk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvdEZldGNoT2ZmbGluZUZpbGUodXJsOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgnLmpzb24nLCAnLmpzJyk7XG4gICAgICAgIGNvbnN0IHVybFBhdGggPSB1cmwuc3BsaXQoJy8nKTtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSB1cmxQYXRoW3VybFBhdGgubGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpbGVPYmplY3QgPSBmaWxlTmFtZS5zcGxpdCgnLmpzJylbMF07XG4gICAgICAgIGNvbnN0IFByb21pc2VSZXNvbHZlID0gKCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soKHdpbmRvdyBhcyBhbnkpW2ZpbGVPYmplY3RdKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5qc29ucCh1cmwsIFByb21pc2VSZXNvbHZlKTtcbiAgICB9XG5cbiAgICBqc29ucCh1cmw6IHN0cmluZywgY2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgICAgICBjb25zdCBiYW5uZXJTY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgYmFubmVyU2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKTtcbiAgICAgICAgYmFubmVyU2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgYmFubmVyU2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChiYW5uZXJTY3JpcHQpO1xuICAgICAgICBpZiAoIW5ldyBSZWdFeHAoJ15maWxlOi8vJywgJ2knKS50ZXN0KHVybCkpIHtcbiAgICAgICAgICAgIG90VXRpbC5tb2JpbGVPbmxpbmVVUkwucHVzaCh1cmwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgKGJhbm5lclNjcmlwdCBhcyBhbnkpLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFJlZ2lvblNldChyZXNwb25zZURvbWFpbkRhdGE6IGFueSkge1xuICAgICAgICBsZXQgY291bnRyeVJlZ2lvblJ1bGU6IFJlZ2lvblJ1bGVNYXBwaW5nO1xuICAgICAgICBsZXQgc3RhdGVSZWdpb25SdWxlOiBSZWdpb25SdWxlTWFwcGluZztcbiAgICAgICAgbGV0IGdsb2JhbFJlZ2lvblJ1bGU6IFJlZ2lvblJ1bGVNYXBwaW5nO1xuICAgICAgICBjb25zdCB1c2VyTG9jYXRpb24gPSBvdFV0aWwudXNlckxvY2F0aW9uO1xuICAgICAgICBjb25zdCBkZWZhdWx0UnVsZTogQXJyYXk8UmVnaW9uUnVsZU1hcHBpbmc+ID0gcmVzcG9uc2VEb21haW5EYXRhLlxuICAgICAgICAgICAgUnVsZVNldC5maWx0ZXIoKHJ1bGVTZXQ6IFJlZ2lvblJ1bGVNYXBwaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJ1bGVTZXQuRGVmYXVsdCA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBpZiAoIXVzZXJMb2NhdGlvbi5jb3VudHJ5ICYmICF1c2VyTG9jYXRpb24uc3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0UnVsZSAmJiBkZWZhdWx0UnVsZS5sZW5ndGggPiAwID8gZGVmYXVsdFJ1bGVbMF0gOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXNlclN0YXRlID0gdXNlckxvY2F0aW9uLnN0YXRlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCB1c2VyQ291bnRyeSA9IHVzZXJMb2NhdGlvbi5jb3VudHJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IChyZXNwb25zZURvbWFpbkRhdGEuUnVsZVNldCBhcyBBcnJheTxSZWdpb25SdWxlTWFwcGluZz4pLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKChyZXNwb25zZURvbWFpbkRhdGEuUnVsZVNldFtpXSBhcyBSZWdpb25SdWxlTWFwcGluZykuR2xvYmFsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbFJlZ2lvblJ1bGUgPSByZXNwb25zZURvbWFpbkRhdGEuUnVsZVNldFtpXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZXMgPSByZXNwb25zZURvbWFpbkRhdGEuUnVsZVNldFtpXS5TdGF0ZXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZXNbdXNlckNvdW50cnldICYmIHN0YXRlc1t1c2VyQ291bnRyeV0uaW5kZXhPZih1c2VyU3RhdGUpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUmVnaW9uUnVsZSA9IHJlc3BvbnNlRG9tYWluRGF0YS5SdWxlU2V0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2VEb21haW5EYXRhLlJ1bGVTZXRbaV0uQ291bnRyaWVzLmluZGV4T2YodXNlckNvdW50cnkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50cnlSZWdpb25SdWxlID0gcmVzcG9uc2VEb21haW5EYXRhLlJ1bGVTZXRbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlUmVnaW9uUnVsZSB8fCBjb3VudHJ5UmVnaW9uUnVsZSB8fCBnbG9iYWxSZWdpb25SdWxlO1xuICAgIH1cblxuICAgIGVuc3VyZUh0bWxHcm91cERhdGFJbml0aWFsaXNlZCgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplSUFCRGF0YSgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVHcm91cERhdGEoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplR3JvdXBEYXRhKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkQ29va2llUGFyYW0ob3RVdGlsLm9wdGFub25Db29raWVOYW1lLCAnZ3JvdXBzJykpIHtcbiAgICAgICAgICAgIG90VXRpbC5vcHRhbm9uSHRtbEdyb3VwRGF0YSA9IHRoaXMuZGVzZXJpYWxpc2VTdHJpbmdUb0FycmF5KFxuICAgICAgICAgICAgICAgIHRoaXMucmVhZENvb2tpZVBhcmFtKG90VXRpbC5vcHRhbm9uQ29va2llTmFtZSwgJ2dyb3VwcycpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUlBQkRhdGEoKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVJQUJHRFBSQXBwbGllZCgpO1xuICAgICAgICB0aGlzLnZhbGlkYXRlSUFCR2xvYmFsU2NvcGUoKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZUlBQkdsb2JhbFNjb3BlKCkge1xuICAgICAgICBjb25zdCBpc0lhYlRoaXJkUGFydHlDb29raWVFbmFibGVkID0gdGhpcy5yZWFkQ29va2llUGFyYW0oXG4gICAgICAgICAgICBvdFV0aWwub3B0YW5vbkNvb2tpZU5hbWUsXG4gICAgICAgICAgICBvdFV0aWwub25lVHJ1c3RJc0lBQkNyb3NzQ29uc2VudEVuYWJsZVBhcmFtXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGlzSWFiVGhpcmRQYXJ0eUNvb2tpZUVuYWJsZWQpIHtcbiAgICAgICAgICAgIGlmIChpc0lhYlRoaXJkUGFydHlDb29raWVFbmFibGVkID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICBvdFV0aWwuaGFzSUFCR2xvYmFsU2NvcGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG90VXRpbC5pc1N0dWJSZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdFV0aWwuaGFzSUFCR2xvYmFsU2NvcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBvdFV0aWwuSUFCQ29va2llVmFsdWUgPSB0aGlzLmdldENvb2tpZShvdFV0aWwub25lVHJ1c3RJQUJDb29raWVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG90VXRpbC5pc1N0dWJSZWFkeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVJQUJHRFBSQXBwbGllZCgpIHtcbiAgICAgICAgY29uc3QgZ2VvbG9jYXRpb24gPSB0aGlzLnJlYWRDb29raWVQYXJhbShcbiAgICAgICAgICAgIG90VXRpbC5vcHRhbm9uQ29va2llTmFtZSxcbiAgICAgICAgICAgIG90VXRpbC5nZW9sb2NhdGlvbkNvb2tpZXNQYXJhbVxuICAgICAgICApLnNwbGl0KCc7JylbMF07XG4gICAgICAgIGlmIChnZW9sb2NhdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNCb29sZWFuKGdlb2xvY2F0aW9uKSkgeyAvLyBUbyBoYW5kbGUgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBmb3Igb2xkIHdvcmtmbG93IHNjcmlwdHNcbiAgICAgICAgICAgICAgICBvdFV0aWwub25lVHJ1c3RJQUJnZHByQXBwbGllc0dsb2JhbGx5ID0gZ2VvbG9jYXRpb24gPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3RVdGlsLm9uZVRydXN0SUFCZ2RwckFwcGxpZXNHbG9iYWxseSA9IG90VXRpbC5FVUNPVU5UUklFUy5pbmRleE9mKGdlb2xvY2F0aW9uKSA+PSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3RVdGlsLmlzU3R1YlJlYWR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0Jvb2xlYW4oZ2VvbG9jYXRpb246IHN0cmluZykge1xuICAgICAgICBpZiAoZ2VvbG9jYXRpb24gPT09ICd0cnVlJyB8fCBnZW9sb2NhdGlvbiA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWFkQ29va2llUGFyYW0oY29va2llTmFtZTogc3RyaW5nLCBwYXJhbU5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBjb29raWUgPSB0aGlzLmdldENvb2tpZShjb29raWVOYW1lKTtcbiAgICAgICAgbGV0IGksIGRhdGE6IGFueSwgdmFsdWVzLCBwYWlyO1xuICAgICAgICBpZiAoY29va2llKSB7XG4gICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgICAgICB2YWx1ZXMgPSBjb29raWUuc3BsaXQoJyYnKTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBwYWlyID0gdmFsdWVzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICAgICAgZGF0YVtkZWNvZGVVUklDb21wb25lbnQocGFpclswXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgIC9cXCsvZyxcbiAgICAgICAgICAgICAgICAgICAgJyAnXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbU5hbWUgJiYgZGF0YVtwYXJhbU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFbcGFyYW1OYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbU5hbWUgJiYgIWRhdGFbcGFyYW1OYW1lXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgZ2V0Q29va2llKG5hbWU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBuYW1lRXEgPSBuYW1lICsgJz0nO1xuICAgICAgICBjb25zdCBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICBsZXQgaSwgYztcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjID0gY2FbaV07XG4gICAgICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjLmluZGV4T2YobmFtZUVxKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFcS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdXBkYXRlR3RtTWFjcm9zKCkge1xuICAgICAgICBjb25zdCBndG1PcHRhbm9uQWN0aXZlR3JvdXBzOiBhbnlbXSA9IFtdO1xuICAgICAgICBsZXQgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG90VXRpbC5vcHRhbm9uSHRtbEdyb3VwRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW5kc1dpdGgob3RVdGlsLm9wdGFub25IdG1sR3JvdXBEYXRhW2ldLCAnOjEnKSkge1xuICAgICAgICAgICAgICAgIGd0bU9wdGFub25BY3RpdmVHcm91cHMucHVzaChvdFV0aWwub3B0YW5vbkh0bWxHcm91cERhdGFbaV0ucmVwbGFjZSgnOjEnLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZUFycmF5U3RyaW5nID0gJywnICsgdGhpcy5zZXJpYWxpc2VBcnJheVRvU3RyaW5nKGd0bU9wdGFub25BY3RpdmVHcm91cHMpICsgJywnO1xuICAgICAgICAod2luZG93IGFzIGFueSkuT25ldHJ1c3RBY3RpdmVHcm91cHMgPSBzZXJpYWxpemVBcnJheVN0cmluZztcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLk9wdGFub25BY3RpdmVHcm91cHMgPSBzZXJpYWxpemVBcnJheVN0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93IGFzIGFueSkuZGF0YUxheWVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKCh3aW5kb3cgYXMgYW55KS5kYXRhTGF5ZXIuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICAgICAgKHdpbmRvdyBhcyBhbnkpLmRhdGFMYXllci5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgT25ldHJ1c3RBY3RpdmVHcm91cHM6IHNlcmlhbGl6ZUFycmF5U3RyaW5nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgKHdpbmRvdyBhcyBhbnkpLmRhdGFMYXllci5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgT3B0YW5vbkFjdGl2ZUdyb3Vwczogc2VyaWFsaXplQXJyYXlTdHJpbmdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICh3aW5kb3cgYXMgYW55KS5kYXRhTGF5ZXIgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBldmVudDogJ09uZVRydXN0TG9hZGVkJyxcbiAgICAgICAgICAgICAgICAgICAgT25ldHJ1c3RBY3RpdmVHcm91cHM6IHNlcmlhbGl6ZUFycmF5U3RyaW5nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiAnT3B0YW5vbkxvYWRlZCcsXG4gICAgICAgICAgICAgICAgICAgIE9wdGFub25BY3RpdmVHcm91cHM6IHNlcmlhbGl6ZUFycmF5U3RyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCdjb25zZW50Lm9uZXRydXN0Jywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogZ3RtT3B0YW5vbkFjdGl2ZUdyb3Vwc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkZXNlcmlhbGlzZVN0cmluZ1RvQXJyYXkoY29va2llR3JvdXBzU3RyaW5nOiB7XG4gICAgICAgIHNwbGl0OiAoYXJnMDogc3RyaW5nKSA9PiB2b2lkO1xuICAgIH0pOiBhbnkge1xuICAgICAgICBpZiAoIWNvb2tpZUdyb3Vwc1N0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb29raWVHcm91cHNTdHJpbmcuc3BsaXQoJywnKTtcbiAgICB9XG4gICAgZW5kc1dpdGgoXG4gICAgICAgIHN0cjogeyBpbmRleE9mOiAoYXJnMDogYW55LCBhcmcxOiBudW1iZXIpID0+IG51bWJlcjsgbGVuZ3RoOiBudW1iZXIgfSxcbiAgICAgICAgc3VmZml4OiBzdHJpbmdcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIHN0ci5pbmRleE9mKHN1ZmZpeCwgc3RyLmxlbmd0aCAtIHN1ZmZpeC5sZW5ndGgpICE9PSAtMTtcbiAgICB9XG4gICAgc2VyaWFsaXNlQXJyYXlUb1N0cmluZyhjb29raWVHcm91cHNBcnJheTogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIGNvb2tpZUdyb3Vwc0FycmF5LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgc2V0U3R1YlNjcmlwdEVsZW1lbnQoKSB7XG4gICAgICAgIG90VXRpbC5zdHViU2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdFtzcmMqPScke290VXRpbC5zdHViRmlsZU5hbWV9J11gKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgb3RVdGlsLnN0dWJTY3JpcHRFbGVtZW50ICYmXG4gICAgICAgICAgICBvdFV0aWwuc3R1YlNjcmlwdEVsZW1lbnQuaGFzQXR0cmlidXRlKG90VXRpbC5EQVRBRklMRUFUVFJJQlVURSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBvdFV0aWwuZG9tYWluRGF0YUZpbGVOYW1lID0gb3RVdGlsLnN0dWJTY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZShvdFV0aWwuREFUQUZJTEVBVFRSSUJVVEUpLnRyaW0oKTtcbiAgICAgICAgfSBlbHNlIGlmICghb3RVdGlsLnN0dWJTY3JpcHRFbGVtZW50KSB7XG4gICAgICAgICAgICBvdFV0aWwuc3R1YlNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHRbc3JjKj0nJHtvdFV0aWwubWlncmF0ZWRDQ1RJRH0nXWApO1xuICAgICAgICAgICAgaWYgKG90VXRpbC5zdHViU2NyaXB0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIG90VXRpbC5pc01pZ3JhdGVkVVJMID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBvdFV0aWwuZG9tYWluRGF0YUZpbGVOYW1lID0gb3RVdGlsLm1pZ3JhdGVkRG9tYWluSWQudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RG9tYWluRGF0YUZpbGVVUkwoKSB7XG4gICAgICAgIHRoaXMuc2V0U3R1YlNjcmlwdEVsZW1lbnQoKTtcbiAgICAgICAgY29uc3Qgc3R1YlNjcmlwdFVSTCA9IG90VXRpbC5zdHViU2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgICBpZiAoc3R1YlNjcmlwdFVSTCkge1xuICAgICAgICAgICAgaWYgKCFvdFV0aWwuaXNNaWdyYXRlZFVSTCkge1xuICAgICAgICAgICAgICAgIG90VXRpbC5zdG9yYWdlQmFzZVVSTCA9IHN0dWJTY3JpcHRVUkwuc3BsaXQoYC9zY3JpcHR0ZW1wbGF0ZXMvJHtvdFV0aWwuc3R1YkZpbGVOYW1lfWApWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdFV0aWwuc3RvcmFnZUJhc2VVUkwgPSBzdHViU2NyaXB0VVJMLnNwbGl0KGAvY29uc2VudC8ke290VXRpbC5taWdyYXRlZENDVElEfWApWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG90VXRpbC5iYW5uZXJCYXNlRGF0YVVSTCA9IG90VXRpbC5zdG9yYWdlQmFzZVVSTFxuICAgICAgICAgICAgJiYgYCR7b3RVdGlsLnN0b3JhZ2VCYXNlVVJMfS9jb25zZW50LyR7b3RVdGlsLmRvbWFpbkRhdGFGaWxlTmFtZX1gO1xuICAgICAgICBvdFV0aWwuYmFubmVyRGF0YVBhcmVudFVSTCA9IGAke290VXRpbC5iYW5uZXJCYXNlRGF0YVVSTH0vJHtvdFV0aWwuZG9tYWluRGF0YUZpbGVOYW1lfS5qc29uYDtcbiAgICB9XG5cbiAgICBpbml0Q3VzdG9tRXZlbnRQb2x5ZmlsbCgpOiBhbnkgfCB2b2lkIHtcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93IGFzIGFueSkuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gSWYgQ3VzdG9tRXZlbnQgc3VwcG9ydGVkIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50OiBhbnksIHBhcmFtczogYW55KSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge1xuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRldGFpbDogdW5kZWZpbmVkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgICAgICBldnQuaW5pdEN1c3RvbUV2ZW50KFxuICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgIHBhcmFtcy5idWJibGVzLFxuICAgICAgICAgICAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLFxuICAgICAgICAgICAgICAgIHBhcmFtcy5kZXRhaWxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZXZ0O1xuICAgICAgICB9XG4gICAgICAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9ICh3aW5kb3cgYXMgYW55KS5FdmVudC5wcm90b3R5cGU7XG4gICAgICAgICh3aW5kb3cgYXMgYW55KS5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xuICAgIH1cblxuICAgIC8vIElBQiBTdHViXG4gICAgaW50aWFsaXplSWFiU3R1YiA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2luID0gd2luZG93IGFzIGFueTtcbiAgICAgICAgaWYgKHRoaXMuaWFiVHlwZUFkZGVkKSB7XG4gICAgICAgICAgICBsZXQgc3R1YlR5cGUgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHRoaXMuaWFiVHlwZSA9PT0gJ0lBQicpIHtcbiAgICAgICAgICAgICAgICAod2luZG93IGFzIGFueSkuX19jbXAgPSB0aGlzLmV4ZWN1dGVDbXBBcGk7XG4gICAgICAgICAgICAgICAgc3R1YlR5cGUgPSAnX19jbXAnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAod2luZG93IGFzIGFueSkuX190Y2ZhcGkgPSB0aGlzLmV4ZWN1dGVUY2ZBcGk7XG4gICAgICAgICAgICAgICAgc3R1YlR5cGUgPSAnX190Y2ZhcGknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5bc3R1YlR5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB3aW5bc3R1YlR5cGVdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFkZElhYkZyYW1lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbHNlIGJsb2NrIHRvIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgcmVsZWFzZVxuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQmFja3dhcmRTdHViKCk7XG4gICAgICAgICAgICB0aGlzLmFkZEJhY2t3YXJkSWFiRnJhbWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbi5yZWNlaXZlT1RNZXNzYWdlID0gdGhpcy5yZWNlaXZlSWFiTWVzc2FnZTtcbiAgICAgICAgY29uc3QgbGlzdGVuID0gd2luLmF0dGFjaEV2ZW50IHx8IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyO1xuICAgICAgICBsaXN0ZW4oJ21lc3NhZ2UnLCB3aW4ucmVjZWl2ZU9UTWVzc2FnZSwgZmFsc2UpO1xuICAgIH07XG5cbiAgICBpbml0aWFsaXplQmFja3dhcmRTdHViID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB3aW4gPSB3aW5kb3cgYXMgYW55O1xuICAgICAgICAvLyBDTVBcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5bJ19fY21wJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgd2luWydfX2NtcCddID0ge307XG4gICAgICAgIH1cbiAgICAgICAgLy8gVENGXG4gICAgICAgIGlmICh0eXBlb2Ygd2luWydfX3RjZmFwaSddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHdpblsnX190Y2ZhcGknXSA9IHt9O1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgYWRkSWFiRnJhbWUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHdpbiA9IHdpbmRvdyBhcyBhbnk7XG4gICAgICAgIGNvbnN0IGxvY2F0b3JOYW1lID0gdGhpcy5pYWJUeXBlID09PSAnSUFCJyA/ICdfX2NtcExvY2F0b3InIDogJ19fdGNmYXBpTG9jYXRvcic7XG4gICAgICAgIGNvbnN0IGxvY2F0b3JFeGlzdHMgPSAhIXdpbi5mcmFtZXNbbG9jYXRvck5hbWVdO1xuICAgICAgICBpZiAoIWxvY2F0b3JFeGlzdHMpIHtcbiAgICAgICAgICAgIGlmICh3aW4uZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTG9jYXRvcihsb2NhdG9yTmFtZSwgJ0NNUCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYWRkSWFiRnJhbWUsIDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9O1xuXG4gICAgYWRkQmFja3dhcmRJYWJGcmFtZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgd2luID0gd2luZG93IGFzIGFueTtcbiAgICAgICAgLy8gQ01QXG4gICAgICAgIGNvbnN0IGNtcExvY2F0b3JOYW1lID0gJ19fY21wTG9jYXRvcic7XG4gICAgICAgIGNvbnN0IGNtcExvY2F0b3JFeGlzdHMgPSAhIXdpbi5mcmFtZXNbY21wTG9jYXRvck5hbWVdO1xuICAgICAgICBpZiAoIWNtcExvY2F0b3JFeGlzdHMpIHtcbiAgICAgICAgICAgIGlmICh3aW4uZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTG9jYXRvcihjbXBMb2NhdG9yTmFtZSwgJ0NNUCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYWRkSWFiRnJhbWUsIDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVENGXG4gICAgICAgIGNvbnN0IHRjZkxvY2F0b3JOYW1lID0gJ19fdGNmYXBpTG9jYXRvcic7XG4gICAgICAgIGNvbnN0IHRjZkxvY2F0b3JFeGlzdHMgPSAhIXdpbi5mcmFtZXNbdGNmTG9jYXRvck5hbWVdO1xuICAgICAgICBpZiAoIXRjZkxvY2F0b3JFeGlzdHMpIHtcbiAgICAgICAgICAgIGlmICh3aW4uZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTG9jYXRvcih0Y2ZMb2NhdG9yTmFtZSwgJ1RDRicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYWRkSWFiRnJhbWUsIDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9O1xuXG4gICAgYWRkTG9jYXRvciA9IChsb2NhdG9yTmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IHdpbiA9IHdpbmRvdyBhcyBhbnk7XG4gICAgICAgIGNvbnN0IGlmcmFtZSA9IHdpbi5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgaWZyYW1lLnN0eWxlLmNzc1RleHQgPSAnZGlzcGxheTpub25lJztcbiAgICAgICAgaWZyYW1lLm5hbWUgPSBsb2NhdG9yTmFtZTtcbiAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBgJHt0aXRsZX0gTG9jYXRvcmApO1xuICAgICAgICB3aW4uZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgIH07XG5cbiAgICByZWNlaXZlSWFiTWVzc2FnZSA9IChldmVudDogeyBkYXRhOiBhbnk7IG9yaWdpbjogYW55OyBzb3VyY2U6IGFueSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IG1zZ0lzU3RyaW5nID0gdHlwZW9mIGV2ZW50LmRhdGEgPT09ICdzdHJpbmcnO1xuICAgICAgICBsZXQgZGF0YTogYW55ID0ge307XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAobXNnSXNTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkgeyB9XG5cbiAgICAgICAgLy8gQ01QXG4gICAgICAgIGlmIChkYXRhLl9fY21wQ2FsbCAmJiB0aGlzLmlhYlR5cGUgPT09ICdJQUInKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsSWQgPSBkYXRhLl9fY21wQ2FsbC5jYWxsSWQsXG4gICAgICAgICAgICAgICAgY29tbWFuZCA9IGRhdGEuX19jbXBDYWxsLmNvbW1hbmQsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyID0gZGF0YS5fX2NtcENhbGwucGFyYW1ldGVyO1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQ21wQXBpKGNvbW1hbmQsIHBhcmFtZXRlciwgZnVuY3Rpb24gKFxuICAgICAgICAgICAgICAgIHJldHVyblZhbHVlOiBhbnksXG4gICAgICAgICAgICAgICAgc3VjY2VzczogYW55XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuTXNnID0ge1xuICAgICAgICAgICAgICAgICAgICBfX2NtcFJldHVybjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBldmVudC5zb3VyY2UucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgIG1zZ0lzU3RyaW5nID8gSlNPTi5zdHJpbmdpZnkocmV0dXJuTXNnKSA6IHJldHVybk1zZyxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQub3JpZ2luXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuX19jbXBDYWxsICYmIHRoaXMuaWFiVHlwZSA9PT0gJ0lBQjInKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXhwZWN0aW5nIElBQiBUQ0YgdjIuMCB2ZW5kb3IgaUZyYW1lIGNhbGw7IFJlY2VpdmVkIElBQiBUQ0YgdjEuMScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVENGXG4gICAgICAgIGlmIChkYXRhLl9fdGNmYXBpQ2FsbCAmJiB0aGlzLmlhYlR5cGUgPT09ICdJQUIyJykge1xuICAgICAgICAgICAgY29uc3QgY2FsbElkID0gZGF0YS5fX3RjZmFwaUNhbGwuY2FsbElkLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBkYXRhLl9fdGNmYXBpQ2FsbC5jb21tYW5kLFxuICAgICAgICAgICAgICAgIHBhcmFtZXRlciA9IGRhdGEuX190Y2ZhcGlDYWxsLnBhcmFtZXRlcixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gZGF0YS5fX3RjZmFwaUNhbGwudmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZVRjZkFwaShcbiAgICAgICAgICAgICAgICBjb21tYW5kLFxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmV0dXJuVmFsdWU6IGFueSwgc3VjY2VzczogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXR1cm5Nc2cgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfX3RjZmFwaVJldHVybjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLnBvc3RNZXNzYWdlKFxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnSXNTdHJpbmcgPyBKU09OLnN0cmluZ2lmeShyZXR1cm5Nc2cpIDogcmV0dXJuTXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQub3JpZ2luXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2ZXJzaW9uXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuX190Y2ZhcGlDYWxsICYmIHRoaXMuaWFiVHlwZSA9PT0gJ0lBQicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFeHBlY3RpbmcgSUFCIFRDRiB2MS4xIHZlbmRvciBpRnJhbWUgY2FsbDsgUmVjZWl2ZWQgSUFCIFRDRiB2Mi4wJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhlY3V0ZUNtcEFwaSA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICB0aGlzLmlhYlR5cGUgPSAnSUFCJztcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBhcmdzWzBdLFxuICAgICAgICAgICAgcGFyYW1ldGVyID0gYXJnc1sxXSxcbiAgICAgICAgICAgIGNhbGxiYWNrID0gYXJnc1syXTtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyAmJiBjb21tYW5kKSB7XG4gICAgICAgICAgICBpZiAob3RVdGlsLmlzU3R1YlJlYWR5ICYmIG90VXRpbC5JQUJDb29raWVWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdwaW5nJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGluZ1JlcXVlc3QoY2FsbGJhY2ssIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2dldENvbnNlbnREYXRhJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29uc2VudERhdGFSZXF1ZXN0KGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRUb1F1ZXVlKGNvbW1hbmQsIHBhcmFtZXRlciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvUXVldWUoY29tbWFuZCwgcGFyYW1ldGVyLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZXhlY3V0ZVRjZkFwaSA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICB0aGlzLmlhYlR5cGUgPSAnSUFCMic7XG4gICAgICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSlbJ19fdGNmYXBpJ10uYTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29tbWFuZCA9IGFyZ3NbMF0sXG4gICAgICAgICAgICBwYXJhbWV0ZXIgPSBhcmdzWzFdLFxuICAgICAgICAgICAgY2FsbGJhY2sgPSBhcmdzWzJdLFxuICAgICAgICAgICAgdmVyc2lvbiA9IGFyZ3NbM107XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgJiYgY29tbWFuZCkge1xuICAgICAgICAgICAgaWYgKG90VXRpbC5pc1N0dWJSZWFkeSAmJiBvdFV0aWwuSUFCQ29va2llVmFsdWUgJiYgY29tbWFuZCA9PT0gJ3BpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRQaW5nUmVxdWVzdChjYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG9RdWV1ZShjb21tYW5kLCBwYXJhbWV0ZXIsIGNhbGxiYWNrLCB2ZXJzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDTVAgOiBjb21tYW5kLCBwYXJhbWV0ZXIsIGNhbGxiYWNrXG4gICAgLy8gVENGOiBjb21tYW5kLCB2ZXJzaW9uLCBjYWxsYmFjaywgcGFyYW1ldGVyXG4gICAgLy8gRm9yIGJhY2t3YXJkIGNvcGF0YWJpbGl0eSBhcHBlbmRpbmcgdmVyc2lvbiBhdCB0aGUgZW5kIGFuZCByZXRhaW5pbmcgdGhlIHByZXZpb3VzIGFyZ3VtZW50cyBvcmRlclxuICAgIC8vIFNhbWUgb3JkZXIgaXMgZXZhbHVhdGVkIGluIHRoZSBtYWluIHNjcmlwdC5ETyBOT1QgbW9kaWZ5IHRoaXMgYXJndW1lbnQgb3JkZXJcbiAgICBhZGRUb1F1ZXVlID0gKFxuICAgICAgICBjb21tYW5kOiBzdHJpbmcsXG4gICAgICAgIHBhcmFtZXRlcjogYW55LFxuICAgICAgICBjYWxsYmFjazogRnVuY3Rpb24sXG4gICAgICAgIHZlcnNpb24/OiBudW1iZXJcbiAgICApID0+IHtcbiAgICAgICAgY29uc3Qgd2luID0gd2luZG93IGFzIGFueTtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuaWFiVHlwZSA9PT0gJ0lBQicgPyAnX19jbXAnIDogJ19fdGNmYXBpJztcbiAgICAgICAgd2luW3R5cGVdLmEgPSB3aW5bdHlwZV0uYSB8fCBbXTtcbiAgICAgICAgaWYgKGNvbW1hbmQgPT09ICdwaW5nJykge1xuICAgICAgICAgICAgdGhpcy5nZXRQaW5nUmVxdWVzdChjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5bdHlwZV0uYS5wdXNoKFtjb21tYW5kLCBwYXJhbWV0ZXIsIGNhbGxiYWNrLCB2ZXJzaW9uXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQ01QLyBUQ0YgUGluZyByZXF1ZXN0XG4gICAgZ2V0UGluZ1JlcXVlc3QgPSAoY2FsbGJhY2s6IEZ1bmN0aW9uLCBpc0lhYkNvb2tpZVZhbHVlRXhpc3RzID0gZmFsc2UpID0+IHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBsZXQgcGluZ0RhdGE6IGFueSA9IHt9O1xuICAgICAgICAgICAgbGV0IGlzVmFsaWRDb21tYW5kID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5pYWJUeXBlID09PSAnSUFCJykge1xuICAgICAgICAgICAgICAgIHBpbmdEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBnZHByQXBwbGllc0dsb2JhbGx5OiBvdFV0aWwub25lVHJ1c3RJQUJnZHByQXBwbGllc0dsb2JhbGx5LFxuICAgICAgICAgICAgICAgICAgICBjbXBMb2FkZWQ6IGlzSWFiQ29va2llVmFsdWVFeGlzdHNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlzVmFsaWRDb21tYW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pYWJUeXBlID09PSAnSUFCMicpIHtcbiAgICAgICAgICAgICAgICBwaW5nRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ2RwckFwcGxpZXM6IG90VXRpbC5vbmVUcnVzdElBQmdkcHJBcHBsaWVzR2xvYmFsbHksXG4gICAgICAgICAgICAgICAgICAgIGNtcExvYWRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNtcFN0YXR1czogJ3N0dWInLFxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5U3RhdHVzOiAnc3R1YicsXG4gICAgICAgICAgICAgICAgICAgIGFwaVZlcnNpb246ICcyLjAnLFxuICAgICAgICAgICAgICAgICAgICBjbXBWZXJzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGNtcElkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGd2bFZlcnNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgdGNmUG9saWN5VmVyc2lvbjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpc1ZhbGlkQ29tbWFuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsYmFjayhwaW5nRGF0YSwgaXNWYWxpZENvbW1hbmQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIENNUCBnZXQgY29uc2VudCBkYXRhXG4gICAgZ2V0Q29uc2VudERhdGFSZXF1ZXN0ID0gKGNhbGxiYWNrOiBGdW5jdGlvbikgPT4ge1xuICAgICAgICBpZiAoY2FsbGJhY2sgJiYgb3RVdGlsLklBQkNvb2tpZVZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBjb25zZW50RGF0YSA9IHtcbiAgICAgICAgICAgICAgICBnZHByQXBwbGllczogb3RVdGlsLm9uZVRydXN0SUFCZ2RwckFwcGxpZXNHbG9iYWxseSxcbiAgICAgICAgICAgICAgICBoYXNHbG9iYWxTY29wZTogb3RVdGlsLmhhc0lBQkdsb2JhbFNjb3BlLFxuICAgICAgICAgICAgICAgIGNvbnNlbnREYXRhOiBvdFV0aWwuSUFCQ29va2llVmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYWxsYmFjayhjb25zZW50RGF0YSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgY29uc3Qgb3RTZGtTdHViID0gbmV3IE90U0RLU3R1YigpO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO1FBQUE7WUFDSSxzQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztZQUNyQyx5QkFBb0IsR0FBUSxFQUFFLENBQUM7WUFDL0IsbUJBQWMsR0FBRyxFQUFFLENBQUM7WUFDcEIsMEJBQXFCLEdBQUcsY0FBYyxDQUFDO1lBRXZDLHlDQUFvQyxHQUFHLGFBQWEsQ0FBQztZQUVyRCxnQkFBVyxHQUFHLElBQUksQ0FBQztZQUNuQiw0QkFBdUIsR0FBRyxhQUFhLENBQUM7WUFDeEMsZ0JBQVcsR0FBRztnQkFDVixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2FBQ1AsQ0FBQztZQUNGLGlCQUFZLEdBQUcsV0FBVyxDQUFDO1lBQzNCLHNCQUFpQixHQUFHLG9CQUFvQixDQUFDO1lBQ3pDLHFCQUFnQixHQUFHLGdCQUFnQixDQUFDO1lBQ3BDLG9CQUFlLEdBQWEsRUFBRSxDQUFDO1lBTS9CLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLGtCQUFhLEdBQUcsY0FBYyxDQUFDO1lBQy9CLHFCQUFnQixHQUFHLGlCQUFpQixDQUFDO1lBQ3JDLGlCQUFZLEdBQUc7Z0JBQ1gsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFLEVBQUU7YUFDWixDQUFDO1NBQ0w7UUFBRCxhQUFDO0lBQUQsQ0FBQyxJQUFBO0lBQ00sSUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQzs7O1FDdEQvQjtZQUFBLGlCQUVDO1lBTEQsWUFBTyxHQUFtQixJQUFJLENBQUM7WUFDL0IsaUJBQVksR0FBRyxJQUFJLENBQUM7WUFxRXBCLHVCQUFrQixHQUFHLFVBQUMsVUFBZTs7Z0JBRWpDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDdEIsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFO29CQUNuQixVQUFVLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTt3QkFDekQsS0FBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUMvQixLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztxQkFDM0I7aUJBQ0o7Z0JBQ0QsSUFBSSxXQUFXLEdBQXNCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFzQixDQUFDO2dCQUNuRyxJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLElBQUksVUFBVSxDQUFDLGNBQWMsRUFBRTtvQkFDM0IsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFO3dCQUN0QixXQUFXLENBQUMsR0FBRyxHQUFNLE1BQU0sQ0FBQyxjQUFjLDZDQUF3QyxNQUFNLENBQUMsWUFBWSxRQUFLLENBQUM7cUJBQzlHO29CQUNELGVBQWUsR0FBTSxNQUFNLENBQUMsY0FBYyw2Q0FBd0MsVUFBVSxDQUFDLE9BQU8sU0FBSSxNQUFNLENBQUMsZ0JBQWtCLENBQUM7aUJBQ3JJO3FCQUFNLElBQUksVUFBVSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7b0JBQ3hDLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRTt3QkFDdEIsV0FBVyxDQUFDLEdBQUcsR0FBTSxNQUFNLENBQUMsY0FBYyw2Q0FBd0MsTUFBTSxDQUFDLFlBQVksUUFBSyxDQUFDO3FCQUM5RztvQkFDRCxlQUFlLEdBQU0sTUFBTSxDQUFDLGNBQWMsb0RBQStDLE1BQU0sQ0FBQyxnQkFBa0IsQ0FBQztpQkFDdEg7cUJBQU07b0JBQ0gsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFO3dCQUN0QixXQUFXLENBQUMsR0FBRyxHQUFNLE1BQU0sQ0FBQyxjQUFjLHlCQUFvQixNQUFNLENBQUMsWUFBWSxRQUFLLENBQUM7cUJBQzFGO29CQUNELGVBQWUsR0FBTSxNQUFNLENBQUMsY0FBYyx5QkFBb0IsVUFBVSxDQUFDLE9BQU8sU0FBSSxNQUFNLENBQUMsZ0JBQWtCLENBQUM7aUJBQ2pIO2dCQUNELElBQU0sT0FBTyxHQUFHLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNuRSxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBWTtvQkFDekIsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUM3QyxXQUFXLENBQUMsWUFBWSxDQUNwQixJQUFJLEVBQ0osTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FDOUMsQ0FBQztxQkFDTDtpQkFDSixDQUFDLENBQUM7Z0JBQ0YsTUFBYyxDQUFDLFVBQVUsR0FBRztvQkFDekIsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLFdBQVcsRUFBRSxXQUFXO29CQUN4QixpQkFBaUIsRUFBRSxNQUFNLENBQUMsaUJBQWlCO29CQUMzQyxlQUFlLEVBQUUsTUFBTSxDQUFDLGVBQWU7b0JBQ3ZDLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtvQkFDakMsVUFBVSxFQUFFLFVBQVU7aUJBQ3pCLENBQUM7Z0JBQ0YsS0FBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDckMsQ0FBQzs7WUE2UkYscUJBQWdCLEdBQUc7Z0JBQ2YsSUFBTSxHQUFHLEdBQUcsTUFBYSxDQUFDO2dCQUMxQixJQUFJLEtBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ25CLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDcEIsSUFBSSxLQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRTt3QkFDdkIsTUFBYyxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDO3dCQUMzQyxRQUFRLEdBQUcsT0FBTyxDQUFDO3FCQUN0Qjt5QkFBTTt3QkFDRixNQUFjLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUM7d0JBQzlDLFFBQVEsR0FBRyxVQUFVLENBQUM7cUJBQ3pCO29CQUNELElBQUksT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO3dCQUNwQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO3FCQUN0QjtvQkFDRCxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7aUJBQ3RCO3FCQUFNOztvQkFFSCxLQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztvQkFDOUIsS0FBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7aUJBQzlCO2dCQUVELEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQzlDLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDO2dCQUMxRCxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNsRCxDQUFDO1lBRUYsMkJBQXNCLEdBQUc7Z0JBQ3JCLElBQU0sR0FBRyxHQUFHLE1BQWEsQ0FBQzs7Z0JBRTFCLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUNuQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNyQjs7Z0JBRUQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxTQUFTLEVBQUU7b0JBQ3RDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ3hCO2FBQ0osQ0FBQztZQUdGLGdCQUFXLEdBQUc7Z0JBQ1YsSUFBTSxHQUFHLEdBQUcsTUFBYSxDQUFDO2dCQUMxQixJQUFNLFdBQVcsR0FBRyxLQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssR0FBRyxjQUFjLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ2hGLElBQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUNoQixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO3dCQUNuQixLQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDdkM7eUJBQU07d0JBQ0gsVUFBVSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ25DO2lCQUNKO2dCQUNELE9BQU87YUFDVixDQUFDO1lBRUYsd0JBQW1CLEdBQUc7Z0JBQ2xCLElBQU0sR0FBRyxHQUFHLE1BQWEsQ0FBQzs7Z0JBRTFCLElBQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQztnQkFDdEMsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUNuQixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO3dCQUNuQixLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDMUM7eUJBQU07d0JBQ0gsVUFBVSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ25DO2lCQUNKOztnQkFHRCxJQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQztnQkFDekMsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUNuQixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO3dCQUNuQixLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDMUM7eUJBQU07d0JBQ0gsVUFBVSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ25DO2lCQUNKO2dCQUNELE9BQU87YUFDVixDQUFDO1lBRUYsZUFBVSxHQUFHLFVBQUMsV0FBbUIsRUFBRSxLQUFhO2dCQUM1QyxJQUFNLEdBQUcsR0FBRyxNQUFhLENBQUM7Z0JBQzFCLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO2dCQUMxQixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBSyxLQUFLLGFBQVUsQ0FBQyxDQUFDO2dCQUNqRCxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDekMsQ0FBQztZQUVGLHNCQUFpQixHQUFHLFVBQUMsS0FBOEM7Z0JBQy9ELElBQU0sV0FBVyxHQUFHLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUM7Z0JBQ25ELElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztnQkFDbkIsSUFBSTtvQkFDQSxJQUFJLFdBQVcsRUFBRTt3QkFDYixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ2pDO3lCQUFNO3dCQUNILElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO3FCQUNyQjtpQkFDSjtnQkFBQyxPQUFPLE1BQU0sRUFBRSxHQUFHOztnQkFHcEIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLEtBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO29CQUMxQyxJQUFNLFFBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDaEMsU0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUNoQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7b0JBQ3pDLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBTyxFQUFFLFNBQVMsRUFBRSxVQUNuQyxXQUFnQixFQUNoQixPQUFZO3dCQUVaLElBQUksU0FBUyxHQUFHOzRCQUNaLFdBQVcsRUFBRTtnQ0FDVCxXQUFXLGFBQUE7Z0NBQ1gsT0FBTyxTQUFBO2dDQUNQLE1BQU0sVUFBQTtnQ0FDTixPQUFPLFdBQUE7NkJBQ1Y7eUJBQ0osQ0FBQzt3QkFDRixLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDcEIsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxFQUNuRCxLQUFLLENBQUMsTUFBTSxDQUNmLENBQUM7cUJBQ0wsQ0FBQyxDQUFDO2lCQUNOO3FCQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxLQUFJLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtvQkFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2lCQUNuRjs7Z0JBR0QsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLEtBQUksQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO29CQUM5QyxJQUFNLFFBQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDbkMsU0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUNuQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQ3ZDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztvQkFDeEMsS0FBSSxDQUFDLGFBQWEsQ0FDZCxTQUFPLEVBQ1AsU0FBUyxFQUNULFVBQVUsV0FBZ0IsRUFBRSxPQUFZO3dCQUNwQyxJQUFJLFNBQVMsR0FBRzs0QkFDWixjQUFjLEVBQUU7Z0NBQ1osV0FBVyxhQUFBO2dDQUNYLE9BQU8sU0FBQTtnQ0FDUCxNQUFNLFVBQUE7Z0NBQ04sT0FBTyxXQUFBOzZCQUNWO3lCQUNKLENBQUM7d0JBQ0YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQ3BCLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsRUFDbkQsS0FBSyxDQUFDLE1BQU0sQ0FDZixDQUFDO3FCQUNMLEVBQ0QsT0FBTyxDQUNWLENBQUM7aUJBQ0w7cUJBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLEtBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO29CQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7aUJBQ25GO2FBQ0osQ0FBQztZQUVGLGtCQUFhLEdBQUc7Z0JBQUMsY0FBYztxQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29CQUFkLHlCQUFjOztnQkFDM0IsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDakIsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDbkIsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLElBQUksT0FBTyxFQUFFO29CQUMzQyxJQUFJLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLGNBQWMsRUFBRTt3QkFDN0MsUUFBUSxPQUFPOzRCQUNYLEtBQUssTUFBTTtnQ0FDUCxLQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FDcEMsTUFBTTs0QkFDVixLQUFLLGdCQUFnQjtnQ0FDakIsS0FBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUNyQyxNQUFNOzRCQUNWO2dDQUNJLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQ0FDOUMsTUFBTTt5QkFDYjtxQkFDSjt5QkFBTTt3QkFDSCxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2pEO2lCQUNKO2FBQ0osQ0FBQztZQUVGLGtCQUFhLEdBQUc7Z0JBQUMsY0FBYztxQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29CQUFkLHlCQUFjOztnQkFDM0IsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNkLE9BQVEsTUFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEM7Z0JBQ0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNqQixTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNuQixRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNsQixPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsSUFBSSxPQUFPLEVBQUU7b0JBQzNDLElBQUksTUFBTSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsY0FBYyxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7d0JBQ25FLEtBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQ2pDO3lCQUFNO3dCQUNILEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7cUJBQzFEO2lCQUNKO2FBQ0osQ0FBQzs7Ozs7WUFNRixlQUFVLEdBQUcsVUFDVCxPQUFlLEVBQ2YsU0FBYyxFQUNkLFFBQWtCLEVBQ2xCLE9BQWdCO2dCQUVoQixJQUFNLEdBQUcsR0FBRyxNQUFhLENBQUM7Z0JBQzFCLElBQU0sSUFBSSxHQUFHLEtBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxHQUFHLE9BQU8sR0FBRyxVQUFVLENBQUM7Z0JBQzNELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hDLElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtvQkFDcEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDakM7cUJBQU07b0JBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUM3RDthQUNKLENBQUM7O1lBR0YsbUJBQWMsR0FBRyxVQUFDLFFBQWtCLEVBQUUsc0JBQThCO2dCQUE5Qix1Q0FBQSxFQUFBLDhCQUE4QjtnQkFDaEUsSUFBSSxRQUFRLEVBQUU7b0JBQ1YsSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDO29CQUN2QixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUM7b0JBQzNCLElBQUksS0FBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUU7d0JBQ3hCLFFBQVEsR0FBRzs0QkFDUCxtQkFBbUIsRUFBRSxNQUFNLENBQUMsOEJBQThCOzRCQUMxRCxTQUFTLEVBQUUsc0JBQXNCO3lCQUNwQyxDQUFDO3dCQUNGLGNBQWMsR0FBRyxJQUFJLENBQUM7cUJBQ3pCO3lCQUFNLElBQUksS0FBSSxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7d0JBQ2hDLFFBQVEsR0FBRzs0QkFDUCxXQUFXLEVBQUUsTUFBTSxDQUFDLDhCQUE4Qjs0QkFDbEQsU0FBUyxFQUFFLEtBQUs7NEJBQ2hCLFNBQVMsRUFBRSxNQUFNOzRCQUNqQixhQUFhLEVBQUUsTUFBTTs0QkFDckIsVUFBVSxFQUFFLEtBQUs7NEJBQ2pCLFVBQVUsRUFBRSxTQUFTOzRCQUNyQixLQUFLLEVBQUUsU0FBUzs0QkFDaEIsVUFBVSxFQUFFLFNBQVM7NEJBQ3JCLGdCQUFnQixFQUFFLFNBQVM7eUJBQzlCLENBQUM7d0JBQ0YsY0FBYyxHQUFHLElBQUksQ0FBQztxQkFDekI7b0JBQ0QsUUFBUSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDdEM7YUFDSixDQUFDOztZQUdGLDBCQUFxQixHQUFHLFVBQUMsUUFBa0I7Z0JBQ3ZDLElBQUksUUFBUSxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUU7b0JBQ25DLElBQU0sV0FBVyxHQUFHO3dCQUNoQixXQUFXLEVBQUUsTUFBTSxDQUFDLDhCQUE4Qjt3QkFDbEQsY0FBYyxFQUFFLE1BQU0sQ0FBQyxpQkFBaUI7d0JBQ3hDLFdBQVcsRUFBRSxNQUFNLENBQUMsY0FBYztxQkFDckMsQ0FBQztvQkFDRixRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUMvQjthQUNKLENBQUM7WUE3b0JFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN6QjtRQUVELGtDQUFjLEdBQWQ7WUFDSSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7U0FDbkM7UUFFRCw0Q0FBd0IsR0FBeEI7WUFDSSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3pFO1FBRUQsK0JBQVcsR0FBWCxVQUFZLFVBQWU7O1lBRXZCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLE1BQWMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDMUMsTUFBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO2dCQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDOUM7WUFDRCxJQUFNLEdBQUcsR0FBSSxNQUFjLENBQUM7WUFDNUIsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ2xELElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUN2QztpQkFBTTtnQkFDSCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDcEcsSUFBSSxZQUFZLElBQUksVUFBVSxDQUFDLGVBQWUsRUFBRTtvQkFDNUMsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsSUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3BDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDdkM7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDbkM7YUFDSjtTQUNKO1FBRUQscUNBQWlCLEdBQWpCLFVBQWtCLFVBQWU7WUFDN0IsSUFBTSxHQUFHLEdBQUcsS0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQVMsQ0FBQztZQUNqSCxJQUFJLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFNBQVMsRUFBRTtnQkFDL0QsT0FBTyxPQUFLLFVBQVUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFLLENBQUM7YUFDOUc7aUJBQU07Z0JBQ0gsT0FBTyxVQUFVLENBQUMsY0FBYyxDQUFDO2FBQ3BDO1NBQ0o7UUFFRCxrQ0FBYyxHQUFkLFVBQWUsVUFBZTtZQUE5QixpQkFLQztZQUpJLE1BQWMsQ0FBQyxRQUFRLEdBQUcsVUFBQyxJQUFTO2dCQUNqQyxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2pELENBQUM7WUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQ2xHOztRQUdELGtDQUFjLEdBQWQsVUFBZSxPQUFlLEVBQUUsS0FBa0I7WUFBbEIsc0JBQUEsRUFBQSxVQUFrQjtZQUM5QyxNQUFNLENBQUMsWUFBWSxHQUFHO2dCQUNsQixPQUFPLEVBQUUsT0FBTztnQkFDaEIsS0FBSyxFQUFFLEtBQUs7YUFDZixDQUFDO1NBQ0w7UUFrREQsMkJBQU8sR0FBUCxVQUFRLEdBQVcsRUFBRSxRQUFrQjtZQUNuQyxJQUFJLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDMUM7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7Z0JBQ3JDLE9BQU8sQ0FBQyxNQUFNLEdBQUc7b0JBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQzNDLENBQUM7Z0JBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNsQjtTQUNKO1FBRUQsc0NBQWtCLEdBQWxCLFVBQW1CLEdBQVcsRUFBRSxRQUFrQjtZQUM5QyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEMsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQU0sY0FBYyxHQUFHO2dCQUNuQixRQUFRLENBQUUsTUFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDekMsQ0FBQztZQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ25DO1FBRUQseUJBQUssR0FBTCxVQUFNLEdBQVcsRUFBRSxRQUFtQjtZQUNsQyxJQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELFlBQVksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQzFCLFlBQVksQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7WUFDdEMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDeEMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEM7WUFDRCxJQUFJLFFBQVEsRUFBRTtnQkFDVCxZQUFvQixDQUFDLE1BQU0sR0FBRztvQkFDM0IsUUFBUSxFQUFFLENBQUM7aUJBQ2QsQ0FBQzthQUNMO1NBQ0o7UUFFRCxnQ0FBWSxHQUFaLFVBQWEsa0JBQXVCO1lBQ2hDLElBQUksaUJBQW9DLENBQUM7WUFDekMsSUFBSSxlQUFrQyxDQUFDO1lBQ3ZDLElBQUksZ0JBQW1DLENBQUM7WUFDeEMsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUN6QyxJQUFNLFdBQVcsR0FBNkIsa0JBQWtCO2dCQUM1RCxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBMEI7Z0JBQ3RDLE9BQU8sT0FBTyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUM7YUFDbkMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO2dCQUM5QyxPQUFPLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ3hFO2lCQUFNO2dCQUNILElBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ25ELElBQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3ZELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBSSxrQkFBa0IsQ0FBQyxPQUFvQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdEYsSUFBSyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUF1QixDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7d0JBQ3RFLGdCQUFnQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEQ7eUJBQU07d0JBQ0gsSUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFDcEQsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQ3BFLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2hELE1BQU07eUJBQ1Q7NkJBQU0sSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQzFFLGlCQUFpQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDckQ7cUJBQ0o7aUJBQ0o7YUFDSjtZQUNELE9BQU8sZUFBZSxJQUFJLGlCQUFpQixJQUFJLGdCQUFnQixDQUFDO1NBQ25FO1FBRUQsa0RBQThCLEdBQTlCO1lBQ0ksSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDOUI7UUFFRCx1Q0FBbUIsR0FBbkI7WUFDSSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxFQUFFO2dCQUMxRCxNQUFNLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUN2RCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FDM0QsQ0FBQzthQUNMO1NBQ0o7UUFFRCxxQ0FBaUIsR0FBakI7WUFDSSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztTQUNqQztRQUVELDBDQUFzQixHQUF0QjtZQUNJLElBQU0sNEJBQTRCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FDckQsTUFBTSxDQUFDLGlCQUFpQixFQUN4QixNQUFNLENBQUMsb0NBQW9DLENBQzlDLENBQUM7WUFFRixJQUFJLDRCQUE0QixFQUFFO2dCQUM5QixJQUFJLDRCQUE0QixLQUFLLE1BQU0sRUFBRTtvQkFDekMsTUFBTSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztvQkFDaEMsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7aUJBQzlCO3FCQUFNO29CQUNILE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7b0JBQ2pDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDeEU7YUFDSjtpQkFBTTtnQkFDSCxNQUFNLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzthQUM5QjtTQUNKO1FBRUQsMENBQXNCLEdBQXRCO1lBQ0ksSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FDcEMsTUFBTSxDQUFDLGlCQUFpQixFQUN4QixNQUFNLENBQUMsdUJBQXVCLENBQ2pDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksV0FBVyxFQUFFO2dCQUNiLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDN0IsTUFBTSxDQUFDLDhCQUE4QixHQUFHLFdBQVcsS0FBSyxNQUFNLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztpQkFDakY7cUJBQU07b0JBQ0gsTUFBTSxDQUFDLDhCQUE4QixHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEY7YUFDSjtpQkFBTTtnQkFDSCxNQUFNLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQzthQUM5QjtTQUNKO1FBRUQsNkJBQVMsR0FBVCxVQUFVLFdBQW1CO1lBQ3pCLElBQUksV0FBVyxLQUFLLE1BQU0sSUFBSSxXQUFXLEtBQUssT0FBTyxFQUFFO2dCQUNuRCxPQUFPLElBQUksQ0FBQzthQUNmO2lCQUFNO2dCQUNILE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFFRCxtQ0FBZSxHQUFmLFVBQWdCLFVBQWtCLEVBQUUsU0FBaUI7WUFDakQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsRUFBRSxJQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQztZQUMvQixJQUFJLE1BQU0sRUFBRTtnQkFDUixJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNWLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbkMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDbkUsS0FBSyxFQUNMLEdBQUcsQ0FDTixDQUFDO2lCQUNMO2dCQUNELElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzFCO2dCQUNELElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUMvQixPQUFPLEVBQUUsQ0FBQztpQkFDYjtnQkFDRCxPQUFPLElBQUksQ0FBQzthQUNmO1lBQ0QsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUNELDZCQUFTLEdBQVQsVUFBVSxJQUFZO1lBQ2xCLElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7WUFDMUIsSUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9CLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtvQkFDdkIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDaEM7Z0JBQ0QsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDeEIsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUMvQzthQUNKO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELG1DQUFlLEdBQWY7WUFDSSxJQUFNLHNCQUFzQixHQUFVLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsQ0FBQztZQUNOLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDckQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDckQsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2pGO2FBQ0o7WUFDRCxJQUFNLG9CQUFvQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsc0JBQXNCLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDNUYsTUFBYyxDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO1lBQzNELE1BQWMsQ0FBQyxtQkFBbUIsR0FBRyxvQkFBb0IsQ0FBQztZQUMzRCxJQUFJLE9BQVEsTUFBYyxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7Z0JBQ2xELElBQUssTUFBYyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEtBQUssS0FBSyxFQUFFO29CQUNoRCxNQUFjLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzt3QkFDM0Isb0JBQW9CLEVBQUUsb0JBQW9CO3FCQUM3QyxDQUFDLENBQUM7b0JBQ0YsTUFBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7d0JBQzNCLG1CQUFtQixFQUFFLG9CQUFvQjtxQkFDNUMsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7aUJBQU07Z0JBQ0YsTUFBYyxDQUFDLFNBQVMsR0FBRztvQkFDeEI7d0JBQ0ksS0FBSyxFQUFFLGdCQUFnQjt3QkFDdkIsb0JBQW9CLEVBQUUsb0JBQW9CO3FCQUM3QztvQkFDRDt3QkFDSSxLQUFLLEVBQUUsZUFBZTt3QkFDdEIsbUJBQW1CLEVBQUUsb0JBQW9CO3FCQUM1QztpQkFDSixDQUFDO2FBQ0w7WUFDRCxVQUFVLENBQUM7Z0JBQ1AsSUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsa0JBQWtCLEVBQUU7b0JBQzlDLE1BQU0sRUFBRSxzQkFBc0I7aUJBQ2pDLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQy9CLENBQUMsQ0FBQztTQUNOO1FBQ0QsNENBQXdCLEdBQXhCLFVBQXlCLGtCQUV4QjtZQUNHLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDckIsT0FBTyxFQUFFLENBQUM7YUFDYjtZQUNELE9BQU8sa0JBQWtCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsNEJBQVEsR0FBUixVQUNJLEdBQXFFLEVBQ3JFLE1BQWM7WUFFZCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsMENBQXNCLEdBQXRCLFVBQXVCLGlCQUF3QjtZQUMzQyxPQUFPLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZDO1FBRUQsd0NBQW9CLEdBQXBCO1lBQ0ksTUFBTSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWdCLE1BQU0sQ0FBQyxZQUFZLE9BQUksQ0FBQyxDQUFDO1lBQzNGLElBQ0ksTUFBTSxDQUFDLGlCQUFpQjtnQkFDeEIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsRUFDakU7Z0JBQ0UsTUFBTSxDQUFDLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDdEc7aUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtnQkFDbEMsTUFBTSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWdCLE1BQU0sQ0FBQyxhQUFhLE9BQUksQ0FBQyxDQUFDO2dCQUM1RixJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtvQkFDMUIsTUFBTSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQzVCLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQzlEO2FBQ0o7U0FDSjtRQUVELHdDQUFvQixHQUFwQjtZQUNJLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkUsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7b0JBQ3ZCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxzQkFBb0IsTUFBTSxDQUFDLFlBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM3RjtxQkFBTTtvQkFDSCxNQUFNLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBWSxNQUFNLENBQUMsYUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RGO2FBQ0o7WUFDRCxNQUFNLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLGNBQWM7bUJBQ3RDLE1BQU0sQ0FBQyxjQUFjLGlCQUFZLE1BQU0sQ0FBQyxrQkFBb0IsQ0FBQztZQUN2RSxNQUFNLENBQUMsbUJBQW1CLEdBQU0sTUFBTSxDQUFDLGlCQUFpQixTQUFJLE1BQU0sQ0FBQyxrQkFBa0IsVUFBTyxDQUFDO1NBQ2hHO1FBRUQsMkNBQXVCLEdBQXZCO1lBQ0ksSUFBSSxPQUFRLE1BQWMsQ0FBQyxXQUFXLEtBQUssVUFBVSxFQUFFO2dCQUNuRCxPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUNELFNBQVMsV0FBVyxDQUFDLEtBQVUsRUFBRSxNQUFXO2dCQUN4QyxNQUFNLEdBQUcsTUFBTSxJQUFJO29CQUNmLE9BQU8sRUFBRSxLQUFLO29CQUNkLFVBQVUsRUFBRSxLQUFLO29CQUNqQixNQUFNLEVBQUUsU0FBUztpQkFDcEIsQ0FBQztnQkFDRixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNoRCxHQUFHLENBQUMsZUFBZSxDQUNmLEtBQUssRUFDTCxNQUFNLENBQUMsT0FBTyxFQUNkLE1BQU0sQ0FBQyxVQUFVLEVBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQ2hCLENBQUM7Z0JBQ0YsT0FBTyxHQUFHLENBQUM7YUFDZDtZQUNELFdBQVcsQ0FBQyxTQUFTLEdBQUksTUFBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDdkQsTUFBYyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7U0FDN0M7UUFvUUwsZ0JBQUM7SUFBRCxDQUFDLElBQUE7UUFFWSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUU7Ozs7Ozs7Ozs7OyJ9
