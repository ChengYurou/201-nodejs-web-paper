const Paper = require('../model/paper');
const constant = require('../config/constant');
const async = require('async');
const Section = require('../model/section');

class PaperContorller {
  getAll(req, res, next) {
    async.series({
      papers: (cb) => {
        Paper.find({}, (err, docs)=> {
          async.map(docs, (paper, callback)=> {
            Section.findOne({paper: paper._id})
                .populate('homeworks')
                .exec((err, doc) => {
                  if (err) {
                    return next(err);
                  }
                  let paperString = paper.toJSON();
                  const data = Object.assign({}, paperString, {sections: doc.toJSON()});
                  callback(null, data);
                })
          }, cb)
        })
      },
      totalCount: (cb) => {
        Paper.count(cb)
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    async.waterfall([
      (done)=> {
        Paper.findById(req.params.paperId, done)
      },
      (paper, done) => {
        if (!paper) {
          done(true, null);
        }
        Section.findOne({paper: paper._id})
            .populate('homeworks')
            .exec((err, doc) => {

              let paperString = paper.toJSON();
              const data = Object.assign({}, paperString, {sections: doc.toJSON()});
              return done(err, data);
            })
      }
    ], (err, result) => {
      if (err === true) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    })
  }

  create(req, res, next) {
    Paper.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      res.status(constant.httpCode.CREATED).send({uri: `papers/${doc._id}`});
    })
  }

  update(req, res, next) {
    Paper.findByIdAndUpdate(req.params.paperId, req.body, (err, doc) => {
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
    const paperId = req.params.paperId;
    async.waterfall([
      (done)=> {
        Paper.findByIdAndRemove(paperId, done)
      },
      (docs, done) => {
        if (!docs) {
          return done(true, null);
        }
        Section.find({}, done);
        // Section.findAndRemove({paper: paperId}, done)
      },
      (docs, done) => {
        const sections = docs.filter(section => section.paper.toJSON() === paperId);
        Section.remove(sections, done);
      }
    ], (err) => {
      if (err === true) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      if (err) {
        return next(err);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }
}

module.exports = PaperContorller;
