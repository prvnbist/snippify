const express = require('express');
const fs = require('fs');

const router = new express.Router();

const { isFileAttached } = require('../utils/middlewares')
const { getAllFiles } = require('../utils/files.js')

const defaultLocation = '..'

// Get list of all files
router.get('/files', (req, res) => {
	return getAllFiles(`${defaultLocation}/snippets`).then(files =>
		res.send({ files })
	).catch(error => res.status(400).send(error))
})

router.get('/file', (req, res) => {
	const { folder, file } = req.query
	const filePath = `${defaultLocation}/snippets/${folder}/${file}`
	fs.readFile(filePath, (err, data) => {
		if (err)
			return res.status(404).send({
				success: false,
				message: `File ${file} doesn't exist!`
			})
		return res.status(200).send({ success: true, file: data.toString() })
	})
})

// Create Files
router.post('/saveSnippet', isFileAttached, (req, res) => {
	const { file } = req.files
	const { folder } = req.body
	const saveLocation = `${defaultLocation}/snippets/${folder}`
	const savePath = `${saveLocation}/${file.name}`
	if (!fs.existsSync(saveLocation)) {
		fs.mkdirSync(saveLocation, { recursive: true })
	}
	fs.writeFile(savePath, file.data.toString(), err => {
		if (err)
			return res.status(404).send({
				success: false,
				message: `File ${file} doesn't exist!`
			})
		return res
			.status(200)
			.send({ success: true, message: 'File has been saved!' })
	})
})

// Delete Files
router.delete('/deleteSnippet', (req, res) => {
	const { folder, file } = req.query
	const filePath = `${defaultLocation}/snippets/${folder}/${file}`
	fs.unlink(filePath, err => {
		if (err)
			return res.status(404).send({
				success: false,
				message: `File ${file} doesn't exist!`
			})
		return res
			.status(200)
			.send({ success: true, message: 'File has been deleted!' })
	})
})

// Rename File
router.post('/renameSnippet', (req, res) => {
	const { folder, file, newName } = req.body
	const oldPath = `${defaultLocation}/snippets/${folder}/${file}`
	const newPath = `${defaultLocation}/snippets/${folder}/${newName}`
	fs.rename(oldPath, newPath, err => {
		if (err)
			return res.status(404).send({
				success: false,
				message: `File ${file} doesn't exist!`
			})
		return res
			.status(200)
			.send({ success: true, message: 'File has been renamed!' })
	})
})

module.exports = router;