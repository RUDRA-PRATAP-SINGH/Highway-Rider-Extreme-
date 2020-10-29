'use strict';
console.log('======== APP.JS LOADED ============');

// Insert settings.js
var settingsJs = document.createElement('script');
settingsJs.src = 'famobi_js/settings.js';
document.getElementsByTagName('head')[0].appendChild(settingsJs);

// create and insert the css
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'famobi_css/app.css';
document.getElementsByTagName('head')[0].appendChild(link);

// create the cordova js script tag
var script = document.createElement('script');
script.src = 'cordova.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// create html for loading overlay
var div = document.createElement('div');
div.className = 'famobiAppLoader';
document.getElementsByTagName('body')[0].appendChild(div);

var application = {};
application.adCallback = null;
application.fireAdCallback = function() {
	if (typeof this.adCallback === "function") {
		this.adCallback();
	}
	this.adCallback = null;

	window.famobi.game.resume();	
}

function showInterstitialAd(callback, force) {
	console.log('showInterstitialAd');
	if (typeof callback === "function") {
		application.adCallback = callback;
	}

	if(typeof FamobiPlugin !== 'undefined') {
		FamobiPlugin.showAd(force, function (msg) {
			$('body').removeClass('loadingAd');
			console.log("showAd done");
			application.fireAdCallback();
		});
	} else {
		console.log("FamobiPlugin missing");
		application.fireAdCallback();
	}
}

window.famobi.adapters.add("ads", "show", function(callback, force) {
	if(typeof force === 'undefined') {
		force = false;
	}
	window.famobi.game.pause();
	showInterstitialAd(callback, force);
	return true;
});


document.addEventListener('deviceready', function() {
	if(typeof FamobiPlugin !== 'undefined') {
		FamobiPlugin.init(appSettings.fg_package_id, appSettings.adDebugMode, function() {});
	}

	var pause = window.famobi && window.famobi.game && window.famobi.game.pause;
	var resume = window.famobi && window.famobi.game && window.famobi.game.resume;

	if(pause && resume) {
	    document.addEventListener('pause', function () {
	        pause();
	        console.log('paused');
	    }, false);
	    document.addEventListener('resume', function () {
	        resume();
	        console.log('resumed');
	    }, false);
	}
});