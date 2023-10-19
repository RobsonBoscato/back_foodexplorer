const { Router } = require("express")

const usersRouter = require("./user.routes")
const platesRouter = require("./plate.routes")
const sessionsRoutes = require("./sessions.routes")
const tagsRoutes = require("./tags.routes")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/plates", platesRouter)
routes.use("/sessions", sessionsRoutes)
routes.use("/tags", tagsRoutes)

module.exports = routes