// const knex = require('knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/diskStorage')
const sqliteConnection = require('../database/sqlite');

class PlateImageController {
  async update(req, res) {
    const plate_id = req.params.id
    const imageFileName = req.file.filename

    const diskStorage = new DiskStorage()
    const database = await sqliteConnection()

    const knex = require('knex');
    const config = require('../../knexfile');

    const db = knex(config.development)

    const plate = await db.select('*').from('plates').where({ id: plate_id });

    if (!plate) {
      throw new AppError('there is no plate with the id specified', 401)
    }

    if (plate.image) {
      await diskStorage.deleteFile(plate.image)
    }

    const filename = await diskStorage.save(imageFileName)
    plate.image = filename

    await database.run(`
      UPDATE plates SET
      image = (?),
      updated_at = DATETIME('now')
      WHERE id = (?)`,
      [plate.image, plate_id]
    )

    return res.json(plate)
  }
}

module.exports = PlateImageController