const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')

const app = express()

const snippetRoutes = require('./routes/snippet')
const labelRoutes = require('./routes/label')

// default options
app.use(fileUpload())

app.use(express.static(path.join(__dirname, '..', '/client/build')))

//Snippet and label routes
app.use(snippetRoutes)
app.use(labelRoutes)

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '/client/build/index.html'))
})

const PORT = 4000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
