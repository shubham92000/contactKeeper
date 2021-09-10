const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { check , validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route     GET api/contacts
// @desc      Get all user's contacts
// @access    Private
router.get('/' , auth , async (req , res) => {  
  try {

    // console.log('START');

    console.log(req);

    // console.log('END');

    const contacts = await Contact.find({user : req.user.id }).sort({date : -1});
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route     POST api/contacts
// @desc      add user's contact
// @access    Private
router.post('/' , [auth , [
  check('name' , 'Name is required').not().isEmpty()
]] ,async (req , res) => {  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error : errors.array()});
  }

  const {name , email , phone , type} = req.body;

  try {
    const newContact = new Contact({
      name , 
      email ,
      phone , 
      type ,
      user : req.user.id
    })

    const contact = await newContact.save();

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }

});

// :id -> placeholder

// @route     PUT api/contacts/:id
// @desc      Update contacts
// @access    Private
router.put('/:id' ,auth ,async (req , res) => {  
  const {name , email , phone , type} = req.body;

  //build a contact object
  const contactField = {};
  if(name){
    contactField.name = name;
  }
  if(email){
    contactField.email = email;
  }
  if(phone){
    contactField.phone = phone;
  }
  if(type){
    contactField.type = type;
  }

  try {
    let contact = await Contact.findById(req.params.id);
    if(!contact){
      res.status(400).json({msg : 'contact not found'});
    }

    //make sure user owns that contact
    // console.log(contact.user.toString());
    // console.log(req.user.id);
    if(contact.user.toString() !== req.user.id){
      return res.status(401).json({msg : 'not authorized'});
    }

    contact = await Contact.findByIdAndUpdate(req.params.id , {
       $set : contactField
    } , 
    {
      new : true
    });

    res.json(contact);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route     DELETE api/contacts/:id
// @desc      delete contacts
// @access    Private
router.delete('/:id' , auth , async (req , res) => {  
  try {
    let contact = await Contact.findById(req.params.id);
    if(!contact){
      res.status(400).json({msg : 'contact not found'});
    }

    //make sure user owns that contact
    // console.log(contact.user.toString());
    // console.log(req.user.id);
    if(contact.user.toString() !== req.user.id){
      return res.status(401).json({msg : 'not authorized'});
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({msg : 'contact removed'});

  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;