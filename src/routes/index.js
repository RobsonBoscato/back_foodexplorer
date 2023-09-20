const { Router } = require("express")

const usersRouter = require("./user.routes")
const platesRouter = require("./plate.routes")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/plates", platesRouter)

module.exports = routes