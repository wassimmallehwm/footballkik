const express = require('express');
// const validator = require('express-validator');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const mongoStore = require('connect-mongo')(session);
const http = require('http');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const { Users } = require('./helpers/usersClass');
const { Global } = require('./helpers/Global');
const container = require('./container');

container.resolve(function(users, _, admin, home, group, results) {

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    })
    const app = setUpExpress();

    function setUpExpress() {
        const app = express();
        const appServer = app.listen(3000, function() {
            console.log("Listening on port 3000");
        })
        const io = socketIO(appServer);
        configExpress(app);
        require('./socket/groupChat')(io, Users);
        require('./socket/friend')(io);
        require('./socket/globalRoom')(io, Global, _);
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        results.SetRouting(router);
    
        app.use(router);
    }

    function configExpress(app){
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json())
   .use(bodyParser.urlencoded());
        // app.use(validator());
        app.use(session({
            secret : "secret-key",
            resave: true,
            saveUninitialized: true,
            store: new mongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ = _;
    }
});
