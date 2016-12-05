var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();

var server = express();
server.use (express.static ('public'));
server.use (bodyParser.urlencoded ({ extended: true }));
server.use (bodyParser.json ());
var methodOverride = require ('method-override');

server.use (methodOverride (function (request, response) {

    if (request.body) {
        if (typeof request.body === 'object') {
            if (request.body._method) {
                var method = request.body._method;
                delete request.body._method;
                return method;
            }
        }
    }
}, ['GET', 'POST']));


var session= require ('express-session');
server.use (session ({
    secret: 'secret phrase',
    resave: false,
    saveUninitialized: true
}));


var flash = require ('connect-flash');
server.use (flash ());

server.use (function (request, response, next) {
    response.locals.user = request.session.user;
    response.locals.message = request.flash ();

    request.contentType = contentType;
    var contentType = request.headers ['content-type'];

    if (contentType == 'application/json') {
    request.sendJson = true;
    }
    console.log ('**** REQUEST BODY: ', request.body);

    next();
});

var port= 3000;
var handlebars = require ('express-handlebars');
server.engine ('.hbs', handlebars ({
    layoutsDir: 'templates',
    defaultLayout: 'index',
    extname: '.hbs'
}));

server.set ('views', __dirname + '/templates/partials');
server.set ('view engine', '.hbs');


var mongoClient = require ('mongodb').MongoClient;
global.db;

mongoClient.connectn ('mongodb://localhost:27017/sample_database', function (error, database) {
    if (error) {
        console.error ('*** ERROR: Unable to connect to the mongo database.');
        console.error (error);
    }
    else {
        server.listen (port, function (error) {
            if (error !== undefined) {
                console.error ('*** ERROR: Unable to start the server.');
                console.error (error);
            }
            else {
                db = database;

                console.log ('- The server has successfully started on port: ' + port);
            }
        });
    }
});

var mongoose = require('mongoose');
mongoose.connect ('mongodb://localhost:27017/sample_database');
mongoose.Promise = require ('bluebird');
