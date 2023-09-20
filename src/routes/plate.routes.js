const { Router } = require("express")

const PlatesController = require("../controllers/PlatesController")

const platesRoutes = Router()

// it has to be instanced because it's a class 
const platesController = new PlatesController()

platesRoutes.post('/:user_id', platesController.create)

module.exports = platesRoutes