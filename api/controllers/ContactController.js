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

module.exports = {
    
  
  /**
   * Action blueprints:
   *    `/contact/send`
   */
   send: function (req, res) {
    
        if(typeof(req.body.from) != undefined && req.body.subject && req.body.message) {
      
            var SendGrid = require('sendgrid').SendGrid;
            var sendgrid = new SendGrid('app22294212@heroku.com', 'tqbt2ivp');
            sendgrid.send({
              to: 'service@loftusheatingandac.com',
              from: req.body.from,
              subject: 'LoftusHeatingAndAC.com [Contact Form] : ' + req.body.name,
              text: req.body.message
            }, function(success, message) {
              if (!success) {
                return res.view('contact/index', {messages:[{type:"error", message:"There Was A Problem.  Try Again."}]});
                console.log(message);
              } else {
                return res.view('contact/index', {messages:[{type:"success", message:"Your Message Was Sent.  Thank You!"}]});  
              }
            });

        } else {
            return res.view('contact/index', {messages:[{type:"error", message:"Please fill out all of the fields!"}]});
        }
        
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ContactController)
   */
  _config: {}

  
};
