const { Router } = require("express")

const usersRouter = require("./user.routes")
const platesRouter = require("./plate.routes")
const sessionsRoutes = require("./sessions.routes")


const routes = Router()

routes.use("/users", usersRouter)
routes.use("/plates", platesRouter)
routes.use("/sessions", sessionsRoutes)

module.exports = routes