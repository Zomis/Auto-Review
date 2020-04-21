/** @preserve
 // ==UserScript==
 // @name          Auto-Review
 // @grant         none
 // @author        Simon Forsberg
 // @namespace     zomis
 // @homepage      https://www.github.com/Zomis/Auto-Review
 // @description	  Adds checkboxes for copying code in a post to an answer.
 // @include       http://stackoverflow.com/*
 // @include       http://meta.stackoverflow.com/*
 // @include       http://superuser.com/*
 // @include       http://serverfault.com/*
 // @include       http://meta.superuser.com/*
 // @include       http://meta.serverfault.com/*
 // @include       http://stackapps.com/*
 // @include       http://askubuntu.com/*
 // @include       https://*.stackexchange.com/*
 // @exclude       http://chat.stackexchange.com/*
 // ==/UserScript==
 */

const addCheckedLinesToAnswer = event => {
	const answer = $("#wmd-input");
	let answer_text = answer.val();
	let added_lines = 0;
	let added_blocks = 0;

	// loop through checkboxes and prepare answer
	const checkboxes = $("input.autoreview:checked");
	const block = [];
	checkboxes.each((i, checkboxElement) => {
		const checkbox = $(checkboxElement);

		const line_data = checkbox.data('line');
		block.push(line_data);
		if ((i === checkboxes.length - 1) || !checkbox.nextAll('.autoreview:first').prop('checked')) {
			// add block
			const findCutCount = (cut_count, line_data) => Math.min(cut_count, line_data.indexOf(line_data.trim()));
			let cut_count = block.reduce(findCutCount, 1000);
			const addBlockLineToCutCount = line_data => "\n    " + line_data.substr(cut_count);
			answer_text	+= block.map(addBlockLineToCutCount).join('') + "\n\n---\n";
			added_lines += block.length;
			added_blocks++;
			block.length = 0;  //truncate array
		}
		checkbox.prop('checked', false);
	});

	answer.val(answer_text);
	$('html, body').animate({
		scrollTop: answer.offset().top
	}, 1000);
	return;
};
const checkboxClick = event => {
	if (event.shiftKey) {
		const all_checkboxes = $('code input.autoreview');
		let current_checkbox = $(event.target);
		const selected = !current_checkbox.prop('checked');
		do {
			current_checkbox.prop('checked', !selected);
			current_checkbox = current_checkbox.prevAll('.autoreview:first');
		}
		while (current_checkbox.length === 1 && current_checkbox.prop('checked') == selected);
	}
};
const addCheckboxesToCode = event => {
	var checkbox;
	const clickedButton = $(event.target);
	clickedButton.text("Add to answer")
		.toggleClass('addCheckedLinesToAnswer addCheckboxes');

	const spans = $("code span", clickedButton.next());
	let line = "";
	let first = null;

	spans.each((i, span) => {
		let element = $(span);

		if (first === null) {
			first = element;
		}
		if (element.text().indexOf("\n") !== -1) {
			let lines = element.text().split("\n");
			element.text("");
			for (let line_index = 1; line_index < lines.length; line_index++) {
				let current_line = lines[line_index];
				const prev_line = lines[line_index - 1];

				let span;
				// Add the last part of the previous line
				if (line_index == 1) {
					line += prev_line;
					span = $('<span class="pln">' + prev_line + '\n</span>');
					element.after(span);
					element = span;
				}

				// Add the checkbox for the previous line
				if (line.length > 0) {
					checkbox = $('<input type="checkbox" class="autoreview"></input>');
					first.before(checkbox);
					checkbox.data('line', line);
					first = null;
				}

				// Add the beginning <span> element for the current line
				if (line_index < lines.length - 1) {
					current_line += "\n";
				}
				span = $('<span class="pln">' + current_line + '</span>');
				element.after(span);
				first = span;
				element = span;
				line = current_line;
			}
		}
		else {
			line += element.text();
		}
	});
	if (line.length > 0) {
		checkbox = $('<input type="checkbox" class="autoreview"></input>');
		first.before(checkbox);
		checkbox.data('line', line);
	}
};
$(_ => { // jQuery DOM Ready callback
	console.log('readyEvent');
	$(document).on('click', '.addCheckedLinesToAnswer', addCheckedLinesToAnswer);
	$(document).on('click', 'input.autoreview', checkboxClick);
	$(document).on('click', '.addCheckboxes', addCheckboxesToCode);

	$('pre code').parent().before('<button class="addCheckboxes s-btn s-btn__primary">Review</a>');
});