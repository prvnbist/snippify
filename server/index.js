const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')
const fs = require('fs')
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

app.get('/file', (req, res) => {
	const { type, name } = req.query
	const filePath = `${defaultLocation}/snippets/${type}/${name}`
	fs.readFile(filePath, (err, data) => {
		if (err) return err
		res.status(200).send({ file: data.toString() })
	})
})

// Create Files
app.post('/file', isFileAttached, (req, res) => {
	const { file } = req.files
	const saveLocation = `${defaultLocation}/snippets/${
		file.mimetype.split('/')[1]
	}`
	const savePath = `${saveLocation}/${file.name}`
	if (!fs.existsSync(saveLocation)) {
		fs.mkdirSync(saveLocation, { recursive: true })
	}
	fs.writeFile(savePath, file.data.toString(), err => {
		if (err) throw err
		res.status(200).send({ message: 'The file has been saved!' })
	})
})

// Delete Files
app.delete('/file', (req, res) => {
	const filePath = `${defaultLocation}/snippets/${req.body.type}/${req.body.fileName}`
	fs.unlink(filePath, err => {
		if (err) throw err
		res.status(200).send({ message: 'File has been deleted' })
	})
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '/client/build/index.html'))
})

const PORT = 4000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
