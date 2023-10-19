const { Router } = require("express")
const tagsRoutes = Router()

const TagsController = require("../controllers/TagsController")

// it has to be instanced because it's a class
const tagsController = new TagsController()



tagsRoutes.get('/:plate_id', tagsController.index)

module.exports = tagsRoutes