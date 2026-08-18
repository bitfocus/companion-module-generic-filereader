const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const api = require('../src/api')

async function createReader(filePath) {
	const reader = {
		...api,
		config: { path: '$(custom:file_path)', encoding: 'utf8', verbose: false },
		parseVariablesInString: async (value) => value.replace('$(custom:file_path)', filePath),
		updateStatus: () => {},
		checkFeedbacks: () => {},
		checkVariables: () => {},
		stopInterval: () => {},
	}

	return reader
}

test('readFile expands Companion variables in the configured path', async () => {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'generic-filereader-'))
	const filePath = path.join(directory, 'test.txt')
	await fs.writeFile(filePath, 'file contents')

	try {
		const reader = await createReader(filePath)
		const contents = await reader.readFile()
		assert.equal(contents, 'file contents')
	} finally {
		await fs.rm(directory, { recursive: true, force: true })
	}
})

test('readLine expands Companion variables in the configured path', async () => {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'generic-filereader-'))
	const filePath = path.join(directory, 'test.txt')
	await fs.writeFile(filePath, 'first line\nsecond line\n')

	try {
		const reader = await createReader(filePath)
		const contents = await reader.readLine(2, reader.config.path)
		assert.equal(contents, 'second line')
	} finally {
		await fs.rm(directory, { recursive: true, force: true })
	}
})
