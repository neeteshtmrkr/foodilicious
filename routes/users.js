var express = require('express');
const bodyParser=require('body-parser');
var User=require('../modals/user');
var passport=require('passport');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req,res,next){
  User.register(new User({username:req.body.username}),
  req.body.password,(err,user)=>{
    if(err){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      passport.authenticate('local')(req,res,()=>{
        res.statusCode=200;//OK
        res.setHeader('Content-Type','application/json');
        res.json({success:true,status:'Registration Successful'});
      });
    }
  })
});

router.post('/login', passport.authenticate('local'),(req,res,next)=>{
  // if(!req.session.user){
  //   console.log(req.headers);
  
  //   var authHeader=req.headers.authorization;
    
  //   if(!authHeader){
  //     var err = new Error('You are not authenticated!!');
  
  //     res.setHeader('WWW-Authenticate','Basic');
  //     err.status=401;
  //     return next(err);
  //   }
  
  //   var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
  
  //   var username=auth[0];
  //   var password=auth[1];
  
  //   User.findOne({username: username})
  //   .then((user)=>{
  //     if (user===null){
  //       var err = new Error('User '+username+' does not exists !!');
  //       err.status=403;//forbidden
  //       return next(err);
  //     }
  //     else if(user.password!==password){
  //       var err = new Error('Your password is incorrect!!');
  //       err.status=403;//forbidden
  //       return next(err);
  //     }
  //     else if(user.username===username && user.password===password){
  //       res.session.user='authenticated';
  //       res.statusCode=200;
  //       res.setHeader('Content-Type','text/plain');
  //       res.end('You are authenticated!');
  //     }
//     })
//     .catch((err)=>next(err));
//   }//if part closes here
// else{
//   res.statusCode=200;//OK
//   res.setHeader('Content-Type','text/plain');
//   res.end('You are already authenticated');
// }
//===============Simplified login now using passport=========
res.statusCode=200;//OK
res.setHeader('Content-Type','application/json');
res.json({success:true,status:'You are successfully logged in !!'});

});

router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err=new Error('You are not logged in !');
    err.status=403;//Forbidden operation
    next(err);
  }
});

module.exports = router;
