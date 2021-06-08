const express = require("express");
const logger = require('morgan');
const session = require('express-session')
const cors = require('cors');
const app = express();
const config = require('./config/config');
const MongoClient = require('mongodb').MongoClient;

const url = 'https://enigmatic-hamlet-45263.herokuapp.com';
app.use(express.json());

let db;

MongoClient.connect(config.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        throw err;
    } else {
        db = client.db('medical');
        console.log("connected to database")
    }
});


//using cors
app.use(cors());

// logging requests 
app.use(logger('dev'));

//mounting db to req for every call.
app.use((req, res, next) => {
    req.db = db;
    next()
});

// using session for storage.
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "uwmot8"

}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

// loading routes 
const adminRoutes = require('./routes/adminRoutes')
const userRoute = require('./routes/userRoutes');

app.use(`${url}/api/admin/`, adminRoutes);
app.use(`${url}/api/user/`, userRoute);

//using static
app.use(express.static(__dirname + "/views"));
app.get('/*', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

module.exports = app