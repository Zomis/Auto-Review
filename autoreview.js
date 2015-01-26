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
// @exclude       http://chat.stackexchange.com/*
// ==/UserScript==

function embedFunction(name, theFunction) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = theFunction.toString().replace(/function ?/, 'function ' + name);
    document.getElementsByTagName('head')[0].appendChild(script);
}

embedFunction('showAutoreviewButtons', function(clickedObject) {
	$(clickedObject).text("review-debug");
	
	var spans = $("code span", $(clickedObject).next());
	console.log(spans.length);
	
	var i;
	var count = spans.length;
	var line = "";
	var first = null;
	for (i = 0; i < count; i++) {
		var element = $(spans[ i ]);
		
		/*
		first = element where input will be placed before, first element on a line
		element = element containing the line break(s)
		
		when you find an element with line break,
		
		- delete everything after the linebreak itself and add a span after the linebreak, with class `pln`
		- add checkbox at the beginning of the previous line
		- change text of current
		*/
		
		if (first === null) {
			first = element;
		}
		if (element.text().indexOf("\n") !== -1) {
			console.log(i + " line: " + line);
			
			var lines = element.text().split("\n");
			element.text("");
			for (var line_index = 1; line_index < lines.length; line_index++) {
				var current_line = lines[ line_index ];
				var prev_line = lines[ line_index - 1 ];
				
				line += prev_line;
				
				var span;
				if (line_index == 1) {
					span = $('<span class="pln zomis before">' + prev_line + '\n</span>');
					element.after(span);
					element = span;
				}
				
				if (line.length > 0) {
					var dataProperty = 'data-line="' + line + '" ';
					var checkbox = $('<input type="checkbox" ' + dataProperty + ' class="autoreview' + line_index + '"></input>');
					first.before(checkbox);
					line = current_line;
					first = null;
				}
				
				if (line_index < lines.length - 1) {
					current_line += "\n";
				}
				span = $('<span class="pln zomis after">' + current_line + '</span>');
				element.after(span);
				first = span;
				element = span;
			}
		}
		else {
			line += element.text().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
		}
		
	}
});

$('pre code').parent().before('<span class="lsep">|</span><a href="javascript:void(0);" class="zomis-debug" onclick="showAutoreviewButtons($(this))">review</a>');
