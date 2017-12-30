var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var t = 0;
var address = 0;
var pageSize = 0;

/**
 * Set viewport size here
 */
var viewports = {
	mobile: [375, 667],
	tablet: [768, 1024],
	desktop: [1400, 900]
};

if (fs.makeDirectory('screenshots')) {
	console.log('Directory was created');
} else {
	console.log('Directory exist or no permission to create.');
}

page.onLoadFinished = function(status) {
	console.log('Status: ' + status);
};

page.onResourceReceived = function(response) {
	if (response.bodySize !== undefined) {
		pageSize += parseInt(response.bodySize, 10);
	}
};

/**
 * Open target website to capture and calculate pagespeed, pagesize
 */
t = Date.now();
address = system.args[1];
page.open(address, function(status) {
	var body = page.evaluate(function() {
		/**
		 * Force window background to white,
		 * useful when your body, document isn't filled wite white color
		 */
		if (document.body.bgColor === '') document.body.bgColor = 'white';
		return document.body.bgColor;
	});
	if (status !== 'success') {
		console.log('FAIL! to load the address');
		phantom.exit();
	} else {
		t = Date.now() - t;
		console.log('Loading time: ' + t + ' msec');
		console.log('Page size: ' + pageSize / 1000 + 'Kb');
		/**
		 * Use setTimeout to verify all animate content was loaded.
		 * and scroll to bottom of page to get all dynamic content before make screenshot
		 */
		window.setTimeout(function() {
			Object.keys(viewports).forEach(function(key) {
				var w = viewports[key][0];
				var h = viewports[key][1];
				page.evaluate(function() {
					window.scrollTo(0, document.body.scrollHeight);
				});
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
				page.render('screenshots/' + key + '.jpg', {
					format: 'jpg',
					quality: 80
				});
			});
			phantom.exit();
		}, 3200);
	}
});
