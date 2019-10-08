const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const app = express()

const snippetRoutes = require('./routes/snippet');
const labelRoutes = require('./routes/label');

// default options
app.use(fileUpload())

app.use(express.static(path.join(__dirname, '..', '/client/build')))

const defaultLocation = '..'

app.use(snippetRoutes);

app.post('/createLabel', (req, res) => {
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

app.delete('/deleteLabel', (req, res) => {
	const { folder } = req.query
	const folderPath = `${defaultLocation}/snippets/${folder}`
	return rimraf(folderPath, error => {
		if(error) return res.status(400).send({
			success: false,
			message: `Could not delete ${folder} folder!`
		})
		return res.status(200).send({
			success: true,
			message: `Folder ${folder} deleted successfully!`
		})
	})
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '/client/build/index.html'))
})

const PORT = 4000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
