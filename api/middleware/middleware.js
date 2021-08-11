const User = require('../users/users-model.js')

function logger(req, res, next) {
  console.log( req.method, req.url, Date.now());
  next();
}

const validateUserId = async (req, res, next) => {
  try{
    const {id} = req.params
    const user = await User.getById(id)
    if(!user) {
      res.status(404).json(`No user with ${id}`)
    } else {
      req.user = user
      next()
    }
  } catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
}

function validateUser(req, res, next) {
  if(!req.body.name) {
    res.status(400).json("Name is required")
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body.text){
    res.status(400).json("Text is required")
  } else {
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}