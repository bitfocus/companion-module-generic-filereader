const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')

const UpgradeScripts = require('./src/upgrades');

const configFields = require('./src/configFields');
const api = require('./src/api');
const actions = require('./src/actions');
const variables = require('./src/variables');
const feedbacks = require('./src/feedbacks');
const presets = require('./src/presets');

class GenericFileReaderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.INTERVAL = null;

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...configFields,
			...api,
			...actions,
			...variables,
			...feedbacks,
			...presets,			
		})

		this._filecontents = '';
		this.datetime = '';

		this.ENCODING_TYPES = [
			{ id: 'utf8', label: 'utf8'},
			{ id: 'utf16le', label: 'utf16le'},
			{ id: 'latin1', label: 'latin1'},
			{ id: 'base64', label: 'base64'},
			{ id: 'base64url', label: 'base64url'},
			{ id: 'hex', label: 'hex'}
		];
	}

	get filecontents() {
		return this._filecontents
	}

	set filecontents(value) { 
		this._filecontents = value
		this.checkVariables()
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting);
		this.configUpdated(config);
	}

	async configUpdated(config) {
		if (config) {
			this.config = config
		}

		this.updateStatus(InstanceStatus.Ok);

		this.stopInterval();

		this.initActions();
		this.initFeedbacks();
		this.initVariables();
		this.initPresets();

		this.checkVariables();

		// Quickly check if certain config values are present and continue setup
		if (this.config.path !== '') {
			if (this.INTERVAL) {
				this.stopInterval();
			}

			this.updateStatus(InstanceStatus.Connecting, 'Opening File...');
			try {
				await this.openFile();
				this.updateStatus(InstanceStatus.Ok);
				this.checkVariables();
				this.checkFeedbacks();
			} catch (error) {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Can't open file: ${error}`)
				// don't throw
			}
		}
	}

	async destroy() {
		//close out any connections
		this.stopInterval();

		this.debug('destroy', this.id);
	}
}

runEntrypoint(GenericFileReaderInstance, UpgradeScripts)
