const express = require('express');
const router = express.Router();

// @route     GET api/contacts
// @desc      Get all user's contacts
// @access    Private
router.get('/' , (req , res) => {  
  res.send('Get all contacts');
});

// @route     GET api/contacts
// @desc      Get all user's contacts
// @access    Private
router.post('/' , (req , res) => {  
  res.send('Add contact');
});

// :id -> placeholder

// @route     PUT api/contacts/:id
// @desc      Update contacts
// @access    Private
router.put('/:id' , (req , res) => {  
  res.send('Update contacts');
});

// @route     DELETE api/contacts/:id
// @desc      delete contacts
// @access    Private
router.delete('/:id' , (req , res) => {  
  res.send('delete contacts');
});

module.exports = router;