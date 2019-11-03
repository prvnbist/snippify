const express = require('express')
const fs = require('fs')
const rimraf = require('rimraf')

const router = new express.Router()

const defaultLocation = '..'

router.get('/', (req, res) => {
	const location = `${defaultLocation}/snippets`
	if (!fs.existsSync(location)) {
		fs.mkdirSync(location, { recursive: true })
	}
	return res.status(200).send({ labels: fs.readdirSync(location) })
})

router.get('/:name', (req, res) => {
	const { name } = req.params
	const location = `${defaultLocation}/snippets/${name}`
	if (fs.existsSync(location)) {
		return res.status(200).send({ files: fs.readdirSync(location) })
	}
	return res
		.status(404)
		.send({ success: false, message: "Label doesn't exists!" })
})

router.post('/create', (req, res) => {
	const { label } = req.body
	const folderPath = `${defaultLocation}/snippets/${label}`
	if (fs.existsSync(folderPath)) {
		return res.send({
			success: false,
			message: `Label ${label} already exists!`
		})
	}
	return fs.mkdir(folderPath, { recursive: true }, error => {
		if (error)
			return res.send({
				success: false,
				message: `Label ${label} could not be created!`
			})
		return res.send({
			success: true,
			message: `Label ${label} has been created!`
		})
	})
})

router.delete('/delete/:name', (req, res) => {
	const { name } = req.params
	const folderPath = `${defaultLocation}/snippets/${name}`
	return rimraf(folderPath, error => {
		if (error)
			return res.status(400).send({
				success: false,
				message: `Could not delete ${name} label!`
			})
		return res.status(200).send({
			success: true,
			message: `Label ${name} deleted successfully!`
		})
	})
})

// Rename Label
router.post('/rename', (req, res) => {
	const { oldName, newName } = req.body
	const oldPath = `${defaultLocation}/snippets/${oldName}`
	const newPath = `${defaultLocation}/snippets/${newName}`
	if (fs.existsSync(newPath)) {
		return res.status(200).send({
			success: false,
			message: `Label ${newName} already exists!`
		})
	}
	fs.rename(oldPath, newPath, err => {
		if (err)
			return res.status(404).send({
				success: false,
				message: `Label ${oldName} doesn't exist!`
			})
		return res.status(200).send({
			success: true,
			message: `Label ${oldName} has been renamed to ${newName}!`
		})
	})
})

module.exports = router
