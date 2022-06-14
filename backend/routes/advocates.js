'use strict';

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureAdmin, ensureLoggedIn } = require('../middleware/auth');
const Advocate = require('../models/advocate');

const newAdvoSchema = require('../schemas/advoNew.json');
const getAdvoSchema = require('../schemas/advoGet.json');
const updateAdvoSchema = require('../schemas/advoUpdate.json');

const router = new express.Router();

router.post('/', ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newAdvoSchema);

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const advocate = await Advocate.newAdvo(req.body);
    return res.status(201).json({ advocate });
  } catch (err) {
    return next(err);
  }
});

router.get('/', async function (req, res, next) {
  try {
    const querySql = req.query;

    const validator = jsonschema.validate(querySql, getAdvoSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    let advocates;

    if (!querySql) {
      advocates = await Advocate.findAll();
    } else {
      advocates = await Advocate.advoFilter(querySql);
    }

    return res.json({ advocates });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const advocate = await Advocate.get(req.params.id);
    return res.json({ advocate });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id', ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, updateAdvoSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const advocate = await Advocate.update(req.params.id, req.body);
    console.log(advocate);
    return res.json({ advocate });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', ensureAdmin, async function (req, res, next) {
  try {
    await Advocate.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
