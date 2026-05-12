const mongoose = require('mongoose');

const uri = "mongodb://jaya:c8LSkJAT1WfiOlfY@ac-t1bjfba-shard-00-00.iinmfo0.mongodb.net:27017/e-commerce?ssl=true&authSource=admin";

mongoose.connect(uri)
  .then(() => {
    console.log('Success! Connected with direct host.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed with direct host:', err.message);
    process.exit(1);
  });
