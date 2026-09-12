const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const { InstanceStatus } = require('@companion-module/base')

const api = require('../src/api')

test('polling continues after a missing file and recovers automatically', async () => {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'generic-filereader-'))
	const filePath = path.join(directory, 'appears-later.txt')
	const statuses = []
	const reader = {
		...api,
		config: { path: filePath, encoding: 'utf8', rate: 1000, verbose: false },
		INTERVAL: null,
		filecontents: '',
		updateStatus: (...args) => statuses.push(args),
		checkFeedbacks: () => {},
		checkVariables: () => {},
		log: () => {},
	}

	try {
		await reader.openFile()
		assert.notEqual(reader.INTERVAL, null, 'the retry interval should start after an initial failure')
		assert.equal(statuses.at(-1)[0], InstanceStatus.ConnectionFailure)

		await fs.writeFile(filePath, 'recovered contents')
		await waitFor(() => reader.filecontents === 'recovered contents', 2500)

		assert.equal(reader.EXISTS, true)
		assert.equal(statuses.at(-1)[0], InstanceStatus.Ok)
	} finally {
		reader.stopInterval()
		await fs.rm(directory, { recursive: true, force: true })
	}
})

test('starting polling again replaces the existing interval', async () => {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'generic-filereader-'))
	const filePath = path.join(directory, 'test.txt')
	await fs.writeFile(filePath, 'file contents')
	const reader = {
		...api,
		config: { path: filePath, encoding: 'utf8', rate: 1000, verbose: false },
		INTERVAL: null,
		filecontents: '',
		updateStatus: () => {},
		checkFeedbacks: () => {},
		checkVariables: () => {},
		log: () => {},
	}

	try {
		await reader.openFile()
		const firstInterval = reader.INTERVAL
		await reader.openFile()

		assert.notEqual(reader.INTERVAL, firstInterval)
		assert.equal(firstInterval._destroyed, true)
	} finally {
		reader.stopInterval()
		await fs.rm(directory, { recursive: true, force: true })
	}
})

async function waitFor(predicate, timeout) {
	const started = Date.now()
	while (!predicate()) {
		if (Date.now() - started >= timeout) {
			throw new Error('Timed out waiting for condition')
		}
		await new Promise((resolve) => setTimeout(resolve, 25))
	}
}
