const mongoose = require('mongoose');
const config = require('config');
const refreshMongo = require('./tool/mongoTool');

mongoose.connect(config.get('mongoUri'), (err, doc) => {
  if (err) {
    console.log('connect error');
  } else {
    console.log('connect success');
    refreshMongo(()=> {
      console.log('refreshMongo success');
      process.exit(0);
    })
  }
})