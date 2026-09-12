const { InstanceStatus } = require('@companion-module/base')

const fs = require('fs');
const readline = require('readline');

module.exports = {
	async openFile() {
		let self = this;

		const rate = self.config.rate;
		let readInProgress = false;

		// Starting the reader again must replace the existing timer instead of
		// creating an additional polling loop.
		self.stopInterval();

		const pollFile = async () => {
			if (readInProgress) {
				return;
			}

			readInProgress = true;
			try {
				const data = await self.readFile()
				self.filecontents = data.toString()
			} catch (error) {
				// readFile updates the connection status. Keep the timer alive so a
				// later path or filesystem recovery can be detected automatically.
			} finally {
				readInProgress = false;
			}
		};

		await pollFile();

		if (rate > 999) {
			if (self.config.verbose) {
				self.log('debug', 'Creating Interval. File will be read every ' + rate + ' ms.');
			}
			self.INTERVAL = setInterval(pollFile, rate);
		}
		else {
			self.log('info', 'Retry Rate is 0. Module will open file one time and not read it again unless manually activated.');
		}
	},

	/**
	 * Reads a file async and returns the content
	 * @param {string} path defaults to configured path
	 * @param {string} encoding defaults to configured encoding
	 * @returns {Promise<Buffer>}
	 */
	async readFile(path = this.config.path, encoding = this.config.encoding) {
		let self = this;
		if (self.config.verbose) {
			self.log('debug', 'Opening File: ' + path);
		}
	
		return new Promise((resolve, reject) => {

			fs.access(path, fs.constants.R_OK, (err) => {
				if (err) {
					self.updateStatus(InstanceStatus.ConnectionFailure, 'File Does Not Exist');
					self.checkFeedbacks();
				
					if (self.config.verbose) {
						self.log('debug', 'File Does Not Exist: ' + path);
					}

					self.EXISTS = false;
					reject(new Error('File does not exist or is not readable: ' + path))

				} else {
					self.updateStatus(InstanceStatus.Ok);
					self.EXISTS = true;
					self.checkFeedbacks();

					if (self.config.verbose) {
						self.log('debug', 'Reading File: ' + path);
					}

					fs.readFile(path, encoding, (err, data) => {
						if (err) {
							self.updateStatus(InstanceStatus.BadConfig, 'Error Reading File');
							self.log('error', 'Error reading file: ' + err);
							reject(new Error('Error reading file: ' + err))
						}
						else {
							self.updateStatus(InstanceStatus.Ok);
							self.datetime = new Date().toISOString().replace('T', ' ').substring(0, 19);
							self.checkVariables()
							resolve(data)
						}
					})

				}
    	})
		})
	},

	/**
	 * Reads a file and puts content into a custom variable async
	 * @param {string} path 
	 * @param {string} encoding 
	 * @param {string} customVariable 
	 * @returns {Promise}
	 */
	async readFileCustom(path, encoding, customVariable) {
		let self = this;
		if (self.config.verbose) {
			self.log('debug', 'Opening File: ' + path);
		}
		
		try {
			const data = await this.readFile(path, encoding)
			await self.setCustomVariableValue(customVariable, data)
		} catch (error) {
			self.log('error', 'Reading file and writing to custom variable failed: ' + error)
			throw(error)
		}
	},

	/**
	 * Reads and returns a line from the file async
	 * @param {number} lineNumber 
	 * @param {string} path 
	 * @returns {Promise<string>}
	 */
	async readLine(lineNumber, path) {
    let lineIndex = 0;

    if (this.config?.verbose) {
        this.log('debug', 'Opening File: ' + path);
        this.log('debug', 'Reading Line: ' + lineNumber);
    }

    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(path);

        fileStream.on('error', (err) => {
            this.log?.('error', 'Error opening file: ' + err);
            reject(err);
        });

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            lineIndex++;
            if (lineIndex === lineNumber) {
                rl.close();
                resolve(line);
            }
        });

        rl.on('close', () => {
            if (lineIndex < lineNumber) {
                reject(new Error('Line number out of range'));
            }
        });

        rl.on('error', (err) => {
            this.log?.('error', 'Error reading line: ' + err);
            reject(err);
        });
    });
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
