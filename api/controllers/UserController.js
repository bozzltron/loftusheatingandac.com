/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
	attributes: {

    	email    : 'string',
    	password : 'string'

	},

	login: async function (req, res) {
	    var bcrypt = require('bcrypt-nodejs');
		
		console.log('logging in');
	    
		User.findOne({"email":req.body.email}).exec(function (err, user) {
	      if (err) { 
			  console.log("err", err);
			  return res.json({ error: 'DB error' }, 500);
		  }

	      if (user) {
			console.log('user found', user);
	        bcrypt.compare(req.body.password, user.password, function (err, match) {
	          if (err) res.json({ error: 'Server error' }, 500);

	          if (match) {
				console.log('passwords match');
	            // password match
	            req.session.user = user.id;
				console.log('session', req.session.user);
	            req.flash("success", "Welcome "+ user.email);
	            res.redirect('/blog');
	          } else {
	            // invalid password
	            if (req.session.user) req.session.user = null;
	            req.flash('danger', 'Invalid password!');
	            res.redirect('/login');
	          }
	        });
	      } else {
			console.log("user not found");
	      	req.flash('danger', 'User not found!');
	        res.redirect('/login');
	      }
	    });
	},

	logout: async function(req, res) {
		req.session.user = null;
		res.redirect('/');
	},

	form: async function(req, res) {
		return res.view('user/login');
	}
	
};
