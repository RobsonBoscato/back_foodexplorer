const knex = require('../database/knex')
const AppError = require('../utils/AppError')

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

    res.json(`Sucessfully created a plate with id: ${plate_id}`)
  }

  async show(req, res) {
    const { id } = req.params

    const plate = await knex("plates").where({ id }).first()

    if (!plate) {
      throw new AppError(`There is no plate with id: ${id}`)

    }
    const tags = await knex("tags").where({ plate_id: id }).orderBy('name')

    return res.json({
      ...plate,
      tags
    })
  }

  async delete(req, res) {
    const { id } = req.params

    const plateToDelete = await knex("plates").where({ id }).delete()
    if (!plateToDelete) {
      throw new AppError(`There is no plate with id: ${id}`)
    }

    res.json(`Sucessfully deleted the plate id: ${id}`)
  }

  async index(req, res) {
    const { user_id, title, tags } = req.query

    let plates

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      plates = await knex("tags")
        .select([
          "plates.id",
          "plates.title",
          "plates.user_id",
        ])
        .where("plates.user_id", user_id)
        .whereIn("name", filterTags)
        .innerJoin("plates", "plates.id", "tags.plate_id")

    } else {
      plates = await knex("plates")
        .where({ user_id })
        .whereLike("description", `%${title}%`)
        .orderBy("id")
    }

    const userTags = await knex("tags").where({ user_id })
    const platesWithTags = plates.map(plate => {
      const plateTags = userTags.filter(tag => tag.plate_id === plate.id)

      return {
        ...plate,
        tags: plateTags
      }
    })

    return res.json(platesWithTags)
  }
}

module.exports = PlatesController