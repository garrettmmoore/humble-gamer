$(document).ready(function() {
var articleContainer = $("#articles");
$(document).on("click", ".scrape-new", handleArticleScrape);
$(document).on("click", "#comment", writeNote);
$(document).on("click", "#savenote", saveNote);
$(document).on("click", "#savearticle", saveArticle);


// Once the page is ready, run the start function to get things running
start();

function start() {
  console.log("We startin");
    
  // Empty the article container, run an AJAX request for articles
  articleContainer.empty();
  $.getJSON("/articles").then(function(data) {
    console.log("THis is start data " + data);
    // If we have articles, render them to the page
    if (data && data.length) {
      renderArticles(data);

    }
    else {
      // Otherwise render a message explaing we have no articles
      renderEmpty();
    }
  });
}

function handleArticleScrape() {
  // This function handles the user clicking any "scrape new article" buttons
  $.get("/scrape").then(function(data) {
    console.log("We scraping" + data);
    // If we are able to succesfully scrape  and compare the articles to those
    // already in our collection, re render the articles on the page
    // and let the user know how many unique articles we were able to save
    setTimeout(function(){ start(); }, 8000);
    console.log("Time out over");
    // bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
  });
}

// Grab the articles as a json
function renderArticles(articles) {
  console.log("Render articles works")
  $.getJSON("/articles", function(data) {
    console.log("THis is render data " + data);
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        createNewOption(data[i])
        // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      }
  });
}



  function createNewOption(data){
    var newCardDeck = $("<div class='card-deck'>");
    var newCardDiv = $("<div class='card text-center' style='width: 20rem;'>");
    // var newCardImg = $("<img class='card-img-top' src='" + data.description +  "' alt='Card image cap'>");
    var nextNewDiv = $("<div class='card-body'>");
    // var cardTitle = $("<p data-id='" + data._id + "'>").text("Saved Status: " + data.saved);
    // console.log(cardTitle);
    var newResBody = $("<p class='card-text-title'>").text("Title: " + data.title);
    // var newMonthBody = $("<p class='card-text'>").text("Description: " + data.description);
    var newLinkBody = $("<p><a href='" + data.link +  "'> " + data.link + " </a></p>");
    // $(document).ready(function() {
    //   $( ".class" ).append( "<p><a src='" + data.link +  "'>Google</a></p>" );
    // });
    var button = $("<button data-id='" + data._id + "' id='comment' type='button' class='btn btn-info'>Comment</button>")
    var buttonArticle = $("<button data-id='" + data._id + "' id='savearticle' type='button' class='btn btn-primary'>Save Article</button>")

    articleContainer.append(newCardDeck);
    newCardDeck.append(newCardDiv);
    newCardDiv.append(nextNewDiv);
    // newCardDiv.append(newCardImg);
    // nextNewDiv.append(cardTitle);
    nextNewDiv.append(newResBody);
    // nextNewDiv.append(newMonthBody);
    nextNewDiv.append(newLinkBody);
    nextNewDiv.append(button);
    nextNewDiv.append(buttonArticle);

    return newCardDiv;
};

  // Whenever someone clicks a comment button
  function writeNote() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea class='form-control' id='bodyinput' name='body' rows='3'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote' type='button' class='btn btn-primary'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  }

  function saveArticle() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "PUT",
      url: "/articles/next/saved/" + thisId,
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        start();
        // Empty the notes section
        // $("#notes").empty();
      });
  };
  
  // When you click the savenote button
function saveNote() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  };

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  
});