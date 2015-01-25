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
		var element = $(spans[ i ]);
		
		if (first === null) {
			first = element;
		}
		if (element.text().indexOf("\n") !== -1) {
			console.log(i + " line: " + line);
			var lastBreak = element.text().lastIndexOf("\n");
			var beforeBreak = element.text().substr(0, lastBreak);
			var afterBreak = element.text().substr(lastBreak + 1);
			element.text(beforeBreak + "\n");
			var dataProperty = ""; // 'data-line="' + line + '" ';
			var span = '<span class="pln zomis">' + afterBreak + '</span>';
			console.log("clog befor " + beforeBreak);
			console.log("clog after " + afterBreak);
			if (afterBreak.length === 0) {
				span = "";
			}
			first.before('<input type="checkbox" ></input>' + span);
			first = null;
			line = "";
		}
		else {
			line += element.text();
		}
		
	}
});

$('.post-menu').append("<span class='lsep'>|</span><a href='javascript:void(0);' onclick='showAutoreviewButtons()'>review</a>");
