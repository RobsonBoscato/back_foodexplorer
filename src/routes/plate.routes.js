const { Router } = require("express")

const PlatesController = require("../controllers/PlatesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const ensureAuthorization = require("../middlewares/ensureAuthorization")

const platesRoutes = Router()

// it has to be instanced because it's a class 
const platesController = new PlatesController()
platesRoutes.use(ensureAuthenticated)


platesRoutes.post('/', ensureAuthorization("admin"), platesController.create)
platesRoutes.get('/:id', platesController.show)
platesRoutes.get('/', platesController.index)
platesRoutes.delete('/:id', ensureAuthorization("admin"), platesController.delete)

module.exports = platesRoutes