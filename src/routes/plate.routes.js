const { Router } = require("express")

const multer = require("multer")
const uploadConfig = require('../configs/upload')

const PlatesController = require("../controllers/PlatesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const ensureAuthorization = require("../middlewares/ensureAuthorization")

const platesRoutes = Router()

const upload = multer(uploadConfig.MULTER)

// it has to be instanced because it's a class 
const platesController = new PlatesController()
platesRoutes.use(ensureAuthenticated)

platesRoutes.post('/', upload.single('image'), platesController.create)
platesRoutes.get('/', platesController.show)
platesRoutes.get('/:id', platesController.show)
platesRoutes.get('/tags/:id', platesController.index)
platesRoutes.delete('/:id', ensureAuthorization("admin"), platesController.delete)
platesRoutes.put('/:id', ensureAuthorization("admin"), upload.single('image'), platesController.update)

module.exports = platesRoutes