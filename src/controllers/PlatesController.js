const knex = require('../database/knex')

class PlatesController {
  async create(req, res) {
    const { title, description, tags } = req.body
    const { user_id } = req.params

    const [plate_id] = await knex("plates").insert({
      title,
      description,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        plate_id,
        name,
        user_id
      }
    })

    await knex("tags").insert(tagsInsert)

    res.json()
  }

}

module.exports = PlatesController