const express = require('express')
const fs = require('fs')

const router = new express.Router()

const { isFileAttached } = require('../utils/middlewares')

const defaultLocation = '..'

router.get('/:label/:snippet', (req, res) => {
	const { label, snippet } = req.params
	const filePath = `${defaultLocation}/snippets/${label}/${snippet}`
	fs.readFile(filePath, (err, data) => {
		if (err)
			return res.status(404).send({
				success: false,
				message: `File ${file} doesn't exist!`
			})
		return res.status(200).send({ success: true, file: data.toString() })
	})
})

// Create File
router.post('/create', (req, res) => {
	const { label, snippet } = req.body
	const location = `${defaultLocation}/snippets/${label}`
	if (!fs.existsSync(location)) {
		fs.mkdirSync(location, { recursive: true })
	}
	fs.writeFile(`${location}/${snippet}`, '', err => {
		if (err)
			return res.status(404).send({
				success: false,
				message: `${new Error(err)}`
			})
		return res
			.status(200)
			.send({ success: true, message: 'File has been saved!' })
	})
})

// Save Files
router.post('/save', isFileAttached, (req, res) => {
	const { snippet } = req.files
	const { label } = req.body
	const saveLocation = `${defaultLocation}/snippets/${label}`
	const savePath = `${saveLocation}/${snippet.name}`
	if (!fs.existsSync(saveLocation)) {
		fs.mkdirSync(saveLocation, { recursive: true })
	}
	fs.writeFile(savePath, snippet.data.toString(), err => {
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
router.delete('/delete/:label/:snippet', (req, res) => {
	const { label, snippet } = req.params
	const location = `${defaultLocation}/snippets/${label}/${snippet}`
	fs.unlink(location, err => {
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
router.post('/rename', (req, res) => {
	const { folder, oldName, newName } = req.body
	const oldPath = `${defaultLocation}/snippets/${folder}/${oldName}`
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

module.exports = router
