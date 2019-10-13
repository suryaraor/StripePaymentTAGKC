const mongoose = require('mongoose');
const config = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };


mongoose.connect('mongodb://localhost"27017/CrudDB',config,  (err) => {
    if(!err)
        console.log('MongoDB connection succeeded.');
    else
        console.log('Error in DB connection: '+JSON.stringify(err, undefined, 2));
});
module.exports = mongoose;