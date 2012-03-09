var leftButton = $('<div>'), rightButton = $('<div>');
leftButton.css( {
			width: '20px', height: '20px',
			right: window.screen.availWidth, bottom: window.screen.availHeight,
			'background-color': 'blue',
			position: 'fixed'} )
	.appendTo($('body'));

rightButton.css( {
			width: '20px', height: '20px',
			left: '0px', top: '0px',
			'background-color': 'blue',
			position: 'fixed'} )
	.appendTo($('body'));
