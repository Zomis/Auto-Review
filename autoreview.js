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

embedFunction('showAutoreviewButtons', function() {
	var spans = $("code span");
	console.log(spans.length);
	
	var i;
	var count = spans.length;
	var line = "";
	var first = null;
	for (i = 0; i < count; i++) {
		console.log(i);
		var element = $(spans[ i ]);
		
		if (first === null) {
			first = element;
		}
		if (element.text().indexOf("\n") !== -1) {
			console.log( i + ": " + element.text() );
			first.before('<input type="checkbox" data-line="' + line + '" />');
			first = null;
			line = "";
		}
		
	}
});

$('.post-menu').append("<span class='lsep'>|</span><a href='javascript:void(0);' onclick='showAutoreviewButtons()'>review</a>");
