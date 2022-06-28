'use strict';

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureAdmin, ensureLoggedIn } = require('../middleware/auth');
const Skill = require('../models/skill');

const skillNewSchema = require('../schemas/skillNew.json');
const skillGetSchema = require('../schemas/skillGet.json');
const skillUpdateSchema = require('../schemas/skillUpdate.json');

const router = new express.Router();

router.post('/', ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, skillNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const skill = await Skill.newSkill(req.body);
    return res.status(201).json({ skill });
  } catch (err) {
    return next(err);
  }
});

router.get('/', ensureLoggedIn, async function (req, res, next) {
  try {
    const query = req.query;
    console.log(query);
    const validator = jsonschema.validate(query, skillGetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    let skills;

    if (!query) {
      skills = await Skill.findAll();
    } else {
      skills = await Skill.findEmailsPerSkill(query);
    }

    return res.json({ skills });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', ensureAdmin, async function (req, res, next) {
  try {
    const query = req.query;
    console.log(query);
    const validator = jsonschema.validate(query, skillGetSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    let skill = await Skill.getSkill(req.params.id);

    return res.json({ skill });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:name', ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, skillUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const skills = await Skill.renameSkill(req.params.name, req.body);
    return res.json({ skills });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:name', ensureAdmin, async function (req, res, next) {
  try {
    await Skill.removeSkill(req.params.name);
    return res.json({ deleted: req.params.name });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
