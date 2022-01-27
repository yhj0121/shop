const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const  config  = require('../config.js');


const UserSchema = new mongoose.Schema({
  username: {
    type:String,
    required:[true,"아이디는 필수입니다"],
    match:[/^.{4,12}/, "4~12글자로 적어주세요"],
    trim:true,
    unique:true
  },
  name: {
    type:String,
    match:[/^.{4,12}/, "4~12글자로 적어주세요"],
    trim:true
    
  },
  password: {
    type:String,
    required:[true,"비밀번호는 필수입니다"],
    select:false,
    trim : true

  },

  created_at : {
    type : Date,
    default : Date.now()
},
email: {
  type: String, required: true,
  unique: true, 
  lowercase: true,
  match:[/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i,'이메일 형식을 맞춰주세요'],
  
  trim:true

}

},{
  toObject:{virtuals:true}

});



UserSchema.virtual('passwordConfirmation')
.get(function(){return this.passwordConfirmation;})
.set(function(value){this._passwordConfirmation=value;});

UserSchema.virtual('originalPassword')
.get(function(){ return this._originalPassword})
.set(function(value){this._originalPassword=value;});

UserSchema.virtual('newPassword')
.get(function(){ return this._newPassword})
.set(function(value){this._newPassword=value;});

UserSchema.virtual('currentPassword')
.get(function(){ return this._currentPassword})
.set(function(value){this._currentPassword=value;});

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;  //validation할 패스워드
const errorMessage = "영문자 8글자 이상은 적어주세요";

UserSchema.path('password').validate(function(v){
  var user = this;

  if(!user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', "password confirmation is required");
    }

    if(user.password !== user.passwordConfirmation){
      user.invalidate('passwordConfirmation', "password confirmation does not matched");
    }
  }



  if(!user.isNew)
  {
    if(!user.currentPassword)
    {
      user.invalidate("currentPassword","currentPassword is required");
    } else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate("currentPassword", "currentPassword is invaild");
    }

    if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
})



UserSchema.pre('save', function(next){
  const user=this;
  if(user.isModified('password')){
      bcrypt.genSalt(config.bc.salt, function(err, salt) {
          if(err) return next(err);
          bcrypt.hash(user.password, salt, function(err, hash) {
              if(err) return next(err);
              // 해쉬화된 비밀번호로 변경
              user.password=hash;
              next();
          });
      });
  }
});


const User = mongoose.model('user' , UserSchema);
module.exports = User;
