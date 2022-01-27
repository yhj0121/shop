const express = require('express');

const router = express.Router();

router.get('/', (req,res) =>{
  res.render('home/index.ejs');
})

router.get('/about', (req,res) =>{
  res.render('home/about.ejs');
})

module.exports = router;