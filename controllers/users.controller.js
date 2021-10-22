const axios = require('axios');
const ErrorResponse = require('../utils/error.util');
const asyncHandler = require('../middleware/async.middleware');
const { dbConnection } = require('../utils/db.util')


exports.register = asyncHandler((async (req, res, next)=>{

  const { name, email, password } = req.body;

  // Register using Auth0
  const headers = {
    'Content-Type': 'application/json'
  }

  const data = {
    'client_id':process.env.AUTH0CLIENTID,
    'connection':process.env.AUTH0DBCONNECTION,
    'email':email,
    'password':password
  }

  const Auth0Response = await axios.post(`${process.env.AUTH0API}/dbconnections/signup`, data, {
    headers: headers
  })

    const regsiterUser = await req.globalConnectionStack['default'].auth.create({
      name,
      email,
      user_id: Auth0Response.data._id
    });

    req.globalConnectionStack['userDB'] = 'user_'+regsiterUser.id;

      dbConnection(req, res, next);

      const user = await req.globalConnectionStack[req.globalConnectionStack['userDB']].user.create({
        name,
        email
      });

    res.status(200).json({success:true, data:Auth0Response.data})

}))

exports.login = asyncHandler((async (req, res, next)=>{

  const { email, password } = req.body;

    const authDBUser = await req.globalConnectionStack['default'].auth.findOne({email});

    if(!authDBUser){
      return next(new ErrorResponse('No User Found', 401))
    }else{
      req.globalConnectionStack['userDB'] = 'user_'+authDBUser.id;
    }

    // Login functionality using Auth0

    // const headers = {
    //   'content-type': 'application/x-www-form-urlencoded'
    // }
  
    // const data = {
    //   'client_id':process.env.AUTH0CLIENTID,
    //   'connection':process.env.AUTH0DBCONNECTION,
    //   'client_secret':process.env.AUTH0CLIENTSECRET,
    //   'audience': process.env.AUTH0AUDIENCE,
    //   'grant_type': 'password',
    //   'username':email,
    //   'password':password
    // }
  
    // const Auth0Response = await axios.post(`${process.env.AUTH0API}/oauth/token`, data, {
    //   headers: headers
    // });

  
    dbConnection(req, res, next);

    //Validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Please provide email and password', 400))
    }

    //Check for user
    const user = await req.globalConnectionStack[req.globalConnectionStack['userDB']].user.findOne({email});

    if(!user){
        return next(new ErrorResponse('No User Found', 401))
    }

    // res.status(200).json({success:true,DbUser, user, Auth0Response})
    res.status(200).json({success:true,authDBUser, user})

}))