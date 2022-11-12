var InstanceSkel = require('../../instance_skel');

const configFields = require('./src/configFields');
const api = require('./src/api');
const actions = require('./src/actions');
const variables = require('./src/variables');
const feedbacks = require('./src/feedbacks');
const presets = require('./src/presets');

class GenericFileReaderInstance extends InstanceSkel {
	constructor(system, id, config) {
		super(system, id, config)

		this.config = config

		this.INTERVAL = null;

		this.filecontents = '';
		this.datetime = '';

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...configFields,
			...api,
			...actions,
			...variables,
			...feedbacks,
			...presets,			
		})
	}

	init() {
		this.status(this.STATUS_UNKNOWN);

		// Update the config
		this.updateConfig();
	}

	updateConfig(config) {
		if (config) {
			this.config = config
		}

		// Quickly check if certain config values are present and continue setup
		if (this.config.path) {
			if (this.INTERVAL) {
				this.stopInterval();
			}

			// Init the Actions
			this.actions();

			// Init and Update Variables
			this.updateVariableDefinitions();
			this.checkVariables();

			// Init the Feedbacks
			this.feedbacks();

			// Init the Presets
			this.presets();

			this.status(this.STATUS_UNKNOWN);

			this.openFile();
		}
	}

	destroy() {
		//close out any connections
		this.stopInterval();

		this.debug('destroy', this.id);
	}
}

module.exports = GenericFileReaderInstance;