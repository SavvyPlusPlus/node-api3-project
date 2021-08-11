const express = require('express');
const { validatePost, validateUser, validateUserId } = require('../middleware/middleware');
const User = require('./users-model.js');
const Post = require('../posts/posts-model.js');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  User.get(req.query)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log('error retrieving users');
      res.status(500).json({
        message: err.message
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params
  User.getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      })
    })
});

router.post('/', validatePost, (req, res) => {
  Post.insert(req.body)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const changes = req.body;
  User.update(req.params.id, changes)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: 'The user could not be found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'User has been deleted' })
    })
    .catch((err) => {
      res.status(500).json({ message: err.message })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  User.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error getting posts from user' })
    });
});

router.post('/:id/posts', validateUserId, validateUser, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };
  Post.insert(postInfo)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
});

// do not forget to export the router
module.exports = router