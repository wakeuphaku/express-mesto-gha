const router = require('express').Router();
const {
  getUsers,
  createUsers,
  getUserId,
  patchUsers,
  patchAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserId);
router.patch('/me', patchUsers);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
