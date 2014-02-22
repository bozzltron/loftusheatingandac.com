// Pull in dependencies
var fs = require('fs'),
             xml2js = require('xml2js');

// Setup parser
var parser = new xml2js.Parser();

// To make things easier, I saved the rss feed as an xml file
// so we read that in here.
fs.readFile('feed.xml', 'utf8', function (err, data) {
  if (err) throw err;

  // A simple loop that iterates over all the posts and generates
  // the markdown documents
  parser.parseString(data, function (err, result) {
        console.log(result.rss.channel);
        //var posts = result.node.node;
        //console.log(JSON.stringify(posts));

        fs.writeFile("blog.json", JSON.stringify(result.rss.channel), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		}); 

    });
});