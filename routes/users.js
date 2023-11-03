const router = require('express').Router();
const {
  getUsers,
  createUsers,
  getUserId,
  patchUsers,
  patchAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUsers);
router.get('/:userId', getUserId);
router.patch('/me', patchUsers);
router.patch('/me/avatar', patchAvatar);
router.patch('/sing-in', login);

module.exports = router;
