const Homework = require('../model/homework');
const constant = require('../config/constant');
const async = require('async');
const Section = require('../model/section');

const loadHomeworkUri = (homeworkId) => {
  return {uri: `homeworks/${homeworkId}`}
};

class HomeworkContorller {
  getAll(req, res, next) {
    async.series({
      homeworks: (cb) => {
        Homework.find({}, (err, doc) => {
          const data = doc.map(homework => {
            const homeworkString = homework.toJSON();
            return Object.assign({}, homeworkString, loadHomeworkUri(homeworkString._id));
          });
          cb(null, data);
        })
      },
      totalCount: (cb) => {
        Homework.count(cb)
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    Homework.findById(req.params.homeworkId, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      let homeworkString = doc.toJSON();
      const data = Object.assign({}, homeworkString, loadHomeworkUri(homeworkString._id));
      return res.status(constant.httpCode.OK).send(data);
    })
  }

  create(req, res, next) {
    Homework.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      res.status(constant.httpCode.CREATED).send(loadHomeworkUri(doc._id));
    })
  }

  update(req, res, next) {
    Homework.findByIdAndUpdate(req.params.homeworkId, req.body, (err, doc) => {
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
    const homeworkId = req.params.homeworkId;
    async.waterfall([
      (done) => {
        Section.findOne({'homeworks': homeworkId}, done)
      },
      (data, done) => {
        if (data) {
          return done(true, null);
        }
        Homework.findByIdAndRemove(homeworkId, done)
      }
    ], (err, result) => {
      if(err === true) {
        return res.sendStatus(constant.httpCode.BAD_REQUEST);
      }
      if(!result) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }
}

module.exports = HomeworkContorller;
