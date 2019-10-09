const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')

const app = express()

// default options
app.use(fileUpload())

app.use(express.static(path.join(__dirname, '..', '/client/build')))

// Routers
const label = require('./routes/label');
const snippet = require('./routes/snippet');

app.use('/label', label);
app.use('/snippet', snippet);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '/client/build/index.html'))
})

const PORT = 4000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
