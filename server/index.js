const fileUpload = require('express-fileupload')
const express = require('express')
const path = require('path')

const app = express()

// default options
app.use(fileUpload())

app.use(express.static(path.join(__dirname, '..', '/client/build')))

// Routers
const labelRouter = require('./routes/label');
const snippetRouter = require('./routes/snippet');

app.use(labelRouter);
app.use(snippetRouter);


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', '/client/build/index.html'))
})

const PORT = 4000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
