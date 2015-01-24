// ==UserScript==
// @name          Auto-Review
// @author        Simon Forsberg
// @namespace     zomis
// @homepage      https://www.github.com/Zomis/Auto-Review
// @description	  Adds checkboxes for copying code in the question to an answer.
// @include       http://stackoverflow.com/*
// @include       http://meta.stackoverflow.com/*
// @include       http://superuser.com/*
// @include       http://serverfault.com/*
// @include       http://meta.superuser.com/*
// @include       http://meta.serverfault.com/*
// @include       http://stackapps.com/*
// @include       http://askubuntu.com/*
// @include       http://*.stackexchange.com/*
// ==/UserScript==

function embedFunction(name, theFunction) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = theFunction.toString().replace(/function ?/, 'function ' + name);
    document.getElementsByTagName('head')[0].appendChild(script);
}

function showAutoreviewButtons() {
	alert("test");
}

embedFunction('showAutoreviewButtons', function() {
    alert("Hello World!");
});

$('.post-menu').append("<span class='lsep'>|</span><a href='javascript:void(0);' onclick='showAutoreviewButtons()'>review</a>");
