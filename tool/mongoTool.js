const section = require('./fixtrue/section');
const paper = require('./fixtrue/paper');
const homework = require('./fixtrue/homework');

const Section = require('../model/section');
const Paper = require('../model/paper');
const Homework = require('../model/homework');

const modelMap = [Section, Paper, Homework];
const data = {
  Section: section,
  Paper: paper,
  Homework: homework
};

module.exports = (done) => {
  let count = 0;
  modelMap.forEach(Model => {
    Model.remove({}, () => {
      Model.create(data[Model.modelName], (err, docs) => {
        count++;
        if (count === modelMap.length) {
          done();
        }
      })

    })
  })
}