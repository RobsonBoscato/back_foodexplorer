const knex = require('knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/diskStorage')

class PlateImageController {
  async update(req, res) {
    const plate_id = req.user.id
    console.log(plate_id);
    const imageFileName = req.file.filename
    const diskStorage = new DiskStorage()

    const user = await knex('plates').where({ id: user_id })
      .first()

    if (!user) {
      throw new AppError('Only authenticated users can upload images', 401)
    }

    if (user.image) {
      await diskStorage.deleteFile(user.image)
    }

    const filename = await diskStorage.saveFile(imageFileName)
    user.image = filename

    await knex('plates').update(user).where({ id: user.id })

    return res.json(user)
  }
}

module.exports = PlateImageController