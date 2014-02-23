/**
 * BlogController
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
    
  form: function(req, res) {
    return res.view('blog/create');
  },

  create: function(req, res) {

  	// Save the blog
	// For example
	Blog.create({
	  title: req.body.title,
	  body: req.body.body,
	  tags: req.body.tags,
	  userId: req.session.user 
	}).done(function(err, user) {

	  // Error handling
	  if (err) {
	    req.flash("danger", err);
	  	return res.redirect('blog/create');

	  // The User was created successfully!
	  }else {
	  	req.flash("success", "You created a new blog!");
	  	return res.redirect('blog');
	  }
	});

  },

  blog: function(req, res) {

	// Get all blogs
	Blog.find({}).limit(10).sort('createdAt DESC').done(function(err, posts) {

      // Format dates
      var moment = require("moment");
      _.each(posts, function(post){
      	post.createdAtDate = moment(post.createdAt).format('MMMM Do, YYYY');
      	post.createAtShortDate = moment(post.createdAt).format('MMM D, YYYY')
      });

	  // Error handling
	  if (err) {
	    return console.log(err);

	  // Found multiple users!
	  } else {
	    return res.view('blog/index', {posts: posts});
	  }
	});

  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BlogController)
   */
  _config: {}

  
};
