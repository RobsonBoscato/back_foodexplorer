const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

//middleware for ensure authentication
function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token required.', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { role, sub: user_id } = verify(token, authConfig.jwt.secret)

    req.user = {
      id: Number(user_id),
      role
    }
    return next()

  } catch (error) {
    throw new AppError('JWT token not valid')
  }
}

module.exports = ensureAuthenticated