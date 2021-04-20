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

var async = require('async'),
	marked = require('marked');

function _gettags(callback) {

	// Get all tags
	Blog.find({tags:{'!=':null}}, {tags: 1 }).exec(function(err, tags) {

		// Error handling
		if (err) {
		return console.log(err);

		// Found tags
		} else {

			// Collect all user entered tags
			var allTags = [];
			_.each(tags, function(tag){
				_.each(tag.tags, function(postTag){
					allTags.push(postTag);
				});
			});
			
			// Filter to unique tags only
			var uniqTags = _.uniq(allTags);

			callback(null, uniqTags);

		}
	});

	};

	function _getblogs(query, limit, callback) {

		var limit = limit || false;

		function response(err, posts) {

		// Error handling
		if (err) {
		return console.log(err);

		// Found multiple users!
		} else {
		callback(null, posts);
		}
	}

	if(limit) {
		Blog.find(query).limit(limit).sort('published DESC').exec(response);
	} else {
		Blog.find(query).sort('published DESC').exec(response);
	}

	};

module.exports = {
    
  form: function(req, res) {
    return res.view('blog/create', {post:{
    	title: "",
    	body: "",
    	tags: "",
    	id: ""
    }});
  },

  create: async function (req, res) {
  
	try {

		var published = new Date()

		if(req.body.id) {
			console.log('finding blog');
			// Update blog
			let blog = await Blog.findOne({id:req.body.id});
			console.log('found blog', blog);
			if (!blog) return res.send("No blogs with that id exists!", 404);

			blog.title = req.body.title;
			blog.body = req.body.body;
			blog.tags = req.body.tags;
			blog.link = req.body.link;
			blog.updated = published;
			blog.userId = req.session.user;

			// Persist the change
			console.log('updating... ', blog);
			await Blog.updateOne({id:req.body.id}).set(blog);
			console.log("done")

			// Report back with the new state of the chicken
			req.flash("success", "Successfully update your blog.");

			res.redirect('/blog');

		} else {
			console.log('saving blog');
			// Save the blog
			await Blog.create({
				title: req.body.title,
				body: req.body.body,
				tags: req.body.tags,
				published: published,
				userId: req.session.user 
			})

			req.flash("success", "Successfully created a new blog!");
			return res.redirect('/blog');

		}

	} catch(e) {
		console.log('error', e);
		req.flash("danger", err);
		return res.redirect('/blog/create');
	}

  },

  blog: function(req, res) {

	try {
	async.parallel([

	    function(callback){
			console.log ('getting all blogs');
			// Get all blogs
			Blog.find({}).sort('published DESC').exec(function(err, posts) {

		      // Format for display
		      var moment = require("moment");
		      _.each(posts, function(post){
		      	// Format dates
		      	post.createdAtDate = moment(post.published).format('MMMM Do, YYYY');
		      	post.createAtShortDate = moment(post.published).format('MMM D, YYYY');

		        // pass through the markdown processor
	      		post.body = marked(post.body);
		      });

			  // Error handling
			  if (err) {
			    return console.log(err);

			  // Found multiple users!
			  } else {
			    callback(null, posts);
			  }
			});

	    },
	    function(callback) { 
			console.log ('calling _getblogs');
	    	// Get most recent blogs
		    _getblogs({}, 5, callback);

	    },
	    // function(callback) {

	    // 	// Get tags
		//     _gettags(callback);	

	    // }
	],
	// optional callback
	function(err, results){
		console.log ('results');
	    return res.view('blog/index', {posts: results[0], mostrecent: results[1], tag:false, tags:[]});
	});	

	} catch (e) {
		console.log('error', e);
	}

  },

  editForm: function(req, res) {
 
	// Update blog
	Blog.findOne({id:req.param('id')}).exec(function (err, blog) {
      if (err) return res.send(err,500);
      if (!blog) return res.send("No blogs with that id exists!", 404);
      res.view('blog/create', {post:blog});
  	});
  },

  delete: async function(req, res) {
	try {
		// Lookup a user
		await Blog.destroyOne({id:req.param('id')});
		req.flash("success", "Successfully delete your blog");
	    res.redirect('/blog');
	} catch(e) {
		req.flash("danger", "Failed to delete");
	    res.redirect('/blog');
	}

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
	  console.log('error', error);
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
	   
	  	// Save the blog
		// For example
		Blog.create(blog).exec(function(err, user) {

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

  view: function(req, res) {

	async.parallel([

	    function(callback){

			// Get the specific blog post
			Blog.findOne({link:req.path}).exec(function(err, post) {
		 
			  // Error handling
			  if (err) {
			    return console.log(err);

			  // Blog not found
			  } else if(!post){ 
			  	return;
			  // Blog found
			  } else {

		        // Format dates
		        var moment = require("moment");
		       
			  	if(post.published) {
			  		post.createdAtDate = moment(post.published).format('MMMM Do, YYYY');
		  	    	post.createAtShortDate = moment(post.published).format('MMM D, YYYY');  
		  		}

	  	    	// pass through the markdown processor
	      		post.body = marked(post.body);

		  		callback(null,post);
			  }
			});

	    },
	    function(callback){

	    	// Get most recent blogs
		    _getblogs({}, 5, callback);

	    },
	    // function(callback) {

	    // 	// Get tags
		//     _gettags(callback);	

	    // }
	],
	// optional callback
	function(err, results){
	    return res.view('blog/view', {post: results[0], mostrecent: results[1], tags: []});
	});

  },

  rss: function(req, res) {

	// Get all blogs
	_getblogs({}, null, function(err, posts) {

       	_.each(posts, function(post) {

       		// pass through the markdown processor
	      	body = marked(post.body);

		  	if(post.published) {
		  		// Format date RFC822
		  		post.publishedDate = moment(post.published).format('ddd, DD MMM YYYY HH:mm:ss ZZ'); 
	  		}
  		});

		return res.view('blog/rss', {host: req.get('host'), posts: posts, _layoutFile:null});
	  
	});

  },

  tags: function(req, res) {

  	_gettags(function(err, tags){
		return res.json(tags);
  	})

  },

  tag: function(req, res) {
 
	async.parallel([

	    function(callback){

			// Get all blogs with the specified tag
			_getblogs({"tags" : req.param('tag')}, 5, function(err, blogs){

				// Format output
			    var moment = require("moment");
			    _.each(blogs, function(post){
			      	post.createdAtDate = moment(post.published).format('MMMM Do, YYYY');
			      	post.createAtShortDate = moment(post.published).format('MMM D, YYYY');
  				    // pass through the markdown processor
		      	 	post.body = marked(post.body);
			    });

			    callback(null, blogs);

			});

	    },
	    function(callback){

	    	// Get most recent blogs
		    _getblogs({}, 5, callback);

	    },
	    // function(callback) {

	    // 	// Get tags
		//     _gettags(callback);	

	    // }
	],
	// optional callback
	function(err, results){
	    return res.view('blog/index', {posts: results[0], mostrecent: results[1], tag:req.param('tag'), tags:[]});
	});	

  }
  
};
