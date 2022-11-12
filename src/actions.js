module.exports = {

	actions() {
		let self = this; // required to have reference to outer `this`
		let actionsArr = {};

		actionsArr.readFile = {
			label: 'Read File Now',
			callback: function (action, bank) {
				self.readFile();
			}
		};

		this.setActions(actionsArr);
	},
}
