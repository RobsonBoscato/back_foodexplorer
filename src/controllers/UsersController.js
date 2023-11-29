const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

const { hash, compare } = require('bcrypt');

class UsersController {
  async create(req, res) {
    const { name, email, password, role, ...rest } = req.body

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
    const { name, email, password, old_password } = req.body
    const user_id = req.user.id
    const database = await sqliteConnection()

    const user = await database.get(`SELECT * FROM users WHERE id = (?)`, [user_id])

    if (!user) {
      throw new AppError(`User ${name} does not exist`)
    }

    const userUpdatedEmail = await database.get(
      `SELECT * FROM users WHERE email = (?)`, [email]
    )

    if (userUpdatedEmail && userUpdatedEmail.id !== user.id) {
      throw new AppError('That email is already in use.')
    }

    //Nullish operator when not provided the fields info
    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password.length < 6) {
      throw new AppError('New password must have at least 6 characters')
    }
    if (password && !old_password) {
      throw new AppError('You should provide the old password to change it.')
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password)
      if (!checkPassword) {
        throw new AppError('Old password incorrect.')
      }
    }

    if (password) {
      user.password = await hash(password, 8)
    }

    await database.run(`
      UPDATE users SET
      name = (?),
      email = (?),
      password = (?),
      updated_at = DATETIME('now')
      WHERE id = (?)`,
      [user.name, user.email, user.password, user_id]
    )

    res.status(200).json(`User: ${user.name}, successfully updated.`)
  }
}

module.exports = UsersController;