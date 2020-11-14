/**
 * ContactController
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
var sendgrid  = require('sendgrid')(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);

module.exports = {
    
  index: async function(req, res) {
    return res.view('contact/index', { messages: [{}] } );
  },

  /**
   * Action blueprints:
   *    `/contact/send`
   */
   send: async function (req, res) {

        if(typeof(req.body.from) != undefined && req.body.name && req.body.message) {
      
            sendgrid.send({
                to: 'service@loftusheatingandac.com',
                from: req.body.from,
                subject: 'LoftusHeatingAndAC.com [Contact Form] : ' + req.body.name,
                text: req.body.message
            }, function(err, json) {
                if (err) { 
                    console.error(err, json); 
                    return res.view('contact/index', {messages:[{type:"danger", message:"There Was A Problem.  Try Again."}]});
                } else {
                   return res.view('contact/index', {messages:[{type:"success", message:"Your Message Was Sent.  Thank You!"}]});  
                }
                console.log(json);
            });

        } else {
            return res.view('contact/index', {messages:[{type:"danger", message:"Please fill out all of the fields!"}]});
        }

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ContactController)
   */
  _config: {},

  shortcuts: false
  
};
