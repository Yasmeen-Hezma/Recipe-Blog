const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const passportConfig = require('./config/passport');
const app = express();
const port = process.env.PORT || 4000;
require('./config/passport')(passport);


// load (dotenv) module and (config) method
require('dotenv').config();
// allow parsing data submitted through html forms
app.use(express.urlencoded({ extended: true }));
// to make static files accessible to clients
app.use(express.static('public'));
// set up ejs layouts for rendering views
app.use(expressLayouts);
// set up the flash messages
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true,
}));
app.use(flash());
app.use(fileUpload());
// all ejs templates will be rendered inside (main.ejs)
app.set('layout', './layouts/main.ejs');
// specify the view engine we use
app.set('view engine', 'ejs');

// set up passport middleware
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);
/*To make isauthenticate() local that I can use in main.js*/
const isAuthenticatedMiddleware = (req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
};
app.use(isAuthenticatedMiddleware);


const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);
app.listen(port, () => console.log(`Listening to port ${port}`));
