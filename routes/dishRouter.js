const express=require('express');
const bodyParser=require('body-parser');
const { Mongoose } = require('mongoose');
//include mongoose
const mongoose=require('mongoose');
const Dishes = require('../modals/dishes');
//import authenticate for controlling routes
const authenticate =require('../authenticate');

const dishRouter=express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')

.get((req,res,next)=>{
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);   
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
  Dishes.create(req.body)
  .then((dish)=>{
      console.log('Dish Created!!',dish);
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json(dish);
  },(err)=>next(err))
  .catch((err)=>next(err));  
})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;//Forbidden
    res.end('Put operation not supported on /dishes');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end('Deleting all the dishes!!');
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

//for the dishId
dishRouter.route('/:dishId')
.get((req,res,next)=>{
    // res.end('Will send details of the dish: '+req.params.dishId+' to you!!!');
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        console.log('Dish Created!!',dish);
        res.statusCode=200;//Status OK
        res.setHeader('Content-Type','application/json');
        res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode=403;//Forbidden
  res.end('Post operation not supported on /dishes/'+req.params.dishId);  
})

.put(authenticate.verifyUser,(req,res,next)=>{
    // res.statusCode=200;
    // res.write('Updating the dish:'+req.params.dishId+'\n');
    // res.end('Will update the dish: '+req.body.name+' with details '+req.body.description);
    Dishes.findByIdAndUpdate(req.params,dishId,{
        $set:req.body
    },{new:true})
    .then((dish)=>{
        console.log('Dish Updated!!',dish);
        res.statusCode=200;//ok
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end('Deleting dish: '+req.params.dishId);
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200//OK
        res.setHeader('Content-Type','application/json');
        res.json(resp);

    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports=dishRouter;