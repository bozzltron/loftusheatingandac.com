/**
 * ProductsController
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

var http = require("http");
var XML = require("xml2json");

function urlToJSON(url, cb) {

	var req = http.get(url, function(xmlRes) {

	    var pageData = "";
	    
	    xmlRes.on('data', function (chunk) {
	      pageData += chunk;
	    });

	    xmlRes.on('end', function(){

	      var json = JSON.parse(XML.toJson(pageData));

	      cb(json);

	    });

  	});

}

module.exports = {
      
  index: function(req, res) {

	//Lennox.com Product API URL for Product Categories
	var url = "http://www.lennox.com/api/v1/RcI1g2o/categories/";

	urlToJSON(url, function(json){

		return res.view('products/index', {categories:json.Categories.Category});

	});

  },

  category: function(req, res) {

  	var cat = req.param('cat');

	//Lennox.com Product API URL for Product Categories
	var url = "http://www.lennox.com/api/v1/RcI1g2o/category/" + cat + "/";
	
	urlToJSON(url, function(json){

		return res.view('products/category', {products:json.Products, category:cat});

	});

  },

  product: function(req, res) {

  	var product = req.param('product');

	//Lennox.com Product API URL for Product Categories
	var url = "http://www.lennox.com/api/v1/RcI1g2o/product/" + product + "/";
	
	urlToJSON(url, function(json){

		return res.view('products/product', {product:json.ProductInfo.Product});

	});

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProductsController)
   */
  _config: {}

  
};
