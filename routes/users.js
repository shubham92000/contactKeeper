const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check , validationResult } = require('express-validator');

const User = require('../models/User');

// @route     POST api/users
// @desc      Register a User     register and get jwt to enter inside the web app directly
// @access    Public
router.post('/' , [
  check('name' , 'Please add a name').not().isEmpty(),
  check('email' , 'Please include a valid email').isEmail(),
  check('password' , 'Please enter a valid password with 6 or more characters').isLength({min : 6})
] ,async (req , res) => {  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error : errors.array()});
  }
  

  const { name , email , password } = req.body;

  try{
    let user = await User.findOne({ email });
    if(user){
      return res.status(400).json({msg : "user already exists" });
    }

    user = new User({
      name ,
      email ,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password , salt);
    // console.log('-------------------------------------------------------------------------------------------------------------------');
    // console.log('START');
    // console.log(user);
    // console.log('END');
    // console.log('-------------------------------------------------------------------------------------------------------------------');
    //save the user
    await user.save();
    
    // console.log('-------------------------------------------------------------------------------------------------------------------');
    // console.log('START');
    // console.log(user);
    // console.log('END');
    // console.log('-------------------------------------------------------------------------------------------------------------------');

    // console.log('-------------------------------------------------------------------------------------------------------------------');
    // try {
    //   console.log(user.id);
    //   console.log(user._id); 
    // } catch (error) {
    //   console.log(console.error);
    // }
    // console.log('-------------------------------------------------------------------------------------------------------------------');

    //send jwt
    const payload = {
      user : {
        id : user.id
      }
    }
    
    jwt.sign(payload , config.get('jwtSecret') , {
      expiresIn:360000
    } , (err,token) => {
      if(err){
        throw err;
      }
      res.json({token});
    });

  }catch(err){
    console.log(err.message);
    res.status(500).send('server error');
  }

});

module.exports = router;