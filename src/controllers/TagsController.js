const knex = require('../database/knex');

class TagsController {
  async index(req, res) {
    const { plate_id } = req.params;

    const tags = await knex('tags').where({ plate_id });

    return res.json(tags);
  }
}

module.exports = TagsController;