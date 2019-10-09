const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const app = express()

const { isFileAttached } = require('./utils/middlewares')
const { getAllFiles } = require('./utils/files.js')

// default options
app.use(fileUpload())

app.use(express.static(path.join(__dirname, '..', '/client/build')))

const defaultLocation = '..'

// Get list of all files
app.get('/files', (req, res) => {
	return getAllFiles(`${defaultLocation}/snippets`).then(files =>
		res.send({ files })
	)
})

//Rotas
app.use('/', require('./routes/routes.js'))

app.get('/file', (req, res) => {
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
app.post('/saveSnippet', isFileAttached, (req, res) => {
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
app.delete('/deleteSnippet', (req, res) => {
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
app.post('/renameSnippet', (req, res) => {
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
		if (error)
			return res.status(400).send({
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
