const express = require('express');

const router = express.Router();
const passport = require('../passport.js');

router.get('/', (req,res) =>{
  res.render('home/index.ejs');
})

router.get('/about', (req,res) =>{
  res.render('home/about.ejs');
})

router.get('/login', function (req,res) {
  let username = req.flash('username')[0];
  let errors = req.flash('errors')[0] || {};
  res.render('home/login.ejs', {
    username:username,
    errors:errors
  });
});

// Post Login // 3
router.post('/login',
  function(req,res,next){
    let errors = {};
    let isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/posts',
    failureRedirect : '/login'
  }
));

// Logout // 4
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports =router;