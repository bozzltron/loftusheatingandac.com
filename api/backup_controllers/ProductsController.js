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

var https = require("https");
var xml = require("nodexml");

function urlToJSON(url, callback) {

	var req = https.get(url, function(xmlRes) {

	    var pageData = "";
	    
	    xmlRes.on('data', function (chunk) {
	      pageData += chunk;
	    });

	    xmlRes.on('end', function(){

			var json = xml.xml2obj(pageData);
          console.log(json);
	      	callback(json);

	    });

  	});

}

module.exports = {
      
  index: async function(req, res) {

	//Lennox.com Product API URL for Product Categories

	var url = "https://api.lennox.com/v1/RcI1g2o/categories/";

	urlToJSON(url, function(json){

		return res.view('products/index', {categories:json.Categories.Category});

	});

  },

  category: async function(req, res) {

  	var cat = req.param('cat');

	//Lennox.com Product API URL for Product Categories
	var url = "https://api.lennox.com/v1/RcI1g2o/category/" + cat + "/";
	
	urlToJSON(url, function(json){

		return res.view('products/category', {products:json.Products, category:cat});

	});

  },

  product: async function(req, res) {

  	var product = req.param('product');

	//Lennox.com Product API URL for Product Categories
	var url = "https://api.lennox.com/v1/RcI1g2o/product/" + product + "/";
	
	urlToJSON(url, function(json){

		var product = json.ProductInfo.Product;

		return res.view('products/product', {product:product});

	});

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProductsController)
   */
  _config: {}

  
};
