module.exports = {

	initActions() {
		let self = this; // required to have reference to outer `this`
		let actions = {};

		actions.readFile = {
			name: 'Read File Now',
			options: [],
			callback: async function (action) {
				self.readFile();
			}
		};

		actions.readFileCustom = {
			name: 'Read Custom File Path into Custom Variable',
			options: [
				{
					type: 'textinput',
					label: 'File Path',
					description: 'File Path to read. Accepts variables',
					id: 'path',
					default: '',
					useVariables: true
				},
				{
					type: 'dropdown',
					id: 'encoding',
					width: 6,
					label: 'File Encoding',
					default: 'utf8',
					choices: self.ENCODING_TYPES
				},
				{
					type: 'custom-variable',
					label: 'Custom Variable to read file contents into',
					id: 'customVariable',
				},
			],
			callback: async function (action) {
				let path = await self.parseVariablesInString(action.options.path)
				await self.readFileCustom(path, action.options.encoding, action.options.customVariable);
			}
		};

		actions.readLine = {
			name: 'Read Specific Line',
			options: [
				{
					type: 'textinput',
					label: 'Line Number',
					description: 'Line Number to read. Accepts variables and value must be an integer',
					id: 'line',
					default: '1',
					useVariables: {local: true}
				},
				{
					type: 'custom-variable',
					label: 'Custom Variable to read line contents into',
					id: 'customVariable',
				},
			],
			callback: async function (action) {
				let lineStr = await self.parseVariablesInString(action.options.line);
				let lineNumber = parseInt(lineStr);
				if (isNaN(lineNumber)) {
					self.log('error', 'Line Number must be an integer');
					return Promise.reject('Line Number must be an integer')
				}
				if (!action.options.customVariable) {
					self.log('error', 'No custom variable given for Read Specific Line');
					return Promise.reject('No custom variable given for Read Specific Line')
				}

				const lineData = await self.readLine(lineNumber, `${self.config.path}`)
				self.setCustomVariableValue(action.options.customVariable, lineData)
			}
		};

		actions.readLineCustom = {
			name: 'Read Specific Line of Custom File Path into Custom Variable',
			options: [
				{
					type: 'textinput',
					label: 'Line Number',
					description: 'Line Number to read. Accepts variables and value must be an integer',
					id: 'line',
					default: '1',
					useVariables: true
				},
				{
					type: 'textinput',
					label: 'File Path',
					description: 'File Path to read. Accepts variables',
					id: 'path',
					default: '',
					useVariables: true
				},
				{
					type: 'custom-variable',
					label: 'Custom Variable to read line contents into',
					id: 'customVariable',
				},
			],
			callback: async function (action) {
				let line = await self.parseVariablesInString(action.options.line);
				let path = await self.parseVariablesInString(action.options.path);

				let lineNumber = parseInt(line);
				if (isNaN(lineNumber)) {
					self.log('error', 'Line Number must be an integer');
					return Promise.reject('Line Number must be an integer')
				}
				if (!action.options.customVariable) {
					self.log('error', 'No custom variable given for Read Specific Line');
					return Promise.reject('No custom variable given for Read Specific Line')
				}
				if (!path) {
					self.log('error', 'No path given for Read Specific Line');
					return Promise.reject('No custom variable given for Read Specific Line')
				}

				const lineData = await self.readLine(lineNumber, path)
				self.setCustomVariableValue(action.options.customVariable, lineData)
			}
		};

		actions.startInterval = {
			name: 'Start Reading File Interval',
			options: [],
			callback: async function (action) {
				self.openFile();
			}
		};

		actions.stopInterval = {
			name: 'Stop Reading File Interval',
			options: [],
			callback: async function (action) {
				self.stopInterval();
			}
		};

		self.setActionDefinitions(actions);
	},
}
