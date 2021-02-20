const express = require('express')
const server = express()
const carsRouter = require('./routes/cars-router')

server.use(express.json())
server.use('/cars', carsRouter)

module.exports = server