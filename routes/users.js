const router = require('express')
  .Router();
const {
  validationCreateUser,
  validationPatchUser,
  validationPatchAvatar,
  validationGetUserId,
} = require('../middlewares/validations');
const {
  getUsers,
  createUsers,
  getUserId,
  patchUsers,
  patchAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', validationCreateUser, createUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationGetUserId, getUserId);
router.patch('/me', validationPatchUser, patchUsers);
router.patch('/me/avatar', validationPatchAvatar, patchAvatar);

module.exports = router;
