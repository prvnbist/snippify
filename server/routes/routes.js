const express = require('express')

const routes = express.Router()

const snippet = require('./snippet.js')

const label = require('./label')

routes.get('/snippet/', snippet.show)

routes.get('/label/', label.show)

module.exports = routes
