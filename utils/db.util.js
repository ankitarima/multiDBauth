const mongoose = require('mongoose');
const UserSchema = require('../models/user.model');

function dbConnection(req,res,next) {

    console.log('User ID For DB ' + req.globalConnectionStack['userDB']);

    const connection_uri = 'mongodb://localhost:27017/'+req.globalConnectionStack['userDB'];

    req.globalConnectionStack[req.globalConnectionStack['userDB']] = {};
    req.globalConnectionStack[req.globalConnectionStack['userDB']].db = mongoose.createConnection(connection_uri);

    //save user model to the corresponding stack
    req.globalConnectionStack[req.globalConnectionStack['userDB']].user = req.globalConnectionStack[req.globalConnectionStack['userDB']].db.model('User', UserSchema);
    // return next();
}

module.exports = {dbConnection};