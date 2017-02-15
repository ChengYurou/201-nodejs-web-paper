const constant = require('../config/constant');
const async = require('async');
const Section = require('../model/section');

class SectionContorller {
  getAll(req, res, next) {
    async.series({
      sections: (cb) => {
        Section.find({})
            .populate('homeworks', 'paper')
            .exec(cb)
      },
      totalCount: (cb) => {
        Section.count(cb)
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    Section.findById(req.params.sectionId)
        .populate('homeworks', 'paper')
        .exec((err, doc) => {
          if (err) {
            return next(err);
          }
          if (!doc) {
            return res.sendStatus(constant.httpCode.NOT_FOUND);
          }
          return res.status(constant.httpCode.OK).send(doc);
        })
  }

  create(req, res, next) {
    Section.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      res.status(constant.httpCode.CREATED).send({uri: `sections/${doc._id}`});
    })
  }

  update(req, res, next) {
    Section.findByIdAndUpdate(req.params.sectionId, req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }

  delete(req, res, next) {
    Section.findByIdAndRemove(req.params.sectionId, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }
}

module.exports = SectionContorller;
