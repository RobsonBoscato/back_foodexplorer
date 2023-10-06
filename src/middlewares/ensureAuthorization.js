const AppError = require("../utils/AppError")

function ensureAuthorization(roleVerify) {
  return (req, res, next) => {
    const { role } = req.user

    if (role !== roleVerify) {
      console.log(roleVerify);
      throw new AppError('Unauthorized, allowed for Admins only', 401)
    }

    return next()
  }
}
module.exports = ensureAuthorization