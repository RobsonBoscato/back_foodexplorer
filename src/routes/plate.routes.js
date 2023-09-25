const { Router } = require("express")

const PlatesController = require("../controllers/PlatesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const platesRoutes = Router()

// it has to be instanced because it's a class 
const platesController = new PlatesController()
platesRoutes.use(ensureAuthenticated)


platesRoutes.post('/', platesController.create)
platesRoutes.get('/:id', platesController.show)
platesRoutes.get('/', platesController.index)
platesRoutes.delete('/:id', platesController.delete)

module.exports = platesRoutes