const express = require('express');

const  User  = require('../model/User.js');
const router = express.Router();



router.get('/', (req,res) =>{
  User.find({})
  .sort({username:1})
  .exec((err,users) => {
    if(err) return res.json(err);
    res.render('users/index.ejs', {users:users})
  })
})

router.get('/new', (req,res) =>{
  res.render('users/new.ejs');
})

router.post('/', (req,res) =>{
  User.create(req.body, (err,user) =>{
    if(err) return res.json(err);
    res.redirect('/users');
  })
})


router.get('/:username', function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render('users/show.ejs', {user:user});
  });
});


router.get('/:username/edit', (req,res) =>{
  User.findOne({username:req.params.username}, (err,user) =>{
    if(err) return res.json(err);
    res.render('users/edit.ejs' ,{user:user})
  })
})

router.put('/:username', function(req, res, next){
  User.findOne({username:req.params.username}) // 2-1
    .select('password') // 2-2
    .exec(function(err, user){
      if(err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
      for(var p in req.body){ // 2-4
        user[p] = req.body[p];
      }

      // save updated user
      user.save(function(err, user){
        if(err) return res.json(err);
        res.redirect('/users/'+user.username);
      });
  });
});

// destroy
router.delete('/:username', function(req, res){
  User.deleteOne({username:req.params.username}, function(err){
    if(err) return res.json(err);
    res.redirect('/users');
  });
});

module.exports = router;

