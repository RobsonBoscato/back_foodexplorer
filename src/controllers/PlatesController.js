const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require("../providers/diskStorage")

class PlatesController {
  async create(req, res) {
    const { title, description, category, price, tags } = req.body
    const user_id = req.user.id

    console.log(req.body);
    const plateFileName = req.file.filename
    const diskStorage = new DiskStorage();

    if (!plateFileName) {
      throw new AppError('A imagem é um campo obrigatório!');
    }

    const filename = await diskStorage.save(plateFileName);

    const [plate_id] = await knex("plates").insert({
      user_id,
      title,
      category,
      price,
      image: filename,
      description
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
    const { title } = req.query

    let plates;
    if (id) {
      plates = await knex("plates").where("id", id)

    }
    else if (title) {
      plates = await knex("plates").whereLike("title", `%${title}%`)

    } else {
      plates = await knex("plates")
    }

    return res.json({
      ...plates
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
    const { title, tags, plate_id } = req.params
    const user_id = req.user.id

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

  async update(req, res) {

    const { id } = req.params;
    const { name, price, description, category, ingredients } = req.body;
    const dishTags = JSON.parse(ingredients);

    const dish = await knex('plates').where({ id }).first();
    if (!dish) {
      throw new AppError('Could not find the dish');
    }

    if (req.file) {
      const dishFilename = req.file.filename;
      const diskStorage = new DiskStorage();

      if (dishFilename) {
        await diskStorage.delete(dish.image);
        const filename = await diskStorage.save(dishFilename);
        dish.image = filename;
      }
    }

    dish.name = name ?? dish.name;
    dish.price = price ?? dish.price;
    dish.description = description ?? dish.description;
    dish.image, (dish.category = category ?? dish.category);

    await knex('plates').where({ id }).update({
      name: dish.name,
      price: dish.price,
      description: dish.description,
      image: dish.image,
      category: dish.category,
      updated_at: knex.fn.now(),
    });

    const tagsInsert = dishTags.map((tag) => {
      return {
        plates_id: id,
        title: tag,
      };
    });

    await knex('tags').where('plates_id', id).delete();

    await knex('tags').insert(tagsInsert);

    return res.json('Update sucessfully completed.');
  }
}

module.exports = PlatesController