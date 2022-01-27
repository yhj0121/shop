const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./router/auth.js');
const homeRouter = require('./router/home.js');
const methodOverride = require('method-override');
const app = express();
const  config  = require('./config.js');

app.set("view engine", "ejs");

mongoose.connect(config.db.host,{
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => console.log(
  'Successfully connected to mongoDB!'
)).catch(e => console.error(e));

app.use(express.json());
app.use(express.static(__dirname+'/public'));
app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use('/', homeRouter);
app.use('/users', userRouter );





app.use((err,req,res,next) =>{
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
  res.status(err.status || 500);
  res.render('error');
});


app.listen(8000,() =>{
  console.log("서버 가동");
})