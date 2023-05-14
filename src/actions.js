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
					choices: this.ENCODING_TYPES
				},
				{
					type: 'custom-variable',
					label: 'Custom Variable to read file contents into',
					id: 'customVariable',
				},
			],
			callback: async function (action) {
				let path = await self.parseVariablesInString(action.options.path)
				self.readFileCustom(path, action.options.encoding, action.options.customVariable);
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

		this.setActionDefinitions(actions);
	},
}
