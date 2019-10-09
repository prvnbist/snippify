const express = require('express');
const fs = require('fs');
const rimraf = require('rimraf')


const router = new express.Router();

const defaultLocation = '..'

router.post('/create', (req, res) => {
	const { folder } = req.query
	const folderPath = `${defaultLocation}/snippets/${folder}`
	if (fs.existsSync(folderPath)) {
		return res.send({
			success: false,
			message: `Folder ${folder} already exists!`
		})
	}
	return fs.mkdir(folderPath, { recursive: true }, error => {
		if (error)
			return res.send({
				success: false,
				message: `Folder ${folder} could not be created!`
			})
		return res.send({
			success: true,
			message: `Label ${folder} has been created!`
		})
	})
})

router.delete('/delete', (req, res) => {
	const { folder } = req.query
	const folderPath = `${defaultLocation}/snippets/${folder}`
	return rimraf(folderPath, error => {
		if (error) return res.status(400).send({
			success: false,
			message: `Could not delete ${folder} folder!`
		})
		return res.status(200).send({
			success: true,
			message: `Folder ${folder} deleted successfully!`
		})
	})
})

module.exports = router;