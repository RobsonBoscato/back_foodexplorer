const { Router } = require("express")

const SessionsController = require("../controllers/SessionsController")

const sessionsRoutes = Router()

// it has to be instanced because it's a class
const sessionsController = new SessionsController()

sessionsRoutes.post('/', sessionsController.create)

module.exports = sessionsRoutes