module.exports = {
	initVariables() {
		let variables = [
			{ name: 'File Path', variableId: 'path'},
			{ name: 'File Contents', variableId: 'contents'},
			{ name: 'Last Date/Time Read', variableId: 'datetime'},
		]

		this.setVariableDefinitions(variables);
	},

	checkVariables() {
		try {
			let variableObj = {};

			variableObj['path'] = this.config.path;
			variableObj['contents'] = this.filecontents;
			variableObj['datetime'] = this.datetime;

			this.setVariableValues(variableObj);
		}
		catch(error) {
			//do something with that error
			if (this.config.verbose) {
				this.log('debug', 'Error Updating Variables: ' + error);
			}
		}
	}
}