const { Router } = require("express")

const multer = require("multer")
const uploadConfig = require('../configs/upload')

const PlatesController = require("../controllers/PlatesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const ensureAuthorization = require("../middlewares/ensureAuthorization")
const PlateImageController = require("../controllers/PlateImageController")

const platesRoutes = Router()

const upload = multer(uploadConfig.MULTER)

// it has to be instanced because it's a class 
const platesController = new PlatesController()
const plateImageController = new PlateImageController()
platesRoutes.use(ensureAuthenticated)

platesRoutes.post('/', ensureAuthorization("admin"), platesController.create)
platesRoutes.get('/', platesController.show)
platesRoutes.get('/:id', platesController.show)
platesRoutes.get('/tags/:id', platesController.index)
platesRoutes.delete('/:id', ensureAuthorization("admin"), platesController.delete)
platesRoutes.patch('/:id', ensureAuthorization("admin"), upload.single('image'), plateImageController.update)

module.exports = platesRoutes