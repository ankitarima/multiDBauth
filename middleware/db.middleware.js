const mongoose = require('mongoose');
const MasterAuthSchema = require('../models/masterAuth.model');
const asyncHandler = require('./async.middleware');

exports.MasterAuthDBConnection = asyncHandler(async(req,res,next)=>{
    
    const connection_uri = 'mongodb://localhost:27017/MasterAuthDB'

    //initiating one time unique connection 
    req.globalConnectionStack = {};
    req.globalConnectionStack['default'] = {};
    req.globalConnectionStack['default'].db = mongoose.createConnection(connection_uri);

    //save user model to the corresponding stack
    req.globalConnectionStack['default'].auth = req.globalConnectionStack['default'].db.model('Masterauth', MasterAuthSchema);

    return next();
})