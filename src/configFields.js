const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module reads a file and puts the contents into a Variable.'
			},
			{
				type: 'textinput',
				id: 'path',
				width: 6,
				label: 'File Path',
				default: ''
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
				type: 'number',
				id: 'rate',
				width: 6,
				label: 'Re-Read Rate (in ms) (minimum interval is 1000ms, set to 0 to read file once and not again unless manually activated)',
				default: 60000
			},
			{
				type: 'static-text',
				id: 'dummy2',
				width: 12,
				label: ' ',
				value: ' '
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false
			}
		]
	},
}
