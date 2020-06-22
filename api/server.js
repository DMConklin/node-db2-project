const express = require("express");
const carsRouter = require('../cars/router-cars')

const server = express();

server.use(express.json());
server.use(carsRouter)

module.exports = server;
