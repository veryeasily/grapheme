console.log("jquery, couchdb, and own script injected, in theory!");

var box, grapheme, $BOD = $('body');
$('body').on('mousedown', draw);
$.couch.urlPrefix = "http://127.0.0.1:5984", grapheme = $.couch.db("grapheme");
loadBoxes();

chrome.extension.onRequest.addListener	(
	function(request, sender, sendResponse) {
		if (request.closeGrapheme === true)	{
			console.log("attempting to close grapheme");
			$('.textBox').remove();	} 	});
