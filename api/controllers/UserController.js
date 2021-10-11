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
const bcrypt = require('bcrypt');

module.exports = {

	attributes: {

		email: 'string',
		password: 'string'

	},

	login: async function (req, res) {

		console.log('logging in');

		try {
			console.log('looking for ', req.body.email);
			let user = await User.findOne({ "email": req.body.email });
			console.log("user", user);
			if (user) {
				console.log('user found', user);
				bcrypt.compare(req.body.password, user.password, function (err, match) {
					if (err) {
						req.flash('danger', 'Error matching passwords');
						return res.redirect('/login');
					}

					if (match) {
						console.log('passwords match');
						// password match
						req.session.user = user.id;
						console.log('session', req.session.user);
						req.flash("success", "Welcome " + user.email);
						return res.redirect('/blog');
					} else {
						// invalid password
						if (req.session.user) req.session.user = null;
						req.flash('danger', 'Invalid password!');
						return res.redirect('/login');
					}
				});
			} else {
				console.log("user not found");
				req.flash('danger', 'User not found!');
				return res.redirect('/login');
			}
		} catch (err) {
			console.log("err", err);
			return res.status(500).json({ error: 'DB error' })
		}

	},

	logout: async function (req, res) {
		req.session.user = null;
		res.redirect('/');
	},

	form: async function (req, res) {
		return res.view('user/login');
	}

};
