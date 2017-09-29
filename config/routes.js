var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var request = require("request");
var cheerio = require("cheerio");


module.exports = function(router) {

    router.get("/", function(req, res) {
        res.render("home");
      });

    router.get("/saved", function(req, res) {
        res.render("saved");
    });

    router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://www.polygon.com/", function(error, response, html) {
      console.log("request route being hit")
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.c-entry-box--compact--article").each(function(i, element) {
        console.log("article is being scraped")
  
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).children(".c-entry-box--compact__body").children(".c-entry-box--compact__title").text().replace(/\n/g, '');
        result.link = $(element).children().attr("href");
        result.description = $(element).children().children().children().children().attr("src");
      
        // $("div.media-body").each(function(i, element) {      
        //   result.description = $(element).children(".media-deck").text();
        // });

        // $("div.imgflare--river").each(function(i, element) {
        //   result.imgLink = $(element).children().attr("src");
        // });
  
        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(result);
  
        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
  
      });
    });
    // Tell the browser that we finished scraping the text
    res.send("Scrape Complete");
  });

  // This will get the articles we scraped from the mongoDB
  router.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function(error, docs) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        res.json(docs);
      }
    });
  });

    // This will get the articles we scraped from the mongoDB
  router.get("/articles/saved/", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({saved:true}, function(error, docs) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        res.json(docs);
      }
    });
  });

    // Grab an article by it's ObjectId
  router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findById(req.params.id)
    // ..and populate all of the notes associated with it
    .populate("note")
    // now, execute our query
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });

  // Create a new note or replace an existing note
  router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);
  
    // And save the new note the db
    newNote.save(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's note
        Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
        // Execute the above query
        .exec(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            // Or send the document to the browser
            res.send(doc);
          }
        });
      }
    });
  });

      // Update Article to saved!
    router.put("/articles/next/saved/:id", function(req, res) {

          // Use the article id to find and update it's note
          Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
          // Execute the above query
          .exec(function(err, doc) {
            // Log any errors
            if (err) {
              console.log(err);
            }
            else {
              // Or send the document to the browser
              res.send(doc);
            }
          });

    });









};