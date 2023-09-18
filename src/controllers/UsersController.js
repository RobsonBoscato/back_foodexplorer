const AppError = require('../utils/AppError');

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    if (!name) {
      throw new AppError('Please enter a name')
    }
    res.status(201).json({ name, email, password })
  }

  async update(req, res) {

  }
}

module.exports = UsersController;