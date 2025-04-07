const mongoose = require('mongoose');
const RoleModel = require('./roleModel');
const { Schema } = mongoose;
const {
  SALT_FACTOR
} = require('../constants/constants');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  token: { type: String, default: '' },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, required: true, ref: RoleModel.collection.name },
}, { timestamps: true });

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('update', function (next) {
  const user = this
  const password = _get(user, '_update.$set.password');
  if (!password) return next()
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) return next(err)
      user._update.$set.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('user', UserSchema, 'user');
