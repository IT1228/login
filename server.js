const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');

var session = require('express-session');

var application = express();

application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

var users = [{ 
    username: 'admin', 
    email: 'admin@admin.com', 
    password: 'qwer1234'
}];

application.use(cookieParser());
application.use(bodyParser.urlencoded());
application.use('/public', express.static('./public'));
application.use(session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: true
}));

application.get('/', (request,response) => {
    if (request.session.isAuthenticated != true) {
        response.render('login');
    } else {
        response.redirect('login-success');
    }
});

application.get('/login', (request, response) => {
    response.render('login');
});

application.get('/login-success', (request, response) => {

    if (request.session.isAuthenticated === false) {
        response.redirect('login');
    }
    else {
        response.render('login-success');

        
    }
});


application.post('/login', (request, response) => {
    var user = users.find(user => {return user.email === request.body.email && user.password === request.body.password});
    if (user) {
        request.session.isAuthenticated = true;
        request.session.name = user.name;
        request.session.email = user.email;
        request.session.views = 1;
        response.render('login-success');

    } else { 
        response.render('login', user);
    }
});




application.listen(3000);