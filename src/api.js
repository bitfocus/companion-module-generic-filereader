const { InstanceStatus } = require('@companion-module/base')

const fs = require('fs');

module.exports = {
	openFile() {
		let self = this; // required to have reference to outer `this`
		
		const rate = self.config.rate;

		self.readFile();

		if (rate > 0) {
			if (self.config.verbose) {
				self.log('debug', 'Creating Interval. File will be read every ' + rate + ' ms.');
			}
			self.INTERVAL = setInterval(self.readFile.bind(self), rate);
		}
		else {
			self.log('info', 'Retry Rate is 0. Module will open file one time and not read it again unless manually activated.');
		}
	},

	readFile() {
		let self = this;
	
		let path = self.config.path;
		let encoding = self.config.encoding;
	
		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.readFile(path, encoding, (err, data) => {
				if (err) {
					this.updateStatus(InstanceStatus.BadConfig, 'Error Reading File');
					self.log('error', 'Error reading file: ' + err);
					self.stopInterval();
				}
				else {
					this.updateStatus(InstanceStatus.Ok);
					self.filecontents = data;
					self.datetime = new Date().toISOString().replace('T', ' ').substr(0, 19);
					self.checkVariables();
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading File: ' + error);
		}
	},

	readFileCustom(path, encoding, customVariable) {
		let self = this;

		try {
			if (self.config.verbose) {
				self.log('debug', 'Opening File: ' + path);
			}
	
			fs.readFile(path, encoding, (err, data) => {
				if (err) {
					self.log('error', 'Error reading custom file path: ' + err);
				}
				else {
					this.setCustomVariableValue(customVariable, data);
				}
			});
		}
		catch(error) {
			self.log('error', 'Error Reading custom file path: ' + error);
		}
	},

	stopInterval() {
		let self = this; // required to have reference to outer `this`

		if (self.config.verbose) {
			self.log('debug', 'Stopping File Read Interval.');
		}
		clearInterval(self.INTERVAL);
		self.INTERVAL = null;
	}
}