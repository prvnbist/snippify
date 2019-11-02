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
			message: `Folder ${label} already exists!`
		})
	}
	return fs.mkdir(folderPath, { recursive: true }, error => {
		if (error)
			return res.send({
				success: false,
				message: `Folder ${label} could not be created!`
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
				message: `Could not delete ${name} folder!`
			})
		return res.status(200).send({
			success: true,
			message: `Folder ${name} deleted successfully!`
		})
	})
})

module.exports = router
