// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Set up an Express Router
var router = express.Router();

// Require our routes file pass our router object
require("./config/routes")(router);

// Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Have every request go through our router middleware
app.use(router);

// Database configuration with mongoose
mongoose.connect('mongodb://heroku_kx1ml25z:ph1baftd1asn9e6h2i5nr52ub9@ds149324.mlab.com:49324/heroku_kx1ml25z', { useMongoClient: true });
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======
// get post
// A GET request to scrape the gamespot website

// app.get("/", function(req, res) {
//   res.send(index.html);
// });


// app.get("/scrape", function(req, res) {
//     // First, we grab the body of the html with request
//     request("https://www.polygon.com/", function(error, response, html) {
//       console.log("request route being hit")
//       // Then, we load that into cheerio and save it to $ for a shorthand selector
//       var $ = cheerio.load(html);
//       // Now, we grab every h2 within an article tag, and do the following:
//       $("div.c-entry-box--compact--article").each(function(i, element) {
//         console.log("article is being scraped")
  
//         // Save an empty result object
//         var result = {};
  
//         // Add the text and href of every link, and save them as properties of the result object
//         result.title = $(element).children(".c-entry-box--compact__body").children(".c-entry-box--compact__title").text().replace(/\n/g, '');
//         result.link = $(element).children().attr("href");
//         result.description = $(element).children().children().children().children().attr("src");
      
//         // $("div.media-body").each(function(i, element) {      
//         //   result.description = $(element).children(".media-deck").text();
//         // });

//         // $("div.imgflare--river").each(function(i, element) {
//         //   result.imgLink = $(element).children().attr("src");
//         // });
  
//         // Using our Article model, create a new entry
//         // This effectively passes the result object to the entry (and the title and link)
//         var entry = new Article(result);
  
//         // Now, save that entry to the db
//         entry.save(function(err, doc) {
//           // Log any errors
//           if (err) {
//             console.log(err);
//           }
//           // Or log the doc
//           else {
//             console.log(doc);
//           }
//         });
  
//       });
//     });
//     // Tell the browser that we finished scraping the text
//     res.send("Scrape Complete");
//   });
  
//   // This will get the articles we scraped from the mongoDB
//   app.get("/articles", function(req, res) {
//     // Grab every doc in the Articles array
//     Article.find({}, function(error, docs) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Or send the doc to the browser as a json object
//       else {
//         res.json(docs);
//       }
//     });
//   });

//   // This will get the articles we scraped from the mongoDB
//   app.get("/articles/saved/", function(req, res) {
//     // Grab every doc in the Articles array
//     Article.find({saved:true}, function(error, docs) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Or send the doc to the browser as a json object
//       else {
//         res.json(docs);
//       }
//     });
//   });
  
//   // Grab an article by it's ObjectId
//   app.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     Article.findById(req.params.id)
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     // now, execute our query
//     .exec(function(error, doc) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise, send the doc to the browser as a json object
//       else {
//         res.json(doc);
//       }
//     });
//   });
  
  
//   // Create a new note or replace an existing note
//   app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     var newNote = new Note(req.body);
  
//     // And save the new note the db
//     newNote.save(function(error, doc) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise
//       else {
//         // Use the article id to find and update it's note
//         Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
//         // Execute the above query
//         .exec(function(err, doc) {
//           // Log any errors
//           if (err) {
//             console.log(err);
//           }
//           else {
//             // Or send the document to the browser
//             res.send(doc);
//           }
//         });
//       }
//     });
//   });

//     // Update Article to saved!
//     app.put("/articles/next/saved/:id", function(req, res) {

//           // Use the article id to find and update it's note
//           Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
//           // Execute the above query
//           .exec(function(err, doc) {
//             // Log any errors
//             if (err) {
//               console.log(err);
//             }
//             else {
//               // Or send the document to the browser
//               res.send(doc);
//             }
//           });

//     });
  
  // Listen on port 3000
  app.listen(PORT, function() {
    console.log("App running on port 3000!");
  });