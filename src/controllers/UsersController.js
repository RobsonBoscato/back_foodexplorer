const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

const { hash } = require('bcrypt');

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new AppError('All the fields has to be fullfilled.')
    }

    if (password.length < 6) {
      throw new AppError('Password must have at least 6 characters')
    }
    const database = await sqliteConnection()

    const checkUserName = await database.get(`
    SELECT * FROM users
    WHERE name = (?)`, [name])
    if (checkUserName) {
      throw new AppError(`The name: ${name} is already in use, try changing to another.`)
    }

    const checkUserEmail = await database.get(`
    SELECT * FROM users 
    WHERE email = (?)`, [email]
    )
    if (checkUserEmail) {
      throw new AppError('Email already in use')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      `INSERT INTO users(name, email, password) 
      VALUES(?, ?, ?)`,
      [name, email, hashedPassword]
    )
    res.status(201).json("Sucessfully created user.")
  }

  async update(req, res) {
    const { name, email } = req.body
    const { id } = req.params
    const database = await sqliteConnection()

    const user = await database.get(`SELECT * FROM users WHERE id = (?)`, [id])

    if (!user) {
      throw new AppError(`User ${name} does not exist`)
    }

    const userUpdatedEmail = await database.get(
      `SELECT * FROM users
      WHERE email = (?)`, [email]
    )

    console.log(userUpdatedEmail.id);
    console.log(user.id);
    if (userUpdatedEmail && userUpdatedEmail.id !== user.id) {
      throw new AppError('That email is already in use.')
    }

    user.name = name
    user.email = email

    await database.run(`
      UPDATE users SET
      name = (?),
      email = (?),
      updated_at = (?)
      WHERE id = (?)`,
      [user.name, user.email, new Date(), id]
    )

    res.status(200).json(`User: [${user.name}] successfully updated.`)
  }
}

module.exports = UsersController;