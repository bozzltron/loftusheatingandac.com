/**
 * Blog
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    tag : ""
    
  },

  beforeCreate: function (attrs, next) {

  	// Save tags as an array
    if(attrs.tags) {
    	attrs.tags = attrs.tags.replace(/\s+/g, '').split(",");
    }

    var date = new Date();

    // Generate fancy url
    attrs.link = '/' + ['blog', date.getFullYear(),  date.getMonth() + 1, attrs.title.replace(/\s+/g, '-').toLowerCase()].join('/');

    next();
  },    

  beforeUpdate: function (updated, next) {
  	// Save tags as an array
    if(updated.tags) {
    	updated.tags = updated.tags.replace(/\s+/g, '').split(",");
    }
    next();
  },    

};
