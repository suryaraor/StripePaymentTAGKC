const mongoose = require('mongoose');

var Employee = mongoose.model('Employee', {
    name: {type: String},
    position: {type: String},
    office: {type: String},
    salary: {type: String},
    paymentStatus: {type: String},
    paymentDetails: {type: String}
});

module.exports = {Employee};