'use strict';

module.exports = function(_, passport, User, validator) {
    return {
        SetRouting : function(router) {
            router.get('/', this.indexPage);
            router.get('/signup', this.signUpPage);
            router.get('/auth/facebook', this.facebookLogin);
            router.get('/auth/facebook/callback', this.facebookCallback);
            router.get('/auth/google', this.googleLogin);
            router.get('/auth/google/callback', this.googleCallback);
            
            
            router.post('/', [
                validator.check('email').not().isEmpty().isEmail()
                .withMessage('Email is required'),
                validator.check('password').not().isEmpty().isLength({min: 6})
                .withMessage('Password is required and must be at least 6 characters'),
            ], this.postValidation, this.postLogin);


            router.post('/signup', [
                validator.check('username').not().isEmpty().isLength({min: 6})
                .withMessage('Username is required and must be at least 6 characters'),
                validator.check('email').not().isEmpty().isEmail()
                .withMessage('Email is required'),
                validator.check('password').not().isEmpty().isLength({min: 6})
                .withMessage('Password is required and must be at least 6 characters'),
            ], this.postValidation, this.postSignUp);
        },

        indexPage : function(req, res) {
            const errors = req.flash('error');
            return res.render('index', {
                title: 'Footballkik | Login',
                messages: errors,
                hasErrors: errors.length > 0
            })
        },

        signUpPage : function(req, res) {
            const errors = req.flash('error');
            return res.render('signup', {
                title: 'Footballkik | Signup',
                messages: errors,
                hasErrors: errors.length > 0
            })
        },

        facebookLogin : passport.authenticate('facebook', {
            scope: 'email'
        }),

        facebookCallback : passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        googleLogin : passport.authenticate('google', {
            scope: [
                'profile',
                'email'
                // 'https://www.googleapis.com/auth/plus.login',
                // 'https://www.googleapis.com/auth/plus.profile.emails.read'
            ]
        }),

        googleCallback : passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        postSignUp : passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '',
            failureFlash: true
        }),
        postLogin : passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '',
            failureFlash: true
        }),

        postValidation: function(req, res, next){
            const err = validator.validationResult(req);
            const reqErrors = err.array();
            const errors = reqErrors.filter(e => e.msg != 'Invalid value');
            const messages = [];
            errors.forEach(error => {
                messages.push(error.msg);
            });
            //req.flash('error', messages);

            if(messages.length > 0) {
                req.flash('error', messages);
                if(req.url == '/signup') {
                    res.redirect('/signup');
                } else if(req.url == '/') {
                    res.redirect('/');
                }
            }
            next();
        }
    }
}