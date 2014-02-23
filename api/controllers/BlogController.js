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
    return res.view('blog/create', {post:{
    	title: "",
    	body: "",
    	tags: "",
    	id: ""
    }});
  },

  create: function(req, res) {

  	var published = new Date().getTime();

  	if(req.body.id) {

		// Update blog
		Blog.find({_id:req.body.id}).done(function (err, blog) {

	      if (err) return res.send(err,500);
	      if (!blog) return res.send("No blogs with that id exists!", 404);
	      
	      blog = blog[0];
	      blog.title = req.body.title;
	      blog.body = req.body.body;
	      blog.tags = req.body.tags;
	      blog.updated = published;
	      blog.userId = req.session.user;

	      // Persist the change
	      blog.save(function (err) {
	        if (err) return res.send(err,500);

	        // Report back with the new state of the chicken
	        req.flash("success", "Successfully update your blog.");
	        res.redirect('blog');
	      });

	  	});

  	} else {

	  	// Save the blog
		// For example
		Blog.create({
		  title: req.body.title,
		  body: req.body.body,
		  tags: req.body.tags,
		  published: published,
		  userId: req.session.user 
		}).done(function(err, user) {

		  // Error handling
		  if (err) {
		    req.flash("danger", err);
		  	return res.redirect('blog/create');

		  // The User was created successfully!
		  }else {
		  	req.flash("success", "Successfully created a new blog!");
		  	return res.redirect('blog');
		  }
		});

	}

  },

  blog: function(req, res) {

	// Get all blogs
	Blog.find({}).limit(10).sort('published DESC').done(function(err, posts) {

      // Format dates
      var moment = require("moment");
      _.each(posts, function(post){
      	post.createdAtDate = moment(post.published).format('MMMM Do, YYYY');
      	post.createAtShortDate = moment(post.published).format('MMM D, YYYY')
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

  editForm: function(req, res) {
 
	// Update blog
	Blog.find({_id:req.param('id')}).exec(function (err, blog) {
      if (err) return res.send(err,500);
      if (!blog) return res.send("No blogs with that id exists!", 404);
      console.log(blog[0]);
      res.view('blog/create', {post:blog[0]});
  	});
  },

  delete: function(req, res) {
  	// Lookup a user
	Blog.find({_id:req.param('id')}).done(function(err, blog) {

	  	// destroy the record
	  	blog[0].destroy(function(err) {
	    	// record has been removed
	    	req.flash("success", "Successfully delete your blog");
	    	res.redirect('blog');
	  	});

	});
  },

  importForm: function(req, res) {
	return res.view('blog/import');
  },

  import: function(importReq, importRes) {

	var FeedParser = require('feedparser')
	  , request = require('request');

	var success = 0, failure = 0, userId = importReq.session.user;

	var req = request(importReq.body.feed)
	  , feedparser = new FeedParser();

	req.on('error', function (error) {
	  // handle any request errors
	});
	req.on('response', function (res) {
	  var stream = this;

	  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

	  stream.pipe(feedparser);
	});


	feedparser.on('error', function(error) {
	  // always handle errors
	});
	feedparser.on('readable', function() {
	  // This is where the action is!
	  var stream = this
	    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
	    , item;

	  while (item = stream.read()) {
	    
	    var blog = {
	    	title : item.title,
	    	body : item.summary,
	    	link : item.link,
	    	published: item.pubDate,
	    	userId : userId,
	    	tags : ""
	    };
	    console.log(blog);
	  	// Save the blog
		// For example
		Blog.create(blog).done(function(err, user) {

		  // Error handling
		  if (err) {
		  	failure++;

		  // The User was created successfully!
		  }else {
		  	success++;
		  }
		});

	  }

	});

	importReq.flash("info", "Imported " + success + " of " + (success+failure));
	importRes.redirect('/blog/import');

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BlogController)
   */
  _config: {},

  shortcuts: false
  
};