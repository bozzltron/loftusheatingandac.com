/**
 * HomeController
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

var marked = require("marked");

module.exports = {
    
  /**
   * Action blueprints:
   *    `/home/index`
   *    `/home`
   */
   index: function (req, res) {
      
    Blog.find({}).limit(3).sort('published DESC').exec(function(err, posts) {

      // Error handling
      if (err) {
        return console.log(err);

      // Found multiple users!
      } else {

        posts.forEach(function(post){
          post.body = marked(post.body);
        });

        return res.view('home/index', {posts: posts});
      }
    });
    
  },

   alternate: function (req, res) {
      
    Blog.find({}).limit(3).sort('published DESC').exec(function(err, posts) {

      // Error handling
      if (err) {
        return console.log(err);

      // Found multiple users!
      } else {

        posts.forEach(function(post){
          post.body = marked(post.body);
        });

        return res.view('home/alternate', {posts: posts});
      }
    });
    
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to HomeController)
   */
  _config: {}

};
