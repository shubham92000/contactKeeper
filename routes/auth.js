const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middlewares/auth');
const { check , validationResult } = require('express-validator');
const User = require('../models/User');

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/' ,auth,async (req , res) => {  
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route     POST api/auth
// @desc      auth user and get token        login 
// @access    Public
router.post('/' , [
  check('email' , 'please include a valid email').isEmail(),
  check('password' , 'password is required').exists()
] ,async (req , res) => {  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error : errors.array()});
  }

  const {email , password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({msg : "invalid credentils"});
    }

    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch){
      return res.status(400).json({msg : 'invalid credentials'});
    }

    // console.log('USER_START');
    // console.log(user);
    // console.log('USER_END');

    const payload = {
      user : {
        id : user.id
      }
    }
    
    // console.log('PAYLOAD_START');
    // console.log(payload);
    // console.log('PAYLOAD_END');

    jwt.sign(payload , config.get('jwtSecret') , {
      expiresIn:360000
    } , (err,token) => {
      if(err){
        throw err;
      }
      res.json({token});
    });

  }catch(err){
    console.error(err.message);
    res.status(500).send('server error');
  }

});

module.exports = router;