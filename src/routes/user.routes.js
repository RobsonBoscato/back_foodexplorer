const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require('../configs/upload')

const UsersController = require("../controllers/UsersController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")


const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

// it has to be instanced because it's a class
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)
usersRoutes.put('/', ensureAuthenticated, usersController.update)
usersRoutes.patch('/image', ensureAuthenticated, upload.single('image'), (req, res) => {
  console.log(req.file.filename)
  res.json('bah')
})

module.exports = usersRoutes