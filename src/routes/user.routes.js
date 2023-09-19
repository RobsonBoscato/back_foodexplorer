const { Router } = require("express")

const UsersController = require("../controllers/UsersController")

const usersRoutes = Router()

// it has to be instanced because it's a class
const usersController = new UsersController()

usersRoutes.post('/', usersController.create)
usersRoutes.put('/:id', usersController.update)

module.exports = usersRoutes