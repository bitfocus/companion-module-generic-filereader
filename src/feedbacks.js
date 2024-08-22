const { combineRgb } = require('@companion-module/base')

module.exports = {
    // ##########################
    // #### Define Feedbacks ####
    // ##########################
    initFeedbacks() {
        let self = this;
        const feedbacks = {};

        const colorWhite = combineRgb(255, 255, 255) // White
        const colorBlack = combineRgb(0, 0, 0) // Black
        const colorRed = combineRgb(255, 0, 0) // Red
        const colorGreen = combineRgb(0, 255, 0) // Green
        const colorOrange = combineRgb(255, 102, 0) // Orange

		feedbacks.fileExists = {
			type: 'boolean',
			name: 'File Exists or Not',
			description: 'If the file exists or not, change color of the button',
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'State',
					id: 'state',
					default: true,
					choices: [
						{ id: true, label: 'Exists' },
						{ id: false, label: 'Does Not Exist' },
					],
				},
			],
			callback: async function (feedback) {
				let opt = feedback.options

				if (opt.state === true) {
					return self.EXISTS
				}
				else {
					return !self.EXISTS
				}
			},
		}

        self.setFeedbackDefinitions(feedbacks);
    }
}