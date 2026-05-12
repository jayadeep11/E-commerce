const mongoose = require('mongoose');

const uri = "mongodb://jaydeepbellamkonda_db_user:EaMUXvTb1ffsk2Yo@ac-t1bjfba-shard-00-00.iinmfo0.mongodb.net:27017,ac-t1bjfba-shard-00-01.iinmfo0.mongodb.net:27017,ac-t1bjfba-shard-00-02.iinmfo0.mongodb.net:27017/?ssl=true&replicaSet=atlas-t1bjfba-shard-0&authSource=admin";

mongoose.connect(uri)
  .then(() => {
    console.log('Success! Connected to MongoDB without SRV.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed even without SRV:', err.message);
    process.exit(1);
  });
