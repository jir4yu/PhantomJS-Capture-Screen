var page = require('webpage').create(),
	system = require('system'),
	t, address, pageSize = 0;

/**
 * SET VIEWPORT HERE
 */
var viewports = {
	'mobile': [375, 667],
	'tablet': [768, 1024],
	'desktop': [1366, 768]
};

/**
 * TRIGGER WHEN GOT PAGE
 * CHECK PAGE STATUS AND PAGE SIZE
 */
page.onLoadFinished = function(status) {
	console.log('Status: ' + status);
};

page.onResourceReceived = function(response) {
	if (response.bodySize !== undefined) {
		pageSize += parseInt(response.bodySize, 10)
	};
};

/**
 * OPEN WEBPAGE TO CAPTURE SCREEN
 * CALCULATE PAGE SPEED AND PAGESIZE
 */
t = Date.now();
address = system.args[1];
page.open(address, function(status) {
	var body = page.evaluate(function() {
		// FORCE BACKGROUND COLOR TO WHITE
		if (document.body.bgColor === '')
			document.body.bgColor = 'white';
		return document.body.bgColor;
	});
	if (status !== 'success') {
		console.log('FAIL! to load the address');
		phantom.exit();
	} else {
		t = Date.now() - t;
		console.log('Loading time: ' + t + ' msec');
		console.log('Page size: ' + pageSize / 1000 + 'Kb');
		// USE SETTIMEOUT TO VERIFIED 
		// ALL CONTENT(ANIMATE EFFECT) WAS SUCCESSFUL LOADING.
		window.setTimeout(function() {
			Object.keys(viewports).forEach(function(key) {
				var w = viewports[key][0],
					h = viewports[key][1];
				page.viewportSize = {
					width: w,
					height: h
				};
				page.clipRect = {
					top: 0,
					left: 0,
					width: w,
					height: h
				};
				page.render(key + '.jpg', {
					format: 'jpg',
					quality: 80
				});
			})
			phantom.exit();
		}, 1500);
	}
})