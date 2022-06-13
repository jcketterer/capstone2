'use strict';

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin, ensureAdminOrCorrectUser } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const { createToken } = require('../helper/token');
const userNewJson = require('../schemas/userNew.json');
const userUpdateJson = require('../schemas/userUpdate.json');

const router = express.Router();

router.post('/', async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewJson);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

router.get('/', ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.get('/:username', ensureAdminOrCorrectUser, async function (req, res, next) {
  try {
    const user = await User.getOneUser(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:username', ensureAdminOrCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateJson);

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  } catch (err) {
    return next(err);
  }
});

router.delete('/:username', ensureAdminOrCorrectUser, async function (req, res, next) {
  try {
    await User.deleteUser(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
