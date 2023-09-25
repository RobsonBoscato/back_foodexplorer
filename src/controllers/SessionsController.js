const { compare } = require('bcrypt');
const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');


class SessionsController {
  async create(req, res) {
    const { email, password } = req.body

    const user = await knex("users").where({ email }).first()

    if (!user) {
      throw new AppError("E-mail or password incorrect.", 401)
    }

    const passwordCompare = await compare(password, user.password)

    if (!passwordCompare) {
      throw new AppError("E-mail or password incorrect.", 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })


    return res.status(200).json({ user, token })
  }
}

module.exports = SessionsController