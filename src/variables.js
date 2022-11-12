module.exports = {
	updateVariableDefinitions() {
		let variables = [
			{ label: 'File Path', name: 'path'},
			{ label: 'File Contents', name: 'contents'},
			{ label: 'Last Date/Time Read', name: 'datetime'},
		]

		this.setVariableDefinitions(variables);
	},

	checkVariables() {
		try {
			this.setVariable('path', this.config.path);
			this.setVariable('contents', this.filecontents);
			this.setVariable('datetime', this.datetime);
		}
		catch(error) {
			//do something with that error
			if (this.config.verbose) {
				this.log('debug', 'Error Updating Variables: ' + error);
			}
		}
	}
}