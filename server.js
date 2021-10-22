const express = require('express');
const dotEnv = require('dotenv');
const {MasterAuthDBConnection} = require('./middleware/db.middleware');
const errorHandler = require('./middleware/error.middleware');

const users = require('./routes/users.route');

// Load env config
dotEnv.config({ path: './config/config.env'});

// Initializing main express app
const app = express();
app.use(express.json());

app.use(MasterAuthDBConnection);

app.get('/', function(req, res) {
    var host = req.headers.host; 
    req.globalConnectionStack[host].user.find({}, function(err, data) {
        res.json(data);
    })
});

app.use('/api/v1/users', users);

// errorHandler middleware
app.use(errorHandler);

//server starts here
app.listen(3000, function() {
    console.log('App listening on port 3000!');
});