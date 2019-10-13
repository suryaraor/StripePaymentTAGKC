const keyPublishable = 'pk_test_QeFpXvHGgsNTyxdlwXsYeNxH00nMvG3N2U';
const keySecret = 'sk_test_kr2rewGlZFYGNT3SkpjJQdaf002JeZnWxX';
const express = require('express');
const stripe = require("stripe")(keySecret);
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');

var {Employee} = require('../models/employee');
// => localhost:3000/employees/
router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if(!err) {res.send(docs);}
        else { console.log('Error in Retriving Employees : ' + JSON.stringify(err, undefined, 2));}
    });
});

// => localhost:3000/employees/id
router.get('/:id', (req, res) => {
   if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id: ${req.param.id}');
    
    Employee.findById(req.params.id, (err, doc) => {
        if(!err) {res.send(doc);}
        else { console.log('Error in Retriving Employee: ' + JSON.stringify(err, undefined, 2));}
    });
});

// => localhost:3000/employees/
router.post('/', (req, res) => {
    var emp = new Employee({
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary,
        paymentStatus: req.body.paymentStatus,
        paymentDetails: req.body.paymentDetails
    });
    emp.save((err, doc) => {
        if(!err) {res.send(doc);}
        else { console.log('Error in Employee Save : ' + JSON.stringify(err, undefined, 2));}
    });
    
});

router.post("/charge", (req, res) => {
    let amount = 500;
console.log(req);
    (async () => {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 1099,
          currency: 'usd',
          payment_method_types: ['card'],
        });
        res.render('checkout', { client_secret: paymentIntent.client_secret });
      })();
   
  });
  

// => localhost:3000/employees/retrieve/
router.post('/retrieve/', (req, res) => {
    var emp = new Employee({
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary
    });

    Employee.findOne({$and:[{name:req.body.name}, {position: req.body.position}]}, {}, (err, doc) => {
        if(!err) {res.send(doc);}
        else { console.log('Error in Employee retrieve : ' + JSON.stringify(err, undefined, 2));}
    })  

    
});

// => localhost:3000/employees/
router.put('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id: ${req.param.id}');

    //mongoose.set('useFindAndModify', true);

    var emp = new Employee({
        _id:req.params.id,
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary,
        paymentStatus: req.body.paymentStatus,
        paymentDetails: req.body.paymentDetails
    });

    Employee.findByIdAndUpdate(req.params.id, {$set: emp}, {new:true}, (err, doc) => {
        if(!err) {res.send(doc);}
        else { console.log('Error in Employee Update : ' + JSON.stringify(err, undefined, 2));}
    })  
    
});

// => localhost:3000/employees/id
router.delete('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id))
     return res.status(400).send('No record with given id: ${req.param.id}');
     
     Employee.findByIdAndDelete(req.params.id, (err, doc) => {
         if(!err) {res.send(doc);}
         else { console.log('Error in Deleting Employee: ' + JSON.stringify(err, undefined, 2));}
     });
 });

 
module.exports = router;