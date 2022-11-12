module.exports = {
	config_fields() {
		return [
			{
				type: 'text',
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
				choices: [
					{ id: 'utf8', label: 'utf8'},
					{ id: 'utf16le', label: 'utf16le'},
					{ id: 'latin1', label: 'latin1'},
					{ id: 'base64', label: 'base64'},
					{ id: 'base64url', label: 'base64url'},
					{ id: 'hex', label: 'hex'}
				]
			},
			{
				type: 'number',
				id: 'rate',
				width: 6,
				label: 'Re-Read Rate (in ms)',
				default: 60000
			},
			{
				type: 'text',
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
